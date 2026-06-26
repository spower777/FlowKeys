import type { TypingStats, CommonMistake, ReplayEvent } from './types'
import { charToFinger } from './fingerMap'
import type { KeyboardLayout } from './keyboardLayouts'

const POLISH_CHARS = new Set('ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')
const MAX_ALIGN = 600

// Normalize typographic dashes to hyphen-minus so "—" and "–" never cause
// false errors when the user presses the regular "-" key.
export function normalizeDashes(s: string): string {
  return s.replace(/[–—]/g, '-')
}

export type AlignOp =
  | { op: 'match'; ch: string }
  | { op: 'sub'; expected: string; actual: string }
  | { op: 'ins'; actual: string }
  | { op: 'del'; expected: string }

export function align(source: string, typed: string): AlignOp[] {
  const s = source.slice(0, MAX_ALIGN)
  const t = typed.slice(0, MAX_ALIGN)
  const n = s.length
  const m = t.length

  // Wagner-Fischer edit distance with backtrack
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const ops: AlignOp[] = []
  let i = n, j = m
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s[i - 1] === t[j - 1]) {
      ops.unshift({ op: 'match', ch: s[i - 1] })
      i--; j--
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.unshift({ op: 'sub', expected: s[i - 1], actual: t[j - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
      ops.unshift({ op: 'ins', actual: t[j - 1] })
      j--
    } else {
      ops.unshift({ op: 'del', expected: s[i - 1] })
      i--
    }
  }

  return ops
}

// Reconstructs which source positions had a wrong keystroke at any point during
// typing, even if the user later backspaced and retyped correctly.
export function computeCorrectedPositions(rawTrainingText: string, replayData: ReplayEvent[]): Set<number> {
  const normalized = normalizeDashes(rawTrainingText)
  const corrected = new Set<number>()
  let pos = 0
  for (const event of replayData) {
    if (event.isBackspace) {
      if (pos > 0) pos--
    } else {
      if (pos < normalized.length && event.char !== normalized[pos]) {
        corrected.add(pos)
      }
      pos++
    }
  }
  return corrected
}

export function analyzeTyping(
  sourceText: string,
  typedText: string,
  startTime: number,
  endTime: number,
  backspaceCount = 0,
  layout: KeyboardLayout = 'qwerty'
): TypingStats {
  const elapsedMin = Math.max((endTime - startTime) / 60000, 0.01)
  const ops = align(normalizeDashes(sourceText), normalizeDashes(typedText))

  let matches = 0
  let subCount = 0
  let insCount = 0
  let polishCharsMissed = 0
  const mistakeMap = new Map<string, Map<string, number>>()
  const fingerErrors: Record<string, number> = {}
  let currentStreak = 0
  let bestStreak = 0

  for (const op of ops) {
    if (op.op === 'match') {
      matches++
      currentStreak++
      if (currentStreak > bestStreak) bestStreak = currentStreak
    } else if (op.op === 'sub') {
      subCount++
      currentStreak = 0
      if (POLISH_CHARS.has(op.expected)) polishCharsMissed++
      if (!mistakeMap.has(op.expected)) mistakeMap.set(op.expected, new Map())
      const m = mistakeMap.get(op.expected)!
      m.set(op.actual, (m.get(op.actual) ?? 0) + 1)
      const finger = charToFinger(op.expected, layout)
      if (finger) fingerErrors[finger] = (fingerErrors[finger] ?? 0) + 1
    } else if (op.op === 'ins') {
      insCount++
      currentStreak = 0
    } else {
      // del — skipped source char, not an active typing mistake
      currentStreak = 0
      if (POLISH_CHARS.has(op.expected)) polishCharsMissed++
    }
  }

  const charsTyped = typedText.length
  const wordsTyped = typedText.trim() === '' ? 0 : typedText.trim().split(/\s+/).length
  const wpm = Math.round(charsTyped / 5 / elapsedMin)

  // accuracy: of all chars the user actively typed, what fraction was correct.
  // Reserve 100% for truly perfect runs — never round up to 100 when errors exist.
  const attemptedTyped = matches + subCount + insCount
  const accuracy = attemptedTyped > 0
    ? (matches === attemptedTyped
        ? 100
        : Math.min(99, Math.round((matches / attemptedTyped) * 100)))
    : 100

  // completion: how many source chars did the user actually attempt
  const coveredSource = matches + subCount
  const sourceLen = Math.min(sourceText.length, MAX_ALIGN)
  const completionPercent = sourceLen > 0
    ? Math.min(100, Math.round((coveredSource / sourceLen) * 100))
    : 100

  // mistakesCount: only active mistakes (sub + ins), NOT untyped source chars (del)
  const mistakesCount = subCount + insCount

  const commonMistakes: CommonMistake[] = []
  for (const [expected, actualMap] of mistakeMap) {
    for (const [actual, count] of actualMap) {
      commonMistakes.push({ expected, actual, count })
    }
  }
  commonMistakes.sort((a, b) => b.count - a.count)

  // Difficult words: words from source that contain at least one non-match op
  const difficultWords: string[] = []
  let opIdx = 0
  for (const word of sourceText.slice(0, MAX_ALIGN).split(/\s+/)) {
    let hasMistake = false
    let consumed = 0
    while (consumed < word.length && opIdx < ops.length) {
      const op = ops[opIdx]
      if (op.op === 'ins') { opIdx++; continue }
      if (op.op !== 'match') hasMistake = true
      consumed++
      opIdx++
    }
    if (hasMistake && word.replace(/[.,!?;:]/g, '').length > 2) {
      difficultWords.push(word.replace(/[.,!?;:]/g, ''))
    }
    // skip space in ops
    if (opIdx < ops.length && ops[opIdx]?.op === 'match') opIdx++
  }

  // Indeks spokoju: accuracy penalized for backspace overuse
  // bsRate = backspaces per typed char; clamped penalty max 40pts
  const totalKeystrokes = Math.max(1, charsTyped + backspaceCount)
  const bsPenalty = Math.min(40, Math.round((backspaceCount / totalKeystrokes) * 80))
  const calmScore = Math.max(0, accuracy - bsPenalty)

  return {
    wordsTyped,
    charsTyped,
    wpm,
    accuracy,
    completionPercent,
    mistakesCount,
    commonMistakes: commonMistakes.slice(0, 8),
    difficultWords: [...new Set(difficultWords)].slice(0, 6),
    polishCharsMissed,
    backspaceCount,
    bestStreak,
    calmScore,
    errorsByFinger: fingerErrors,
  }
}

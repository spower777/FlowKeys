import type { TypingStats, CommonMistake } from './types'

const POLISH_CHARS = new Set('ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')
const MAX_ALIGN = 600

type AlignOp =
  | { op: 'match'; ch: string }
  | { op: 'sub'; expected: string; actual: string }
  | { op: 'ins'; actual: string }
  | { op: 'del'; expected: string }

function align(source: string, typed: string): AlignOp[] {
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

export function analyzeTyping(
  sourceText: string,
  typedText: string,
  startTime: number,
  endTime: number
): TypingStats {
  const elapsedMin = Math.max((endTime - startTime) / 60000, 0.01)
  const ops = align(sourceText, typedText)

  let matches = 0
  let polishCharsMissed = 0
  const mistakeMap = new Map<string, Map<string, number>>()

  for (const op of ops) {
    if (op.op === 'match') {
      matches++
    } else if (op.op === 'sub') {
      if (POLISH_CHARS.has(op.expected)) polishCharsMissed++
      if (!mistakeMap.has(op.expected)) mistakeMap.set(op.expected, new Map())
      const m = mistakeMap.get(op.expected)!
      m.set(op.actual, (m.get(op.actual) ?? 0) + 1)
    } else if (op.op === 'del') {
      if (POLISH_CHARS.has(op.expected)) polishCharsMissed++
    }
  }

  const charsTyped = typedText.length
  const wordsTyped = typedText.trim() === '' ? 0 : typedText.trim().split(/\s+/).length
  const wpm = Math.round(charsTyped / 5 / elapsedMin)
  const accuracy = sourceText.length > 0
    ? Math.round((matches / Math.min(sourceText.length, MAX_ALIGN)) * 100)
    : 100
  const mistakesCount = ops.filter(o => o.op !== 'match').length

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

  return {
    wordsTyped,
    charsTyped,
    wpm,
    accuracy,
    mistakesCount,
    commonMistakes: commonMistakes.slice(0, 8),
    difficultWords: [...new Set(difficultWords)].slice(0, 6),
    polishCharsMissed,
  }
}

import type { TypingStats, CommonMistake } from './types'

const POLISH_CHARS = new Set('ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')

export function analyzeTyping(
  sourceText: string,
  typedText: string,
  startTime: number,
  endTime: number
): TypingStats {
  const elapsedMin = Math.max((endTime - startTime) / 60000, 0.01)

  let correct = 0
  const mistakeMap = new Map<string, Map<string, number>>()

  const compareLen = Math.min(sourceText.length, typedText.length)
  for (let i = 0; i < compareLen; i++) {
    if (sourceText[i] === typedText[i]) {
      correct++
    } else {
      const expected = sourceText[i]
      const actual = typedText[i]
      if (!mistakeMap.has(expected)) mistakeMap.set(expected, new Map())
      const m = mistakeMap.get(expected)!
      m.set(actual, (m.get(actual) ?? 0) + 1)
    }
  }

  const charsTyped = typedText.length
  const extraChars = Math.max(0, charsTyped - sourceText.length)
  const mistakesCount = compareLen - correct + extraChars

  const wordsTyped = typedText.trim() === '' ? 0 : typedText.trim().split(/\s+/).length
  const wpm = Math.round(charsTyped / 5 / elapsedMin)
  const accuracy = charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 100

  const commonMistakes: CommonMistake[] = []
  for (const [expected, actualMap] of mistakeMap) {
    for (const [actual, count] of actualMap) {
      commonMistakes.push({ expected, actual, count })
    }
  }
  commonMistakes.sort((a, b) => b.count - a.count)

  // Find words that contain at least one mistake
  const difficultWords: string[] = []
  let charIdx = 0
  for (const word of sourceText.split(/\s+/)) {
    let hasMistake = false
    for (let j = 0; j < word.length; j++) {
      const si = charIdx + j
      if (si < typedText.length && sourceText[si] !== typedText[si]) {
        hasMistake = true
        break
      }
    }
    if (hasMistake && word.length > 2) difficultWords.push(word.replace(/[.,!?;:]/g, ''))
    charIdx += word.length + 1
  }

  let polishCharsMissed = 0
  for (let i = 0; i < compareLen; i++) {
    if (POLISH_CHARS.has(sourceText[i]) && sourceText[i] !== typedText[i]) {
      polishCharsMissed++
    }
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

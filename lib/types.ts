export type TransformMode = '1to1' | 'clean' | 'story' | 'exercise' | 'polish_chars'
export type TypingMode = 'normal' | 'blind' | 'no_backspace'
export type TextViewMode = 'full' | 'sentence' | 'word'

export interface CommonMistake {
  expected: string
  actual: string
  count: number
}

export interface TypingStats {
  wordsTyped: number
  charsTyped: number
  wpm: number
  accuracy: number
  completionPercent: number
  mistakesCount: number
  commonMistakes: CommonMistake[]
  difficultWords: string[]
  polishCharsMissed: number
}

export interface TypingSessionRecord {
  id: string
  createdAt: string
  sourceText: string
  trainingText: string
  typedText: string
  mode: TransformMode
  typingMode: TypingMode
  stats: TypingStats
}

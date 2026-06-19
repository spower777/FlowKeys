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
  backspaceCount: number
  bestStreak: number
  calmScore: number
  errorsByFinger: Record<string, number>
}

export interface ReplayEvent {
  ts: number       // absolute ms timestamp
  char: string     // typed char or 'Backspace'
  isBackspace: boolean
}

export interface TypingSessionRecord {
  id: string
  createdAt: string
  sourceText: string
  trainingText: string
  typedText: string
  mode: TransformMode
  typingMode: TypingMode
  lessonId?: number
  libraryTextId?: string
  stats: TypingStats
  replayData?: ReplayEvent[]
}

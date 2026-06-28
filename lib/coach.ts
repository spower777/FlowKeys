import type { TypingStats, TypingSessionRecord } from './types'
import { FINGER_LABELS } from './fingerMap'

export interface DiagnosisKey {
  key: string
  params?: Record<string, string | number>
}

export function getSessionDiagnosis(stats: TypingStats): DiagnosisKey {
  const bs = stats.backspaceCount ?? 0
  const calm = stats.calmScore ?? stats.accuracy
  const errors = stats.errorsByFinger ?? {}
  const worstFinger = Object.entries(errors).sort((a, b) => b[1] - a[1])[0]
  if (calm < 50 && bs > 10) return { key: 'manyBackspace', params: { count: bs } }
  if (stats.polishCharsMissed >= 3) return { key: 'polishChars' }
  if (worstFinger && worstFinger[1] >= 3) return {
    key: 'worstFinger',
    params: { finger: FINGER_LABELS[worstFinger[0]] ?? worstFinger[0], count: worstFinger[1] },
  }
  if (stats.accuracy >= 97) return { key: 'greatAccuracy' }
  if (stats.accuracy >= 90) return { key: 'goodAccuracy' }
  if (stats.mistakesCount > 0 && stats.commonMistakes[0]?.count >= 3) {
    const m = stats.commonMistakes[0]
    return {
      key: 'repeatedMistake',
      params: {
        expected: m.expected === ' ' ? '␣' : m.expected,
        actual: m.actual === ' ' ? '␣' : m.actual,
      },
    }
  }
  if (stats.wpm < 20) return { key: 'slowPace' }
  return { key: 'default' }
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export interface CoachInsightKey {
  key: string
  params?: Record<string, string | number>
  tone: 'positive' | 'neutral' | 'constructive'
}

export function generateCoachInsight(
  current: TypingStats,
  history: TypingSessionRecord[],
): CoachInsightKey | null {
  const base = history
    .filter(s => s.stats.completionPercent >= 90)
    .slice(0, 15)

  if (base.length === 0) {
    const bs = current.backspaceCount ?? 0
    const completed = current.completionPercent >= 90
    if (!completed) return null
    if (bs <= 3) return { key: 'firstSessionClean', tone: 'positive' }
    if (current.accuracy >= 90) return {
      key: 'firstSessionAccuracy',
      params: { acc: current.accuracy },
      tone: 'positive',
    }
    return { key: 'firstSession', tone: 'neutral' }
  }

  if (base.length < 1) return null

  const currentCalm  = current.calmScore ?? current.accuracy
  const currentBs    = current.backspaceCount ?? 0
  const completed    = current.completionPercent >= 90

  const avgCalm  = avg(base.map(s => s.stats.calmScore ?? s.stats.accuracy))
  const avgBs    = avg(base.map(s => s.stats.backspaceCount ?? 0))
  const avgAcc   = avg(base.map(s => s.stats.accuracy))
  const avgWpm   = avg(base.map(s => s.stats.wpm))

  if (completed && currentCalm >= avgCalm + 7)
    return { key: 'calmImproved', params: { current: Math.round(currentCalm), avg: Math.round(avgCalm) }, tone: 'positive' }
  if (completed && currentCalm <= avgCalm - 9)
    return { key: 'calmWorse', tone: 'constructive' }

  if (avgBs >= 8 && currentBs <= avgBs * 0.55 && completed)
    return { key: 'backspaceLess', params: { count: currentBs }, tone: 'positive' }
  if (avgBs >= 5 && currentBs >= avgBs * 1.7)
    return { key: 'backspaceMore', params: { count: currentBs, avg: Math.round(avgBs) }, tone: 'constructive' }

  if (current.accuracy >= avgAcc + 4 && current.accuracy >= 90 && completed)
    return { key: 'accuracyBetter', params: { acc: current.accuracy, avg: Math.round(avgAcc) }, tone: 'positive' }
  if (current.accuracy <= avgAcc - 6 && completed)
    return { key: 'accuracyWorse', params: { acc: current.accuracy, avg: Math.round(avgAcc) }, tone: 'constructive' }

  if (current.wpm >= avgWpm + 9 && current.accuracy >= 85 && completed)
    return { key: 'wpmFaster', params: { wpm: current.wpm }, tone: 'positive' }
  if (current.wpm <= avgWpm * 0.72 && completed)
    return { key: 'wpmSlower', tone: 'neutral' }

  if (current.errorsByFinger) {
    const fingers = Object.entries(current.errorsByFinger).sort((a, b) => b[1] - a[1])
    if (fingers.length > 0 && fingers[0][1] >= 4) {
      const [key, count] = fingers[0]
      const label = FINGER_LABELS[key] ?? key
      return { key: 'worstFinger', params: { finger: label, count }, tone: 'constructive' }
    }
  }

  if (current.commonMistakes?.length > 0) {
    const top = [...current.commonMistakes].sort((a, b) => b.count - a.count)[0]
    if (top.count >= 3)
      return { key: 'worstLetter', params: { letter: top.expected, count: top.count }, tone: 'constructive' }
  }

  return null
}

export interface WeeklyTrend {
  wpmThisWeek: number
  wpmLastWeek: number
  calmThisWeek: number
  calmLastWeek: number
  sessionsThisWeek: number
}

export function getWeeklyTrend(sessions: TypingSessionRecord[]): WeeklyTrend | null {
  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000

  const thisWeek = sessions.filter(s => {
    const age = now - new Date(s.createdAt).getTime()
    return age < week && s.stats.completionPercent >= 90
  })
  const lastWeek = sessions.filter(s => {
    const age = now - new Date(s.createdAt).getTime()
    return age >= week && age < 2 * week && s.stats.completionPercent >= 90
  })

  if (thisWeek.length === 0 && lastWeek.length === 0) return null

  return {
    wpmThisWeek:      Math.round(avg(thisWeek.map(s => s.stats.wpm))),
    wpmLastWeek:      Math.round(avg(lastWeek.map(s => s.stats.wpm))),
    calmThisWeek:     Math.round(avg(thisWeek.map(s => s.stats.calmScore ?? s.stats.accuracy))),
    calmLastWeek:     Math.round(avg(lastWeek.map(s => s.stats.calmScore ?? s.stats.accuracy))),
    sessionsThisWeek: thisWeek.length,
  }
}

export function aggregateFingerErrors(sessions: TypingSessionRecord[]): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const s of sessions) {
    for (const [finger, count] of Object.entries(s.stats.errorsByFinger ?? {})) {
      totals[finger] = (totals[finger] ?? 0) + count
    }
  }
  return totals
}

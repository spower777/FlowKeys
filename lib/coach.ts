import type { TypingStats, TypingSessionRecord } from './types'
import { FINGER_LABELS } from './fingerMap'

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export interface CoachInsight {
  text: string
  tone: 'positive' | 'neutral' | 'constructive'
}

export function generateCoachInsight(
  current: TypingStats,
  history: TypingSessionRecord[],   // sessions BEFORE this one, newest first
): CoachInsight | null {
  // Need at least 3 completed sessions to have a baseline
  const base = history
    .filter(s => s.stats.completionPercent >= 90)
    .slice(0, 15)
  if (base.length < 3) return null

  const currentCalm  = current.calmScore ?? current.accuracy
  const currentBs    = current.backspaceCount ?? 0
  const completed    = current.completionPercent >= 90

  const avgCalm  = avg(base.map(s => s.stats.calmScore ?? s.stats.accuracy))
  const avgBs    = avg(base.map(s => s.stats.backspaceCount ?? 0))
  const avgAcc   = avg(base.map(s => s.stats.accuracy))
  const avgWpm   = avg(base.map(s => s.stats.wpm))

  // ── 1. Rytm (najbardziej FlowKeys-specific) ───────────────────────────────
  if (completed && currentCalm >= avgCalm + 7)
    return { text: `Spokojniejszy rytm niż zwykle — Calm ${Math.round(currentCalm)} vs Twoja średnia ${Math.round(avgCalm)}.`, tone: 'positive' }
  if (completed && currentCalm <= avgCalm - 9)
    return { text: `Więcej napięcia niż zwykle. Zwolnij — rytm ważniejszy niż tempo.`, tone: 'constructive' }

  // ── 2. Cofnięcia ─────────────────────────────────────────────────────────
  if (avgBs >= 8 && currentBs <= avgBs * 0.55 && completed)
    return { text: `Tylko ${currentBs} cofnięć — o połowę mniej niż zwykle. Dobre pisanie.`, tone: 'positive' }
  if (avgBs >= 5 && currentBs >= avgBs * 1.7)
    return { text: `${currentBs} cofnięć — więcej niż zwykle (${Math.round(avgBs)} średnio). Pisz pewniej, nie szybciej.`, tone: 'constructive' }

  // ── 3. Dokładność ────────────────────────────────────────────────────────
  if (current.accuracy >= avgAcc + 4 && current.accuracy >= 90 && completed)
    return { text: `Dokładność ${current.accuracy}% — lepsza niż Twoja średnia (${Math.round(avgAcc)}%).`, tone: 'positive' }
  if (current.accuracy <= avgAcc - 6 && completed)
    return { text: `Dokładność poniżej Twojej normy (${current.accuracy}% vs ${Math.round(avgAcc)}% śr.). Wróć do wolniejszego tempa.`, tone: 'constructive' }

  // ── 4. WPM ────────────────────────────────────────────────────────────────
  if (current.wpm >= avgWpm + 9 && current.accuracy >= 85 && completed)
    return { text: `${current.wpm} WPM — szybciej niż zwykle. Utrzymaj spokój przy tym tempie.`, tone: 'positive' }
  if (current.wpm <= avgWpm * 0.72 && completed)
    return { text: `Wolniejsze tempo niż zwykle. Jeśli pisałeś świadomie — to był dobry trening.`, tone: 'neutral' }

  // ── 5. Palec z największą liczbą błędów ───────────────────────────────────
  if (current.errorsByFinger) {
    const fingers = Object.entries(current.errorsByFinger).sort((a, b) => b[1] - a[1])
    if (fingers.length > 0 && fingers[0][1] >= 4) {
      const [key, count] = fingers[0]
      const label = FINGER_LABELS[key] ?? key
      return { text: `${label} — ${count} błędów w tej sesji. Wróć do lekcji tego palca.`, tone: 'constructive' }
    }
  }

  // ── 6. Najgorsza litera ───────────────────────────────────────────────────
  if (current.commonMistakes?.length > 0) {
    const top = [...current.commonMistakes].sort((a, b) => b.count - a.count)[0]
    if (top.count >= 3)
      return { text: `Literka „${top.expected}" — ${top.count} błędów. Ćwicz ją w izolacji.`, tone: 'constructive' }
  }

  return null
}

// ── Tygodniowe porównanie WPM / Calm ─────────────────────────────────────────

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

// ── Agregat błędów palców (historia) ─────────────────────────────────────────

export function aggregateFingerErrors(sessions: TypingSessionRecord[]): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const s of sessions) {
    for (const [finger, count] of Object.entries(s.stats.errorsByFinger ?? {})) {
      totals[finger] = (totals[finger] ?? 0) + count
    }
  }
  return totals
}

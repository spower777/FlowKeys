import type { TypingStats, TypingMode } from './types'
import type { FlowBadge } from '@/data/badges'
import type { LessonMode } from '@/data/lessons'
import { lessons } from '@/data/lessons'
import { getSessions } from './storage'
import { loadSettings } from './settings'

const LP_KEY = 'flowkeys_lesson_progress'
const BADGES_KEY = 'flowkeys_badges'

// ── Lesson Progress ───────────────────────────────────────────────────────────

export interface LessonProgress {
  lessonId: number
  attempts: number
  bestWpm: number
  bestAccuracy: number
  bestCalmIndex: number
  bestStreak: number
  completed: boolean
  mastered: boolean
  stars: 0 | 1 | 2 | 3
  lastAttemptAt?: string
}

export type LessonStatus = 'locked' | 'available' | 'completed' | 'mastered'

export function getAllLessonProgress(): Record<number, LessonProgress> {
  try {
    const raw = localStorage.getItem(LP_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// Packs that run as independent tracks — not part of the main 1–210 ID chain.
// The first lesson in each of these packs is always unlocked without prerequisites.
export const INDEPENDENT_TRACK_PACKS = new Set<string>([
  'homerow', 'numbers', 'symbols',
  'emeraldTablets', 'bhagavadGita', 'taoTeching',
])

export function getLessonStatus(lessonId: number, allProgress?: Record<number, LessonProgress>): LessonStatus {
  if (loadSettings().devUnlockAll) {
    const p = (allProgress ?? getAllLessonProgress())[lessonId]
    if (p?.mastered) return 'mastered'
    if (p?.completed) return 'completed'
    return 'available'
  }

  const progress = allProgress ?? getAllLessonProgress()
  const p = progress[lessonId]

  const lesson = lessons.find(l => l.id === lessonId)

  if (lesson && INDEPENDENT_TRACK_PACKS.has(lesson.pack)) {
    const packLessons = lessons.filter(l => l.pack === lesson.pack)
    const indexInPack = packLessons.findIndex(l => l.id === lessonId)
    if (indexInPack <= 0) {
      if (p?.mastered) return 'mastered'
      if (p?.completed) return 'completed'
      return 'available'
    }
    const prevInPack = packLessons[indexInPack - 1]
    if (!progress[prevInPack.id]?.completed) return 'locked'
    if (p?.mastered) return 'mastered'
    if (p?.completed) return 'completed'
    return 'available'
  }

  if (lessonId === 1) {
    if (p?.mastered) return 'mastered'
    if (p?.completed) return 'completed'
    return 'available'
  }

  const prev = progress[lessonId - 1]
  if (!prev?.completed) return 'locked'
  if (p?.mastered) return 'mastered'
  if (p?.completed) return 'completed'
  return 'available'
}

export function getNextLesson(lessonId: number): import('@/data/lessons').FlowLesson | null {
  const lesson = lessons.find(l => l.id === lessonId)
  if (!lesson) return null
  if (INDEPENDENT_TRACK_PACKS.has(lesson.pack)) {
    const packLessons = lessons.filter(l => l.pack === lesson.pack)
    const idx = packLessons.findIndex(l => l.id === lessonId)
    return idx >= 0 && idx + 1 < packLessons.length ? packLessons[idx + 1] : null
  }
  const next = lessons.find(l => l.id === lessonId + 1) ?? null
  if (next && INDEPENDENT_TRACK_PACKS.has(next.pack)) return null
  return next
}

export function calculateStars(stats: TypingStats): 0 | 1 | 2 | 3 {
  const calm = stats.calmScore ?? stats.accuracy
  const completed = stats.completionPercent >= 90
  if (!completed) return 0
  if (stats.accuracy >= 98 && calm >= 90) return 3
  if (stats.accuracy >= 94 && calm >= 80) return 2
  if (stats.accuracy >= 85) return 1
  return 0
}

export function updateLessonProgress(lessonId: number, stats: TypingStats): LessonProgress {
  const all = getAllLessonProgress()
  const prev = all[lessonId]
  const calm = stats.calmScore ?? stats.accuracy

  const completed = stats.completionPercent >= 90 && stats.accuracy >= 80
  const mastered = stats.completionPercent >= 95 && stats.accuracy >= 98 && calm >= 90
  const stars = calculateStars(stats)

  const updated: LessonProgress = {
    lessonId,
    attempts: (prev?.attempts ?? 0) + 1,
    bestWpm: Math.max(prev?.bestWpm ?? 0, stats.wpm),
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, stats.accuracy),
    bestCalmIndex: Math.max(prev?.bestCalmIndex ?? 0, calm),
    bestStreak: Math.max(prev?.bestStreak ?? 0, stats.bestStreak ?? 0),
    completed: prev?.completed || completed,
    mastered: prev?.mastered || mastered,
    stars: Math.max(prev?.stars ?? 0, stars) as 0 | 1 | 2 | 3,
    lastAttemptAt: new Date().toISOString(),
  }

  all[lessonId] = updated
  try { localStorage.setItem(LP_KEY, JSON.stringify(all)) } catch {}
  return updated
}

export function markLessonSkipped(lessonId: number): void {
  const all = getAllLessonProgress()
  const prev = all[lessonId]
  if (prev?.completed) return
  all[lessonId] = {
    lessonId,
    attempts: prev?.attempts ?? 0,
    bestWpm: prev?.bestWpm ?? 0,
    bestAccuracy: prev?.bestAccuracy ?? 0,
    bestCalmIndex: prev?.bestCalmIndex ?? 0,
    bestStreak: prev?.bestStreak ?? 0,
    completed: true,
    mastered: false,
    stars: prev?.stars ?? 0,
    lastAttemptAt: prev?.lastAttemptAt,
  }
  try { localStorage.setItem(LP_KEY, JSON.stringify(all)) } catch {}
}

// ── Lesson mode → TypingMode ──────────────────────────────────────────────────

export function lessonModeToTypingMode(mode: LessonMode): TypingMode {
  if (mode === 'blindFlow') return 'blind'
  if (mode === 'noBackspace') return 'no_backspace'
  return 'normal'
}

// ── Badges ────────────────────────────────────────────────────────────────────

export type BadgeRecord = Record<string, { unlockedAt: string }>

export function getUnlockedBadges(): BadgeRecord {
  try {
    const raw = localStorage.getItem(BADGES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function checkAndUnlockBadges(badgeList: FlowBadge[]): string[] {
  const unlocked = getUnlockedBadges()
  const progress = getAllLessonProgress()
  const sessions = getSessions()
  const newlyUnlocked: string[] = []

  const completedLessons = Object.values(progress).filter(p => p.completed).length
  const masteredLessons = Object.values(progress).filter(p => p.mastered).length
  const blindSessions = sessions.filter(s => s.typingMode === 'blind' && s.stats.completionPercent >= 90).length
  const noBackspaceSessions = sessions.filter(s => s.typingMode === 'no_backspace' && s.stats.completionPercent >= 90).length

  // Polish signs: completed lessons with polishSigns pack and 0 missed polish chars
  const polishPerfect = Object.entries(progress).filter(([id, p]) => {
    if (!p.completed) return false
    const lesson = lessons.find(l => l.id === Number(id))
    return lesson?.pack === 'polishSigns' && p.bestAccuracy >= 90
  }).length

  const quietRounds = sessions.filter(s =>
    (s.stats.calmScore ?? s.stats.accuracy) >= 90 &&
    (s.stats.backspaceCount ?? 0) <= 10 &&
    s.stats.completionPercent >= 90
  ).length
  const cleanRounds = sessions.filter(s =>
    (s.stats.backspaceCount ?? 0) <= 5 &&
    s.stats.completionPercent >= 90
  ).length
  const customTextSessions = sessions.filter(s =>
    !s.lessonId && s.stats.completionPercent >= 90
  ).length

  const bestAccuracy = sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.accuracy)) : 0
  const bestWpm = sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.wpm)) : 0
  const bestCalm = sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.calmScore ?? s.stats.accuracy)) : 0
  const streak = calculateStreak(sessions)

  for (const badge of badgeList) {
    if (unlocked[badge.id]) continue
    const { type, value } = badge.requirement
    let achieved = false

    switch (type) {
      case 'lessonsCompleted':   achieved = completedLessons >= value; break
      case 'lessonsMastered':    achieved = masteredLessons >= value; break
      case 'blindFlowCount':     achieved = blindSessions >= value; break
      case 'noBackspaceCount':   achieved = noBackspaceSessions >= value; break
      case 'polishSignsPerfect': achieved = polishPerfect >= value; break
      case 'accuracy':           achieved = bestAccuracy >= value; break
      case 'wpm':                achieved = bestWpm >= value; break
      case 'calmIndex':          achieved = bestCalm >= value; break
      case 'daysStreak':         achieved = streak >= value; break
      case 'quietRound':         achieved = quietRounds >= value; break
      case 'cleanRound':         achieved = cleanRounds >= value; break
      case 'customTextSession':  achieved = customTextSessions >= value; break
    }

    if (achieved) {
      unlocked[badge.id] = { unlockedAt: new Date().toISOString() }
      newlyUnlocked.push(badge.id)
    }
  }

  if (newlyUnlocked.length > 0) {
    try { localStorage.setItem(BADGES_KEY, JSON.stringify(unlocked)) } catch {}
  }

  return newlyUnlocked
}

// ── Streak ────────────────────────────────────────────────────────────────────

export function calculateStreak(sessions: Array<{ createdAt: string }>): number {
  if (sessions.length === 0) return 0
  const days = new Set(sessions.map(s => s.createdAt.slice(0, 10)))
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayStr = today.toISOString().slice(0, 10)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  let startStr: string
  if (days.has(todayStr)) startStr = todayStr
  else if (days.has(yesterdayStr)) startStr = yesterdayStr
  else return 0

  let streak = 0
  const cursor = new Date(startStr)
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

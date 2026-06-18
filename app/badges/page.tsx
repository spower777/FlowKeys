'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { badges, type BadgeCategory } from '@/data/badges'
import { getAllLessonProgress, getUnlockedBadges, calculateStreak } from '@/lib/lessonProgress'
import { getSessions } from '@/lib/storage'
import type { LessonProgress } from '@/lib/lessonProgress'
import { lessons } from '@/data/lessons'

const CATEGORY_LABELS: Record<BadgeCategory | 'all', string> = {
  all: 'Wszystkie', streak: 'Seria', accuracy: 'Dokładność', speed: 'Prędkość',
  calm: 'Spokój', blindFlow: 'Blind Flow', noBackspace: 'No Backspace',
  polishSigns: 'Polskie znaki', lessons: 'Lekcje', mastery: 'Mistrzostwo',
}

const CATEGORY_COLOR: Record<BadgeCategory, string> = {
  streak:      'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
  accuracy:    'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400',
  speed:       'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  calm:        'bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400',
  blindFlow:   'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  noBackspace: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400',
  polishSigns: 'bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400',
  lessons:     'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
  mastery:     'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

const CATEGORIES: Array<BadgeCategory | 'all'> = [
  'all', 'streak', 'accuracy', 'speed', 'calm',
  'blindFlow', 'noBackspace', 'polishSigns', 'lessons', 'mastery',
]

interface BadgeState {
  unlocked: Record<string, { unlockedAt: string }>
  progress: Record<number, LessonProgress>
  currentValues: Record<string, number>
  streak: number
}

function computeCurrentValues(progress: Record<number, LessonProgress>): Record<string, number> {
  const sessions = getSessions()
  const completedLessons = Object.values(progress).filter(p => p.completed).length
  const masteredLessons = Object.values(progress).filter(p => p.mastered).length
  const blindSessions = sessions.filter(s => s.typingMode === 'blind' && s.stats.completionPercent >= 90).length
  const noBackspaceSessions = sessions.filter(s => s.typingMode === 'no_backspace' && s.stats.completionPercent >= 90).length
  const polishPerfect = Object.entries(progress).filter(([id, p]) => {
    if (!p.completed) return false
    const lesson = lessons.find(l => l.id === Number(id))
    return lesson?.pack === 'polishSigns' && p.bestAccuracy >= 90
  }).length

  return {
    lessonsCompleted: completedLessons,
    lessonsMastered: masteredLessons,
    blindFlowCount: blindSessions,
    noBackspaceCount: noBackspaceSessions,
    polishSignsPerfect: polishPerfect,
    accuracy: sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.accuracy)) : 0,
    wpm: sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.wpm)) : 0,
    calmIndex: sessions.length > 0 ? Math.max(...sessions.map(s => s.stats.calmScore ?? s.stats.accuracy)) : 0,
    daysStreak: calculateStreak(sessions),
  }
}

export default function BadgesPage() {
  const [state, setState] = useState<BadgeState | null>(null)
  const [filter, setFilter] = useState<BadgeCategory | 'all'>('all')

  useEffect(() => {
    const progress = getAllLessonProgress()
    const sessions = getSessions()
    setState({
      unlocked: getUnlockedBadges(),
      progress,
      currentValues: computeCurrentValues(progress),
      streak: calculateStreak(sessions),
    })
  }, [])

  const filtered = filter === 'all' ? badges : badges.filter(b => b.category === filter)
  const unlockedCount = state ? Object.keys(state.unlocked).length : 0

  const closest = state ? badges
    .filter(b => !state.unlocked[b.id])
    .map(b => {
      const current = state.currentValues[b.requirement.type] ?? 0
      return { badge: b, pct: current / b.requirement.value, current }
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3) : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <Header />

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Nagrody FlowKeys</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Każda odznaka to ślad czegoś realnego.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
              <p className="text-3xl font-black text-amber-500 dark:text-amber-400">{unlockedCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">z {badges.length} odznak</p>
            </div>
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
              <p className="text-3xl font-black text-[var(--accent-600)] dark:text-[var(--accent-400)]">
                {state?.streak ?? '—'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{state?.streak === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</p>
            </div>
          </div>

          {/* Closest to unlock */}
          {closest.length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">
                Najbliżej zdobycia
              </p>
              <div className="space-y-3">
                {closest.map(({ badge, pct, current }) => (
                  <div key={badge.id} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center shrink-0">{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{badge.title}</p>
                        <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0 ml-2 tabular-nums">
                          {current} / {badge.requirement.value}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-amber-400 dark:bg-amber-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, pct * 100).toFixed(0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === cat
                  ? 'bg-[var(--accent-500)] text-white'
                  : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-[#2a2a2a]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(badge => {
            const isUnlocked = !!state?.unlocked[badge.id]
            const current = state?.currentValues[badge.requirement.type] ?? 0
            const pct = Math.min(100, Math.round((current / badge.requirement.value) * 100))
            const unlockedAt = state?.unlocked[badge.id]?.unlockedAt
            const catColor = CATEGORY_COLOR[badge.category]

            return (
              <div
                key={badge.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#161616] border-amber-200 dark:border-amber-500/20'
                    : 'bg-gray-50 dark:bg-[#111] border-gray-200 dark:border-[#1e1e1e] opacity-55'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl shrink-0 ${
                  isUnlocked ? catColor : 'bg-gray-100 dark:bg-[#1e1e1e]'
                }`}>
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${isUnlocked ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-600'}`}>
                      {badge.title}
                    </p>
                    {isUnlocked && (
                      <span className="text-amber-400 shrink-0">★</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-600 mt-0.5 leading-snug">{badge.description}</p>

                  {/* Progress */}
                  {!isUnlocked && state && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-600">
                        <span>{current} / {badge.requirement.value}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-[var(--accent-400)] dark:bg-[var(--accent-500)] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isUnlocked && unlockedAt && (
                    <p className="text-[9px] text-amber-600/70 dark:text-amber-400/60 mt-1">
                      Zdobyta {new Date(unlockedAt).toLocaleDateString('pl', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

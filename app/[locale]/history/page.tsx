'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SessionHistory from '@/components/SessionHistory'
import { getSessions } from '@/lib/storage'
import { calculateStreak } from '@/lib/lessonProgress'
import type { TypingSessionRecord } from '@/lib/types'

function fmtMinutes(min: number) {
  if (min < 60) return `${Math.round(min)} min`
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

interface HistoryStats {
  total: number
  bestWpm: number
  avgWpm: number
  avgAccuracy: number
  streak: number
  totalMinutes: number
}

function computeStats(sessions: TypingSessionRecord[]): HistoryStats {
  if (sessions.length === 0) {
    return { total: 0, bestWpm: 0, avgWpm: 0, avgAccuracy: 0, streak: 0, totalMinutes: 0 }
  }
  const done = sessions.filter(s => s.stats.wpm > 0)
  const bestWpm = Math.max(...done.map(s => s.stats.wpm))
  const avgWpm = done.length > 0 ? Math.round(done.reduce((acc, s) => acc + s.stats.wpm, 0) / done.length) : 0
  const avgAccuracy = Math.round(sessions.reduce((acc, s) => acc + s.stats.accuracy, 0) / sessions.length)
  const totalMinutes = done.reduce((acc, s) => {
    // wpm = chars/5/time_min → time_min = chars / (5 * wpm)
    return acc + (s.stats.charsTyped > 0 && s.stats.wpm > 0 ? s.stats.charsTyped / (5 * s.stats.wpm) : 0)
  }, 0)
  return { total: sessions.length, bestWpm, avgWpm, avgAccuracy, streak: calculateStreak(sessions), totalMinutes }
}

export default function HistoryPage() {
  const [stats, setStats] = useState<HistoryStats | null>(null)

  useEffect(() => {
    setStats(computeStats(getSessions()))
  }, [])

  const cards = stats ? [
    { value: stats.total, label: 'Sesji łącznie', color: 'text-[var(--accent-600)] dark:text-[var(--accent-400)]' },
    { value: stats.bestWpm, label: 'Najlepsze WPM', color: 'text-blue-600 dark:text-blue-400' },
    { value: stats.avgWpm, label: 'Średnie WPM', color: 'text-indigo-600 dark:text-indigo-400' },
    { value: `${stats.avgAccuracy}%`, label: 'Śr. dokładność', color: stats.avgAccuracy >= 95 ? 'text-green-600 dark:text-green-400' : stats.avgAccuracy >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400' },
    { value: stats.streak, label: stats.streak === 1 ? 'Dzień z rzędu' : 'Dni z rzędu', color: 'text-orange-500 dark:text-orange-400' },
    { value: fmtMinutes(stats.totalMinutes), label: 'Czas ćwiczeń', color: 'text-teal-600 dark:text-teal-400' },
  ] : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <Header />

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Historia sesji</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Każda runda zostawia ślad.
          </p>

          {stats && stats.total > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-2">
              {cards.map(c => (
                <div
                  key={c.label}
                  className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center"
                >
                  <p className={`text-xl font-black tabular-nums ${c.color}`}>{c.value}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1 leading-tight">{c.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <SessionHistory />
      </div>
    </main>
  )
}

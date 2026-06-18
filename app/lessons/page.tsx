'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LessonTile from '@/components/LessonTile'
import { lessons } from '@/data/lessons'
import { chapters } from '@/data/chapters'
import { PACK_GROUPS, DEFAULT_PACK_GROUPS, getPacksForGroups, type PackGroupId } from '@/data/packGroups'
import { getAllLessonProgress, getLessonStatus, calculateStreak } from '@/lib/lessonProgress'
import { loadSettings } from '@/lib/settings'
import type { LessonProgress, LessonStatus } from '@/lib/lessonProgress'
import { getSessions } from '@/lib/storage'

export default function LessonsPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<number, LessonProgress>>({})
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeGroups, setActiveGroups] = useState<PackGroupId[]>(DEFAULT_PACK_GROUPS)

  useEffect(() => {
    const s = loadSettings()
    setActiveGroups(s.preferredPackGroups?.length ? s.preferredPackGroups : DEFAULT_PACK_GROUPS)
    setProgress(getAllLessonProgress())
    setStreak(calculateStreak(getSessions()))
    setMounted(true)
  }, [])

  function toggleGroup(id: PackGroupId) {
    setActiveGroups(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(g => g !== id) : prev  // keep at least one
        : [...prev, id]
    )
  }

  const activePacks = getPacksForGroups(activeGroups)
  const visibleLessons = lessons.filter(l => activePacks.has(l.pack))
  const activeChapterIds = [...new Set(visibleLessons.map(l => l.chapterId))]

  function startLesson(id: number) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    try {
      localStorage.setItem('flowkeys_pending_lesson', JSON.stringify({
        id: lesson.id, text: lesson.text, mode: lesson.mode, title: lesson.title,
      }))
    } catch {}
    router.push('/')
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const masteredCount = Object.values(progress).filter(p => p.mastered).length
  const visibleTotal = visibleLessons.length

  const nextLesson = mounted
    ? (visibleLessons.find(l => getLessonStatus(l.id, progress) === 'available') ?? null)
    : null

  const lastPracticedEntry = Object.values(progress)
    .filter(p => p.lastAttemptAt)
    .sort((a, b) => (b.lastAttemptAt ?? '').localeCompare(a.lastAttemptAt ?? ''))[0] ?? null
  const lastLesson = lastPracticedEntry
    ? lessons.find(l => l.id === lastPracticedEntry.lessonId && activePacks.has(l.pack))
    : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <Header />

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Ścieżka FlowKeys</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Każda lekcja to jeden krok. Nie ścig — rytm.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { value: `${completedCount} / ${visibleTotal}`, label: 'Ukończone', color: 'text-teal-600 dark:text-teal-400' },
              { value: masteredCount, label: 'Opanowane', color: 'text-amber-600 dark:text-amber-400' },
              { value: streak, label: streak === 1 ? 'Dzień z rzędu' : 'Dni z rzędu', color: 'text-[var(--accent-600)] dark:text-[var(--accent-400)]' },
              { value: visibleTotal, label: 'Dostępnych', color: 'text-gray-500 dark:text-gray-500' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-4 text-center">
                <p className={`text-2xl font-black ${color}`}>{mounted ? value : '—'}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Next lesson CTA */}
          {mounted && nextLesson && (
            <div className="bg-white dark:bg-[#161616] border border-[var(--accent-200)] dark:border-[var(--accent-500)]/25 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[var(--accent-600)] dark:text-[var(--accent-400)] font-semibold uppercase tracking-widest mb-0.5">
                  {lastLesson ? 'Kontynuuj' : 'Zacznij tutaj'}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <span className="font-mono text-gray-400 dark:text-gray-600 mr-2">{String(nextLesson.id).padStart(3, '0')}</span>
                  {nextLesson.title}
                </p>
                {nextLesson.subtitle && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">{nextLesson.subtitle}</p>
                )}
              </div>
              <button
                onClick={() => startLesson(nextLesson.id)}
                className="shrink-0 px-5 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white text-sm font-semibold rounded-xl transition"
              >
                Start →
              </button>
            </div>
          )}

          {/* Last practiced */}
          {mounted && lastLesson && lastLesson.id !== nextLesson?.id && (
            <div className="mt-3 flex items-center gap-3 px-5 py-3 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">Ostatnio ćwiczyłeś</span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-600">{String(lastLesson.id).padStart(3, '0')}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{lastLesson.title}</span>
              <button
                onClick={() => startLesson(lastLesson.id)}
                className="ml-auto text-xs text-[var(--accent-600)] dark:text-[var(--accent-400)] hover:underline"
              >
                Powtórz
              </button>
            </div>
          )}
        </div>

        {/* Pack group filter chips */}
        <div className="mb-8">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">Klimat tekstów</p>
          <div className="flex flex-wrap gap-2">
            {PACK_GROUPS.map(group => {
              const isActive = activeGroups.includes(group.id)
              return (
                <button
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-[var(--accent-500)] border-[var(--accent-500)] text-white shadow-sm'
                      : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-500 hover:border-gray-300 dark:hover:border-[#3a3a3a]'
                  }`}
                >
                  <span>{group.icon}</span>
                  <span>{group.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Chapters with lessons */}
        <div className="space-y-10">
          {activeChapterIds.map(chapterId => {
            const chapter = chapters.find(c => c.id === chapterId)
            if (!chapter) return null
            const chapterLessons = visibleLessons.filter(l => l.chapterId === chapterId)
            const completedInChapter = chapterLessons.filter(l => progress[l.id]?.completed).length
            const pct = chapterLessons.length > 0 ? Math.round((completedInChapter / chapterLessons.length) * 100) : 0

            return (
              <section key={chapterId}>
                <div className="mb-3">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Rozdział {chapterId} — {chapter.title}
                    </h2>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600">{chapter.description}</span>
                    {mounted && (
                      <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-600 tabular-nums shrink-0">
                        {completedInChapter}/{chapterLessons.length}
                      </span>
                    )}
                  </div>
                  {mounted && (
                    <div className="h-1.5 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-teal-400 dark:bg-teal-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {chapterLessons.map(lesson => {
                    const status: LessonStatus = mounted ? getLessonStatus(lesson.id, progress) : 'locked'
                    const p = progress[lesson.id]
                    return (
                      <LessonTile
                        key={lesson.id}
                        lesson={lesson}
                        status={status}
                        stars={p?.stars ?? 0}
                        isNext={mounted && lesson.id === nextLesson?.id}
                        onClick={() => startLesson(lesson.id)}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })}

          {activeChapterIds.length === 0 && mounted && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <p className="text-sm">Brak lekcji dla wybranych filtrów.</p>
              <p className="text-xs mt-1">Wybierz przynajmniej jeden klimat tekstów powyżej.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

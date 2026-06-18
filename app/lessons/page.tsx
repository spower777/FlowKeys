'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LessonTile from '@/components/LessonTile'
import { lessons } from '@/data/lessons'
import { chapters } from '@/data/chapters'
import { getAllLessonProgress, getLessonStatus, calculateStreak } from '@/lib/lessonProgress'
import type { LessonProgress, LessonStatus } from '@/lib/lessonProgress'
import { getSessions } from '@/lib/storage'

const FIRST_BATCH = 50

const ACTIVE_CHAPTER_IDS = [...new Set(lessons.slice(0, FIRST_BATCH).map(l => l.chapterId))]

export default function LessonsPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<number, LessonProgress>>({})
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setProgress(getAllLessonProgress())
    setStreak(calculateStreak(getSessions()))
    setMounted(true)
  }, [])

  function startLesson(id: number) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    try {
      localStorage.setItem('flowkeys_pending_lesson', JSON.stringify({ id: lesson.id, text: lesson.text, mode: lesson.mode, title: lesson.title }))
    } catch {}
    router.push('/')
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const masteredCount = Object.values(progress).filter(p => p.mastered).length

  const nextLesson = mounted
    ? (lessons.find(l => getLessonStatus(l.id, progress) === 'available') ?? null)
    : null

  const lastPracticedEntry = Object.values(progress)
    .filter(p => p.lastAttemptAt)
    .sort((a, b) => (b.lastAttemptAt ?? '').localeCompare(a.lastAttemptAt ?? ''))[0] ?? null
  const lastLesson = lastPracticedEntry ? lessons.find(l => l.id === lastPracticedEntry.lessonId) : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <Header />

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1">Ścieżka FlowKeys</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Każda lekcja to jeden krok. Nie ścig — rytm.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { value: `${completedCount} / ${FIRST_BATCH}`, label: 'Ukończone', color: 'text-teal-600 dark:text-teal-400' },
              { value: masteredCount, label: 'Opanowane', color: 'text-amber-600 dark:text-amber-400' },
              { value: streak, label: streak === 1 ? 'Dzień z rzędu' : 'Dni z rzędu', color: 'text-[var(--accent-600)] dark:text-[var(--accent-400)]' },
              { value: `${FIRST_BATCH}`, label: 'Dostępnych', color: 'text-gray-500 dark:text-gray-500' },
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

        {/* Chapters with lessons */}
        <div className="space-y-10">
          {ACTIVE_CHAPTER_IDS.map(chapterId => {
            const chapter = chapters.find(c => c.id === chapterId)
            if (!chapter) return null
            const chapterLessons = lessons.filter(l => l.chapterId === chapterId)
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

          {/* Locked chapters placeholder */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-400 dark:text-gray-600">Rozdziały 4–10</h2>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">Odblokują się w kolejnych aktualizacjach.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {chapters.filter(c => c.id > Math.max(...ACTIVE_CHAPTER_IDS)).slice(0, 6).map(chapter => (
                <div key={chapter.id} className="border border-dashed border-gray-200 dark:border-[#222] rounded-2xl px-4 py-4 opacity-40">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-600">{chapter.title}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{chapter.range} lekcji</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

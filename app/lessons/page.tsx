'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import LessonTile from '@/components/LessonTile'
import { lessons } from '@/data/lessons'
import { chapters } from '@/data/chapters'
import { PACK_GROUPS, DEFAULT_PACK_GROUPS, getPacksForGroups, type PackGroupId } from '@/data/packGroups'
import type { FlowLesson } from '@/data/lessons'
import { getAllLessonProgress, getLessonStatus, calculateStreak, markLessonSkipped } from '@/lib/lessonProgress'
import { loadSettings, saveSettings } from '@/lib/settings'
import type { LessonProgress, LessonStatus } from '@/lib/lessonProgress'
import { getSessions } from '@/lib/storage'
import type { TypingMode } from '@/lib/types'
import type { LessonPack } from '@/data/lessons'

export default function LessonsPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<number, LessonProgress>>({})
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeGroups, setActiveGroups] = useState<PackGroupId[]>(DEFAULT_PACK_GROUPS)
  const [sessionCounts, setSessionCounts] = useState({ blind: 0, noBackspace: 0 })
  const [recommendation, setRecommendation] = useState<{
    lesson: FlowLesson; mode?: TypingMode; label: string; desc: string
  } | null>(null)

  useEffect(() => {
    const s = loadSettings()
    setActiveGroups(s.preferredPackGroups?.length ? s.preferredPackGroups : DEFAULT_PACK_GROUPS)
    const prog = getAllLessonProgress()
    setProgress(prog)
    const sessions = getSessions()
    setStreak(calculateStreak(sessions))
    setSessionCounts({
      blind: sessions.filter(s => s.typingMode === 'blind' && s.stats.completionPercent >= 90).length,
      noBackspace: sessions.filter(s => s.typingMode === 'no_backspace' && s.stats.completionPercent >= 90).length,
    })
    // Polecane dziś — na podstawie ostatniej sesji
    const last = sessions[0]
    if (last?.lessonId) {
      const lastLsn = lessons.find(l => l.id === last.lessonId) ?? null
      const acc = last.stats.accuracy
      const bs = last.stats.backspaceCount ?? 0
      const mode = last.typingMode
      if (mode === 'normal' && acc >= 88 && lastLsn) {
        setRecommendation({ lesson: lastLsn, mode: 'blind', label: 'Spróbuj Blind Flow', desc: `„${lastLsn.title}" — pisz z pamięci` })
      } else if (mode === 'normal' && bs > 12 && lastLsn) {
        setRecommendation({ lesson: lastLsn, mode: 'no_backspace', label: 'No Backspace', desc: `„${lastLsn.title}" — bez cofania` })
      }
    }
    setMounted(true)
  }, [])

  function toggleGroup(id: PackGroupId) {
    setActiveGroups(prev => {
      if (prev.includes(id) && prev.length === 1) return prev
      const newGroups = prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
      saveSettings({ ...loadSettings(), preferredPackGroups: newGroups })
      return newGroups
    })
  }

  function skipLesson(id: number) {
    markLessonSkipped(id)
    setProgress(getAllLessonProgress())
  }

  const activePacks = getPacksForGroups(activeGroups)
  const visibleLessons = lessons.filter(l => activePacks.has(l.pack))
  const activeChapterIds = [...new Set(visibleLessons.map(l => l.chapterId))].sort((a, b) => a - b)

  function startLesson(id: number, typingModeOverride?: TypingMode) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    try {
      localStorage.setItem('flowkeys_pending_lesson', JSON.stringify({
        id: lesson.id, text: lesson.text, mode: lesson.mode, title: lesson.title,
        ...(typingModeOverride ? { typingMode: typingModeOverride } : {}),
      }))
    } catch {}
    router.push('/')
  }

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const masteredCount = Object.values(progress).filter(p => p.mastered).length
  const visibleTotal = visibleLessons.length

  const sortedVisibleLessons = [...visibleLessons].sort((a, b) => a.chapterId - b.chapterId || a.id - b.id)
  const nextLesson = mounted
    ? (sortedVisibleLessons.find(l => getLessonStatus(l.id, progress) === 'available') ?? null)
    : null

  const lastPracticedEntry = Object.values(progress)
    .filter(p => p.lastAttemptAt)
    .sort((a, b) => (b.lastAttemptAt ?? '').localeCompare(a.lastAttemptAt ?? ''))[0] ?? null
  const lastLesson = lastPracticedEntry
    ? lessons.find(l => l.id === lastPracticedEntry.lessonId && activePacks.has(l.pack))
    : null

  const PATH_DEFS: { id: string; icon: string; label: string; packs: LessonPack[]; modeOverride?: TypingMode; isCustom?: boolean }[] = [
    { id: 'basics',  icon: '⌨️', label: 'Podstawy',      packs: ['homerow'] },
    { id: 'numbers', icon: '🔢', label: 'Cyfry',          packs: ['numbers'] },
    { id: 'symbols', icon: '.,', label: 'Symbole',        packs: ['symbols'] },
    { id: 'start',   icon: '📘', label: 'Start',         packs: ['start'] },
    { id: 'fluency', icon: '🌊', label: 'Płynność',      packs: ['mastery', 'motivation', 'mindfulness'] },
    { id: 'polish',  icon: 'ą',  label: 'Polskie znaki', packs: ['polishSigns'] },
    { id: 'no_bs',   icon: '⌫',  label: 'No Backspace',  packs: ['noBackspace'], modeOverride: 'no_backspace' },
    { id: 'blind',   icon: '🙈', label: 'Blind Flow',    packs: ['blindFlow'],   modeOverride: 'blind' },
    { id: 'jade',    icon: '🍃', label: 'Jade Path',     packs: ['jadePath'] },
    { id: 'gaming',  icon: '🎮', label: 'Gaming',        packs: ['gaming'] },
    { id: 'own',     icon: '✍️', label: 'Własne teksty', packs: [], isCustom: true },
  ]

  const pathData = PATH_DEFS.map(def => {
    if (def.isCustom) return { ...def, total: 0, done: 0, next: null as FlowLesson | null }
    const pl = lessons.filter(l => def.packs.includes(l.pack))
    const done = pl.filter(l => progress[l.id]?.completed).length
    const next = pl.find(l => !progress[l.id]?.completed) ?? null
    return { ...def, total: pl.length, done, next }
  })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <Header />

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Lekcje</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Każda lekcja to jeden krok. Nie ścigaj się — rytm.
          </p>

          {/* Dashboard: Kontynuuj + Polecane dziś */}
          {mounted && (
            <div className={`grid gap-3 mb-6 ${recommendation ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {nextLesson && (
                <div className="bg-[var(--accent-500)] text-white rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-65 mb-0.5">Kontynuuj ścieżkę</p>
                    <p className="text-sm font-bold truncate">{nextLesson.title}</p>
                    <p className="text-xs opacity-60 mt-0.5 font-mono">{String(nextLesson.id).padStart(3,'0')}</p>
                  </div>
                  <button
                    onClick={() => startLesson(nextLesson.id)}
                    className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95"
                  >
                    Start →
                  </button>
                </div>
              )}
              {recommendation && (
                <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-0.5">Polecane dziś</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{recommendation.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{recommendation.desc}</p>
                  </div>
                  <button
                    onClick={() => startLesson(recommendation.lesson.id, recommendation.mode)}
                    className="shrink-0 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95"
                  >
                    Zacznij →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 8 ścieżek treningowych */}
          <div className="mb-2">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">Ścieżki treningowe</p>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 mb-6 snap-x">
            {pathData.map(path => (
              <div
                key={path.id}
                className="flex-none w-32 flex flex-col gap-2 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] hover:border-[var(--accent-400)] dark:hover:border-[var(--accent-500)]/40 rounded-2xl px-3.5 py-3.5 snap-start transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{path.icon}</span>
                  <span className="text-[11px] font-bold leading-tight text-gray-700 dark:text-gray-300">{path.label}</span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 leading-tight flex-1">
                  {path.isCustom ? 'Własny tekst' : mounted ? `${path.done} / ${path.total}` : '—'}
                </p>
                <button
                  onClick={() => {
                    if (path.isCustom) { router.push('/') }
                    else if (path.next) startLesson(path.next.id, path.modeOverride)
                  }}
                  disabled={!path.isCustom && !path.next}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                    (path.isCustom || path.next)
                      ? 'fk-btn bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white active:scale-95'
                      : 'bg-gray-100 dark:bg-[#222] text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {path.isCustom ? 'Wklej →' : path.next ? 'Start →' : 'Gotowe ✓'}
                </button>
              </div>
            ))}
          </div>

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

          {/* Ostatnio ćwiczone (jeśli inne niż następna) */}
          {mounted && lastLesson && lastLesson.id !== nextLesson?.id && (
            <div className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">Ostatnio</span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-600">{String(lastLesson.id).padStart(3, '0')}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex-1 truncate">{lastLesson.title}</span>
              <button onClick={() => startLesson(lastLesson.id)} className="text-xs text-[var(--accent-600)] dark:text-[var(--accent-400)] hover:underline shrink-0">
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
                        onSkip={
                          mounted && status !== 'locked' && !p?.completed
                            ? () => skipLesson(lesson.id)
                            : undefined
                        }
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

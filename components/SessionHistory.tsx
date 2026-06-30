'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { getSessions } from '@/lib/storage'
import { getLibrary } from '@/lib/library'
import { lessons } from '@/data/lessons'
import type { TypingSessionRecord, TypingStats, TypingMode } from '@/lib/types'
import { FINGER_LABELS, FINGER_COLORS } from '@/lib/fingerMap'
import { getSessionDiagnosis } from '@/lib/coach'
import ReplayModal from './ReplayModal'

const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

type SessionType = 'lesson' | 'library' | 'custom'
type FilterValue = TypingMode | 'all' | 'lessons' | 'library' | 'custom'

const FILTER_VALUES: FilterValue[] = ['all', 'lessons', 'library', 'custom', 'blind', 'no_backspace']

function computeLongestStreak(sessions: TypingSessionRecord[]): number {
  const days = [...new Set(sessions.map(s => s.createdAt.slice(0, 10)))].sort()
  if (days.length === 0) return 0
  let best = 1, cur = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]), curr = new Date(days[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    cur = diff === 1 ? cur + 1 : 1
    if (cur > best) best = cur
  }
  return best
}

function fmtMinutes(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const TYPE_BADGE: Record<SessionType, string> = {
  lesson:  'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/25',
  library: 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/25',
  custom:  'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a]',
}
function accColor(acc: number) {
  return acc >= 95 ? 'text-green-600 dark:text-green-400' : acc >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
}
function calmColor(c: number) {
  return c >= 80 ? 'text-teal-600 dark:text-teal-400' : c >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
}

function sessionType(s: TypingSessionRecord): SessionType {
  if (s.lessonId !== undefined) return 'lesson'
  if (s.libraryTextId) return 'library'
  return 'custom'
}

interface StatCardProps { value: string | number; label: string; desc?: string; color: string }
function StatCard({ value, label, desc, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">{label}</p>
      {desc && <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{desc}</p>}
    </div>
  )
}

export default function SessionHistory() {
  const router = useRouter()
  const locale = useLocale()
  const tDiagnosis = useTranslations('diagnosis')
  const t = useTranslations('sessionHistory')
  const diagText = (stats: TypingStats): string => {
    const dk = getSessionDiagnosis(stats)
    return String(tDiagnosis(dk.key as never, dk.params as never))
  }
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const filterLabel: Record<FilterValue, string> = {
    all: t('filterAll'), lessons: t('filterLessons'), library: t('filterLibrary'),
    custom: t('filterCustom'), normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
  }
  const typeLabel: Record<SessionType, string> = {
    lesson: t('typeLesson'), library: t('typeLibrary'), custom: t('typeCustom'),
  }
  const [sessions, setSessions] = useState<TypingSessionRecord[]>([])
  const [libraryMap, setLibraryMap] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<TypingSessionRecord | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sortBest, setSortBest] = useState(false)
  const [replaySession, setReplaySession] = useState<TypingSessionRecord | null>(null)

  useEffect(() => {
    setSessions(getSessions())
    const lib = getLibrary()
    const map: Record<string, string> = {}
    for (const entry of lib) map[entry.id] = entry.title
    setLibraryMap(map)
  }, [])

  function getTitle(s: TypingSessionRecord): string {
    if (s.lessonId !== undefined) {
      const lesson = lessons.find(l => l.id === s.lessonId)
      return lesson
        ? `${String(s.lessonId).padStart(3, '0')} — ${lesson.title}`
        : t('lessonLabel', { id: s.lessonId })
    }
    if (s.libraryTextId) {
      return libraryMap[s.libraryTextId] ?? t('libraryText')
    }
    return s.trainingText.slice(0, 60)
  }

  const base = filter === 'all' ? sessions
    : filter === 'lessons' ? sessions.filter(s => s.lessonId !== undefined)
    : filter === 'library' ? sessions.filter(s => !!s.libraryTextId)
    : filter === 'custom' ? sessions.filter(s => !s.lessonId && !s.libraryTextId)
    : sessions.filter(s => s.typingMode === filter)

  const filtered = sortBest ? [...base].sort((a, b) => b.stats.wpm - a.stats.wpm) : base

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">⌨️</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('empty')}</p>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">{t('emptyDesc')}</p>
      </div>
    )
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    const st = selected.stats
    const incomplete = st.completionPercent < 90
    const hasReplay = !!selected.replayData?.length
    const fingerErrors = st.errorsByFinger ?? {}
    const type = sessionType(selected)
    const title = getTitle(selected)

    return (
      <>
        {replaySession && (
          <ReplayModal
            replayData={replaySession.replayData!}
            trainingText={replaySession.trainingText}
            onClose={() => setReplaySession(null)}
          />
        )}

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition">
              {t('back')}
            </button>
            {hasReplay && (
              <button
                onClick={() => setReplaySession(selected)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white text-sm font-medium rounded-xl transition"
              >
                {t('playRound')}
              </button>
            )}
          </div>

          {/* Session header */}
          <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${TYPE_BADGE[type]}`}>
                {typeLabel[type]}
              </span>
              <span className="text-[10px] bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                {TYPING_LABEL[selected.typingMode]}
              </span>
              {type === 'library' && selected.libraryTextId && (
                <button
                  onClick={() => router.push('/library')}
                  className="text-[10px] text-violet-500 dark:text-violet-400 hover:underline ml-auto"
                >
                  {t('openInLibrary')}
                </button>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              {fmtDate(selected.createdAt)}
            </p>
            {incomplete && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t('incomplete', { chars: st.charsTyped })}
              </p>
            )}
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value={st.wpm} label="WPM" desc={t('statWpmDesc')} color="text-blue-600 dark:text-blue-400" />
            <StatCard value={`${st.accuracy}%`} label={t('statAccuracy')} desc={t('statAccuracyDesc')} color={accColor(st.accuracy)} />
            <StatCard value={`${st.completionPercent}%`} label={t('statCompletion')} color={incomplete ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'} />
            <StatCard value={st.mistakesCount} label={t('statErrors')} color={st.mistakesCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'} />
          </div>

          {/* Coach insight */}
          <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <span className="text-gray-400 dark:text-gray-600 shrink-0 mt-0.5 text-sm">◇</span>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{diagText(st)}</p>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={st.calmScore ?? st.accuracy} label={t('statCalmIndex')} desc={t('statCalmDesc')} color={calmColor(st.calmScore ?? st.accuracy)} />
            <StatCard value={st.backspaceCount ?? 0} label="Backspace" desc={t('statBackspaceDesc')} color="text-gray-700 dark:text-gray-300" />
            <StatCard value={st.bestStreak ?? 0} label={t('statBestStreak')} desc={t('statBestStreakDesc')} color="text-gray-700 dark:text-gray-300" />
          </div>

          {/* Finger errors */}
          {Object.keys(fingerErrors).length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('fingerErrors')}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(fingerErrors).sort((a, b) => b[1] - a[1]).map(([f, c]) => (
                  <span key={f} className={`text-xs px-3 py-1.5 rounded-xl font-medium ${FINGER_COLORS[f] ?? ''}`}>
                    {FINGER_LABELS[f] ?? f} · {c}×
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Common mistakes */}
          {st.commonMistakes.length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#242424]">{t('commonMistakes')}</p>
              <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
                {st.commonMistakes.slice(0, 5).map((m, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-2">
                    <span className="font-mono text-sm text-red-500 dark:text-red-400 w-6 text-center">{m.expected === ' ' ? '␣' : m.expected}</span>
                    <span className="text-gray-400 text-xs">→</span>
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400 w-6 text-center">{m.actual === ' ' ? '␣' : m.actual}</span>
                    <span className="flex-1" />
                    <span className="text-xs text-gray-400 dark:text-gray-600">{m.count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Texts */}
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{t('trainingText')}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{selected.trainingText}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{t('yourText')}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{selected.typedText}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── List view ────────────────────────────────────────────────────────────────
  const totalChars   = sessions.reduce((s, r) => s + r.stats.charsTyped, 0)
  const totalWords   = sessions.reduce((s, r) => s + r.stats.wordsTyped, 0)
  const estMinutes   = Math.round(sessions.reduce((s, r) => r.stats.wpm > 0 ? s + r.stats.wordsTyped / r.stats.wpm : s, 0))
  const longestStreak = computeLongestStreak(sessions)

  return (
    <div className="space-y-4">
      {/* Aggregate stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { value: totalChars.toLocaleString('pl-PL'), label: 'Znaków łącznie' },
          { value: totalWords.toLocaleString('pl-PL'), label: 'Słów łącznie' },
          { value: `${longestStreak} ${longestStreak === 1 ? 'dzień' : longestStreak < 5 ? 'dni' : 'dni'}`, label: 'Najdłuższa seria' },
          { value: fmtMinutes(estMinutes), label: '~Czas ćwiczeń' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-3 py-3 text-center">
            <p className="text-lg font-black text-gray-800 dark:text-gray-200 tabular-nums">{value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters + sort */}
      <div className="flex gap-2 flex-wrap items-center">
        {FILTER_VALUES.map(value => {
          const count = value === 'all' ? null
            : value === 'lessons' ? sessions.filter(s => s.lessonId !== undefined).length
            : value === 'library' ? sessions.filter(s => !!s.libraryTextId).length
            : value === 'custom' ? sessions.filter(s => !s.lessonId && !s.libraryTextId).length
            : sessions.filter(s => s.typingMode === value).length
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                filter === value
                  ? 'bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/10 text-[var(--accent-600)] dark:text-[var(--accent-400)] border-[var(--accent-200)] dark:border-[var(--accent-500)]/30'
                  : 'bg-white dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#3a3a3a]'
              }`}
            >
              {filterLabel[value]}
              {count !== null && count > 0 && <span className="ml-1 opacity-60">{count}</span>}
            </button>
          )
        })}
        <button
          onClick={() => setSortBest(v => !v)}
          className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition border ${
            sortBest
              ? 'bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/10 text-[var(--accent-600)] dark:text-[var(--accent-400)] border-[var(--accent-200)] dark:border-[var(--accent-500)]/30'
              : 'bg-white dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#3a3a3a]'
          }`}
        >
          {sortBest ? t('sortBest') : t('sortRecent')}
        </button>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">{t('noResults')}</p>
      )}

      <div className="space-y-2">
        {filtered.map(s => {
          const calm = s.stats.calmScore ?? s.stats.accuracy
          const bs = s.stats.backspaceCount ?? 0
          const hasReplay = !!s.replayData?.length
          const type = sessionType(s)
          const title = getTitle(s)

          return (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="w-full flex items-center gap-4 bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 text-left transition group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">{title}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 italic mt-0.5 truncate">{diagText(s.stats)}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400 dark:text-gray-600">{fmtDate(s.createdAt)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TYPE_BADGE[type]}`}>
                    {typeLabel[type]}
                  </span>
                  <span className="text-[10px] bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                    {TYPING_LABEL[s.typingMode]}
                  </span>
                  {hasReplay && (
                    <span className="text-[10px] bg-[var(--accent-50)] dark:bg-[var(--accent-600)]/10 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 text-[var(--accent-600)] dark:text-[var(--accent-400)] px-2 py-0.5 rounded-full">
                      replay
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-right">
                <div title={t('statWpmDesc')}>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{s.stats.wpm}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">wpm</p>
                </div>
                <div title={t('statAccuracyDesc')}>
                  <p className={`text-sm font-bold ${accColor(s.stats.accuracy)}`}>{s.stats.accuracy}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">acc</p>
                </div>
                <div title={t('statCalmDesc')}>
                  <p className={`text-sm font-bold ${calmColor(calm)}`}>{calm}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">{t('statCalmShort')}</p>
                </div>
                <div title={t('statBackspaceDesc')}>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-500">{bs}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">bs</p>
                </div>
                <span className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 transition">›</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

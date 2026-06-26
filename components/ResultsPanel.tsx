'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { TypingStats, TypingMode, TransformMode, ReplayEvent, TypingSessionRecord } from '@/lib/types'
import { FINGER_LABELS, FINGER_COLORS } from '@/lib/fingerMap'
import { getCustomText, type CustomText } from '@/lib/library'
import { getSessions } from '@/lib/storage'
import ReplayModal from './ReplayModal'

const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

type Tier = 'great' | 'good' | 'ok' | 'practice'

function getTier(acc: number, calm: number): Tier {
  if (acc >= 95 && calm >= 80) return 'great'
  if (acc >= 85) return 'good'
  if (acc >= 70) return 'ok'
  return 'practice'
}

const TIER_STYLE: Record<Tier, { bg: string; border: string; text: string; label: string }> = {
  great:    { bg: 'bg-teal-50 dark:bg-teal-500/8',   border: 'border-teal-200 dark:border-teal-500/20',   text: 'text-teal-700 dark:text-teal-300',   label: 'Czysto' },
  good:     { bg: 'bg-blue-50 dark:bg-blue-500/8',    border: 'border-blue-200 dark:border-blue-500/20',    text: 'text-blue-700 dark:text-blue-300',    label: 'Dobrze' },
  ok:       { bg: 'bg-amber-50 dark:bg-amber-500/8',  border: 'border-amber-200 dark:border-amber-500/20',  text: 'text-amber-700 dark:text-amber-300',  label: 'W porządku' },
  practice: { bg: 'bg-gray-50 dark:bg-[#161616]',     border: 'border-gray-200 dark:border-[#242424]',      text: 'text-gray-700 dark:text-gray-300',    label: 'Ćwiczymy' },
}
const BLIND_STYLE = {
  bg: 'bg-purple-50 dark:bg-purple-500/8',
  border: 'border-purple-200 dark:border-purple-500/20',
  text: 'text-purple-700 dark:text-purple-300',
  label: 'Blind Flow',
}

function wpmBadge(v: number)  { return v >= 60 ? 'ekspres' : v >= 40 ? 'sprawnie' : v >= 25 ? 'dobrze' : 'spokojne tempo' }
function accBadge(v: number)  { return v >= 97 ? 'perfekcja' : v >= 95 ? 'bardzo dobrze' : v >= 88 ? 'dobrze' : v >= 80 ? 'solidnie' : 'warto zwolnić' }
function calmBadge(v: number) { return v >= 90 ? 'spokojnie' : v >= 75 ? 'stabilnie' : v >= 55 ? 'ok' : 'nerwowo' }
function bsBadge(v: number)   { return v <= 5 ? 'czysto' : v <= 15 ? 'ok' : v <= 30 ? 'sporo' : 'dużo poprawek' }

function getDiagnosis(stats: TypingStats): string {
  const bs = stats.backspaceCount ?? 0
  const calm = stats.calmScore ?? stats.accuracy
  const errors = stats.errorsByFinger ?? {}
  const worstFinger = Object.entries(errors).sort((a, b) => b[1] - a[1])[0]
  if (calm < 50 && bs > 10) return `Dużo cofania (${bs}×). Spróbuj wolniej — rytm ważniejszy niż szybkość.`
  if (stats.polishCharsMissed >= 3) return 'Najczęściej gubisz polskie znaki — ą ę ć ł ń ó ś ź ż.'
  if (worstFinger && worstFinger[1] >= 3) return `Najsłabszy palec: ${FINGER_LABELS[worstFinger[0]] ?? worstFinger[0]} (${worstFinger[1]} błędów). Zwolnij na tych klawiszach.`
  if (stats.accuracy >= 97) return 'Świetna dokładność. Teraz pracuj nad prędkością i płynnością.'
  if (stats.accuracy >= 90) return 'Dobra ciągłość. Ćwicz końcówki słów i płynne przejścia.'
  if (stats.mistakesCount > 0 && stats.commonMistakes[0]?.count >= 3) {
    const m = stats.commonMistakes[0]
    return `Powtarzający się błąd: „${m.expected === ' ' ? '␣' : m.expected}" → „${m.actual === ' ' ? '␣' : m.actual}".`
  }
  if (stats.wpm < 20) return 'Spokojne tempo — to dobry start. Rytm ważniejszy niż szybkość.'
  return 'Runda zapisana. Kontynuuj ćwiczenie w regularnym rytmie.'
}

const POLISH_STRIPPED: Record<string, string> = {
  'ą': 'a', 'ę': 'e', 'ć': 'c', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
  'Ą': 'A', 'Ę': 'E', 'Ć': 'C', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
}

function isPolishDiacriticLoss(expected: string, actual: string): boolean {
  return !!(expected && actual && POLISH_STRIPPED[expected]?.toLowerCase() === actual.toLowerCase())
}

function fmtShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

interface ChartPoint { wpm: number; acc: number; current?: boolean }

function ProgressChart({ points }: { points: ChartPoint[] }) {
  if (points.length < 2) return null
  const W = 500, H = 100
  const PL = 10, PR = 10, PT = 18, PB = 20
  const iW = W - PL - PR, iH = H - PT - PB
  const n = points.length
  const maxWpm = Math.max(40, ...points.map(p => p.wpm)) * 1.08

  const xOf = (i: number) => PL + (n < 2 ? iW / 2 : (i / (n - 1)) * iW)
  const yW = (v: number) => PT + (1 - Math.min(v / maxWpm, 1)) * iH
  const yA = (v: number) => PT + (1 - v / 100) * iH

  const wPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yW(p.wpm)}`).join(' ')
  const aPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yA(p.acc)}`).join(' ')
  const last = points[n - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* grid */}
      {[25, 50, 75].map(pct => (
        <line key={pct} x1={PL} x2={W - PR}
          y1={PT + (1 - pct / 100) * iH} y2={PT + (1 - pct / 100) * iH}
          stroke="currentColor" strokeOpacity={0.05} strokeWidth={1} />
      ))}
      {/* acc fill */}
      <path d={`${aPath} L${xOf(n - 1)},${H - PB} L${xOf(0)},${H - PB}Z`} fill="#10b981" fillOpacity={0.07} />
      {/* wpm fill */}
      <path d={`${wPath} L${xOf(n - 1)},${H - PB} L${xOf(0)},${H - PB}Z`} fill="var(--accent-500)" fillOpacity={0.05} />
      {/* lines */}
      <path d={aPath} fill="none" stroke="#10b981" strokeWidth={1.5} strokeOpacity={0.7} strokeLinejoin="round" />
      <path d={wPath} fill="none" stroke="var(--accent-500)" strokeWidth={2} strokeLinejoin="round" />
      {/* dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xOf(i)} cy={yW(p.wpm)} r={p.current ? 4.5 : 2.5} fill="var(--accent-500)" />
          <circle cx={xOf(i)} cy={yA(p.acc)} r={p.current ? 3.5 : 2} fill="#10b981" />
        </g>
      ))}
      {/* current labels */}
      <text x={xOf(n - 1)} y={yW(last.wpm) - 8} textAnchor="middle" fontSize={9} fill="var(--accent-500)" fontWeight="bold">{last.wpm}</text>
      <text x={xOf(n - 1)} y={yA(last.acc) - 8} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight="bold">{last.acc}%</text>
      {/* legend */}
      <g>
        <circle cx={PL} cy={6} r={3} fill="var(--accent-500)" />
        <text x={PL + 6} y={9.5} fontSize={8} fill="currentColor" fillOpacity={0.45}>WPM</text>
        <circle cx={PL + 38} cy={6} r={2.5} fill="#10b981" />
        <text x={PL + 44} y={9.5} fontSize={8} fill="currentColor" fillOpacity={0.45}>Dokładność</text>
      </g>
    </svg>
  )
}

export interface BadgeSummary { icon: string; title: string; description: string }

type SuggestionAction = 'blind' | 'no_backspace' | 'next_lesson'

interface Props {
  stats: TypingStats
  trainingText: string
  typedText: string
  transformMode: TransformMode
  typingMode: TypingMode
  newBadges?: BadgeSummary[]
  earnedStars?: 0 | 1 | 2 | 3
  lessonId?: number
  hasNextLesson?: boolean
  replayData?: ReplayEvent[]
  currentSessionId?: string
  libraryTextId?: string | null
  onSaveToLibrary?: (title: string) => void
  hasNextChunk?: boolean
  onNextChunk?: () => void
  onNewRound: () => void
  onRepeat: () => void
  onAction?: (action: SuggestionAction) => void
}

export default function ResultsPanel({
  stats, trainingText, typedText, typingMode,
  newBadges, earnedStars, lessonId, hasNextLesson,
  replayData, currentSessionId, libraryTextId, onSaveToLibrary, hasNextChunk, onNextChunk,
  onNewRound, onRepeat, onAction,
}: Props) {
  const router = useRouter()
  const [libraryEntry, setLibraryEntry] = useState<CustomText | null>(null)
  const [saveExpanded, setSaveExpanded] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [savedToLib, setSavedToLib] = useState(false)
  const [replayOpen, setReplayOpen] = useState(false)
  const [prevSessions, setPrevSessions] = useState<TypingSessionRecord[]>([])
  const [historyReplay, setHistoryReplay] = useState<TypingSessionRecord | null>(null)

  useEffect(() => {
    if (libraryTextId) setLibraryEntry(getCustomText(libraryTextId))
  }, [libraryTextId])

  // Enter → next lesson / next chunk
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      e.preventDefault()
      if (hasNextLesson && onAction) { onAction('next_lesson'); return }
      if (hasNextChunk && onNextChunk) { onNextChunk(); return }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasNextLesson, onAction, hasNextChunk, onNextChunk])

  useEffect(() => {
    if (lessonId === undefined && !libraryTextId) return
    const all = getSessions()
    const matching = all.filter(s =>
      lessonId !== undefined ? s.lessonId === lessonId : s.libraryTextId === libraryTextId
    ).filter(s => s.id !== currentSessionId)
    setPrevSessions(matching)
  }, [lessonId, libraryTextId, currentSessionId])

  const acc   = stats.accuracy
  const calm  = stats.calmScore ?? acc
  const bs    = stats.backspaceCount ?? 0
  const streak = stats.bestStreak ?? 0
  const incomplete = stats.completionPercent < 90
  const isBlind = typingMode === 'blind'
  const tier = getTier(acc, calm)

  const hero = isBlind ? BLIND_STYLE : { ...TIER_STYLE[tier] }

  const accColor  = acc  >= 95 ? 'text-green-600 dark:text-green-400'  : acc  >= 80 ? 'text-amber-600 dark:text-amber-400'  : 'text-red-500 dark:text-red-400'
  const calmColor = calm >= 80 ? 'text-teal-600 dark:text-teal-400'    : calm >= 60 ? 'text-amber-600 dark:text-amber-400'   : 'text-red-500 dark:text-red-400'
  const bsColor   = bs   >  40 ? 'text-red-500 dark:text-red-400'      : bs   >  10 ? 'text-amber-600 dark:text-amber-400'   : 'text-gray-700 dark:text-gray-300'
  const fingerErrors = stats.errorsByFinger ?? {}
  const hasFingerErrors = Object.keys(fingerErrors).length > 0

  const starLabel = earnedStars === 3 ? 'Lekcja opanowana!' : earnedStars === 2 ? 'Świetny wynik!' : 'Lekcja zaliczona!'

  return (
    <div className="space-y-4">

      {/* ── HERO ── */}
      <div className={`${hero.bg} ${hero.border} border rounded-3xl px-6 py-8`}>

        {/* Stars */}
        {(earnedStars ?? 0) > 0 && (
          <div className="flex justify-center gap-3 mb-5">
            {[1, 2, 3].map(i => (
              <span
                key={i}
                className={`leading-none transition-transform ${
                  i <= (earnedStars ?? 0)
                    ? 'text-5xl text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                    : 'text-4xl text-gray-200 dark:text-gray-800 opacity-50'
                }`}
              >★</span>
            ))}
          </div>
        )}

        {/* WPM */}
        <div className="text-center mb-5">
          <p className={`text-9xl font-black leading-none ${hero.text}`}>{stats.wpm}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-medium">WPM · {wpmBadge(stats.wpm)}</p>
        </div>

        {/* Acc + Calm */}
        <div className="flex justify-center gap-12 mb-5">
          <div className="text-center">
            <p className={`text-4xl font-bold leading-none ${accColor}`}>{acc}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">dokładność · {accBadge(acc)}</p>
          </div>
          <div className="text-center">
            <p className={`text-4xl font-bold leading-none ${calmColor}`}>{calm}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">spokój · {calmBadge(calm)}</p>
          </div>
        </div>

        {/* Calm bar */}
        <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${calm >= 80 ? 'bg-teal-400' : calm >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${calm}%` }}
          />
        </div>

        {/* Star label or tier label */}
        {(earnedStars ?? 0) > 0 && (
          <p className={`text-center text-base font-bold ${hero.text} mb-3`}>{starLabel}</p>
        )}

        {/* Diagnosis */}
        <p className={`text-sm ${hero.text} leading-relaxed text-center bg-black/5 dark:bg-white/5 rounded-2xl px-5 py-3`}>
          {getDiagnosis(stats)}
        </p>

        {/* Tags */}
        <div className="flex justify-center gap-2 flex-wrap mt-4">
          {typingMode !== 'normal' && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${hero.border} ${hero.text}`}>
              {TYPING_LABEL[typingMode]}
            </span>
          )}
          {lessonId !== undefined && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${hero.border} ${hero.text}`}>
              Lekcja {String(lessonId).padStart(3, '0')} · {hero.label}
            </span>
          )}
          {incomplete && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
              Niedokończone ({stats.completionPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* ── NEXT LESSON: primary CTA ── */}
      {hasNextLesson && onAction && (
        <button
          onClick={() => onAction('next_lesson')}
          className="fk-btn w-full py-5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-3 group"
        >
          <span>Następna lekcja</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
          <kbd className="text-xs font-normal bg-white/20 px-2.5 py-1 rounded-lg ml-1 opacity-70">Enter</kbd>
        </button>
      )}

      {/* ── SECONDARY STATS ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${bs <= 10 ? 'bg-green-400' : bs <= 30 ? 'bg-amber-400' : 'bg-red-400'}`} />
          <p className="text-xl mt-1 mb-1">⌫</p>
          <p className={`text-2xl font-black leading-none ${bsColor}`}>{bs}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">Backspace</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">{bsBadge(bs)}</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${streak >= 20 ? 'bg-green-400' : streak >= 10 ? 'bg-amber-400' : 'bg-gray-300 dark:bg-[#333]'}`} />
          <p className="text-xl mt-1 mb-1">🔥</p>
          <p className="text-2xl font-black leading-none text-gray-700 dark:text-gray-300">{streak}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">Najlepsza seria</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">{streak >= 20 ? 'świetna' : streak >= 10 ? 'dobra' : 'ćwiczymy'}</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${stats.mistakesCount === 0 ? 'bg-green-400' : stats.mistakesCount <= 3 ? 'bg-amber-400' : 'bg-red-400'}`} />
          <p className="text-xl mt-1 mb-1">{stats.mistakesCount === 0 ? '✓' : '✕'}</p>
          <p className={`text-2xl font-black leading-none ${stats.mistakesCount === 0 ? 'text-green-600 dark:text-green-400' : stats.mistakesCount <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
            {stats.mistakesCount}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">Błędy</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
            {stats.mistakesCount === 0 ? 'czysto!' : stats.mistakesCount <= 3 ? 'mało' : 'ćwiczymy'}
          </p>
        </div>
      </div>

      {/* ── TEXT DIFF ── */}
      {trainingText && typedText && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#1e1e1e]">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
              Tekst z błędami
            </p>
            {(replayData?.length ?? 0) > 0 && (
              <button
                onClick={() => setReplayOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors"
              >
                <span>▶</span> Odtwórz
              </button>
            )}
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-8 font-mono break-words whitespace-pre-wrap select-none">
              {trainingText.split('').map((ch, i) => {
                const typed = typedText[i]
                if (typed === undefined) {
                  return <span key={i} className="text-gray-300 dark:text-gray-700">{ch === ' ' ? ' ' : ch}</span>
                }
                if (typed === ch) {
                  return <span key={i} className="text-gray-600 dark:text-gray-400">{ch === ' ' ? ' ' : ch}</span>
                }
                return (
                  <span key={i} className="relative inline-block">
                    <span className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded px-0.5">{ch === ' ' ? '·' : ch}</span>
                  </span>
                )
              })}
            </p>
          </div>
        </div>
      )}

      {/* ── SESSION HISTORY ── */}
      {prevSessions.length > 0 && (() => {
        const chartPoints: ChartPoint[] = [...prevSessions].reverse().map(s => ({
          wpm: s.stats.wpm,
          acc: s.stats.accuracy,
        }))
        chartPoints.push({ wpm: stats.wpm, acc: stats.accuracy, current: true })
        return (
          <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#1e1e1e]">
              Postęp · {prevSessions.length + 1} {prevSessions.length + 1 === 1 ? 'próba' : prevSessions.length + 1 < 5 ? 'próby' : 'prób'}
            </p>
            <div className="px-4 pt-3 pb-1">
              <ProgressChart points={chartPoints} />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
              {prevSessions.slice(0, 8).map((s, i) => {
                const isFirst = i === 0
                return (
                  <div key={s.id} className={`flex items-center gap-3 px-5 py-2.5 ${isFirst ? 'bg-gray-50/50 dark:bg-white/[0.015]' : ''}`}>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 w-24 shrink-0 tabular-nums">{fmtShortDate(s.createdAt)}</span>
                    <span className="text-sm font-bold text-[var(--accent-500)] tabular-nums w-10 shrink-0">{s.stats.wpm}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0">wpm</span>
                    <span className={`text-sm font-semibold tabular-nums w-12 shrink-0 ${s.stats.accuracy >= 95 ? 'text-green-600 dark:text-green-400' : s.stats.accuracy >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>{s.stats.accuracy}%</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0">acc</span>
                    <div className="flex-1" />
                    {s.replayData?.length ? (
                      <button
                        onClick={() => setHistoryReplay(s)}
                        className="text-[10px] font-semibold text-[var(--accent-500)] hover:text-[var(--accent-600)] flex items-center gap-1 shrink-0 transition-colors"
                      >
                        ▶ odtwórz
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-300 dark:text-gray-700 shrink-0">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── BADGE: show only first, hint at rest ── */}
      {(newBadges?.length ?? 0) > 0 && (() => {
        const first = newBadges![0]
        const extra = (newBadges?.length ?? 0) - 1
        return (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">{first.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">🏅 {first.title}</p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">{first.description}</p>
            </div>
            {extra > 0 && (
              <button
                onClick={() => router.push('/badges')}
                className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-500/30 transition"
              >
                +{extra} więcej →
              </button>
            )}
          </div>
        )
      })()}

      {/* ── MISTAKES ── */}
      {stats.commonMistakes.length > 0 && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#1e1e1e]">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
              Najczęstsze błędy
            </p>
            <p className="text-[9px] text-gray-400 dark:text-gray-600">
              <span className="text-red-400 dark:text-red-500">cel</span> → wpisano
            </p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
            {stats.commonMistakes.slice(0, 4).map((m, i) => {
              const isPolish = isPolishDiacriticLoss(m.expected, m.actual)
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                  <div className="flex flex-col items-center shrink-0">
                    <span className={`font-mono text-sm font-bold px-2 py-1 rounded-lg border min-w-[28px] text-center ${isPolish ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400'}`}>
                      {m.expected === ' ' ? '␣' : m.expected}
                    </span>
                    <span className="text-[8px] text-gray-400 dark:text-gray-600 mt-0.5 leading-none">cel</span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-600 text-xs shrink-0">→</span>
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#1e1e1e] min-w-[28px] text-center">
                      {m.actual === ' ' ? '␣' : m.actual}
                    </span>
                    <span className="text-[8px] text-gray-400 dark:text-gray-600 mt-0.5 leading-none">błąd</span>
                  </div>
                  {isPolish && <span className="text-[9px] bg-orange-100 dark:bg-orange-500/15 text-orange-500 dark:text-orange-400 px-1.5 py-0.5 rounded shrink-0">ogonek</span>}
                  <div className="flex-1 h-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden mx-2">
                    <div
                      className={`h-1 rounded-full ${isPolish ? 'bg-orange-300 dark:bg-orange-700' : 'bg-red-300 dark:bg-red-700'}`}
                      style={{ width: `${Math.min(100, (m.count / (stats.commonMistakes[0]?.count || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-600 shrink-0 tabular-nums">{m.count}×</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── FINGER ERRORS ── */}
      {hasFingerErrors && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">Błędy wg palca</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(fingerErrors).sort((a, b) => b[1] - a[1]).map(([f, c]) => (
              <span key={f} className={`text-xs px-3 py-1.5 rounded-xl font-medium ${FINGER_COLORS[f] ?? ''}`}>
                {FINGER_LABELS[f] ?? f} · {c}×
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── LIBRARY context ── */}
      {libraryEntry && (
        <div className="bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/8 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--accent-100)] dark:border-[var(--accent-500)]/15 flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--accent-600)] dark:text-[var(--accent-400)] uppercase tracking-widest">Ten tekst</p>
            <p className="text-xs text-[var(--accent-500)]/70 dark:text-[var(--accent-400)]/60 truncate max-w-[60%] text-right">{libraryEntry.title}</p>
          </div>
          <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-[var(--accent-100)] dark:border-[var(--accent-500)]/15">
            <div className="text-center">
              <p className="text-2xl font-black text-[var(--accent-600)] dark:text-[var(--accent-400)]">{libraryEntry.practiceCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                {libraryEntry.practiceCount === 1 ? 'runda' : libraryEntry.practiceCount < 5 ? 'rundy' : 'rund'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{libraryEntry.bestWpm ?? '—'}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">WPM best</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-600 dark:text-green-400">
                {libraryEntry.bestAccuracy != null ? `${libraryEntry.bestAccuracy}%` : '—'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">acc best</p>
            </div>
          </div>
          <div className="px-5 py-3 flex gap-2 flex-wrap">
            {hasNextChunk && onNextChunk ? (
              <button
                onClick={onNextChunk}
                className="flex-1 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-xs font-bold rounded-xl transition"
              >
                Następny fragment →
              </button>
            ) : (
              <button
                onClick={onRepeat}
                className="flex-1 py-2.5 bg-[var(--accent-100)] dark:bg-[var(--accent-500)]/15 hover:bg-[var(--accent-200)] dark:hover:bg-[var(--accent-500)]/25 text-[var(--accent-600)] dark:text-[var(--accent-400)] text-xs font-bold rounded-xl transition"
              >
                Powtórz tekst
              </button>
            )}
            <button
              onClick={() => router.push('/library')}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-xl transition"
            >
              Wróć do biblioteki →
            </button>
          </div>
        </div>
      )}

      {/* ── SAVE TO LIBRARY ── */}
      {!lessonId && !libraryTextId && onSaveToLibrary && (
        <div className="bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/8 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 rounded-2xl p-5">
          {savedToLib ? (
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">Zapisano do Mojej Biblioteki</p>
                <button onClick={() => router.push('/library')} className="text-xs text-[var(--accent-500)] hover:text-[var(--accent-600)] dark:hover:text-[var(--accent-400)] underline mt-0.5 transition">
                  Przejdź do biblioteki →
                </button>
              </div>
            </div>
          ) : !saveExpanded ? (
            <button onClick={() => setSaveExpanded(true)} className="w-full flex items-center gap-3 text-left group">
              <span className="text-xl shrink-0">📚</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">Zapisz do Mojej Biblioteki</p>
                <p className="text-xs text-[var(--accent-500)]/70 dark:text-[var(--accent-400)]/60 mt-0.5">Wróć do tego tekstu kiedy chcesz. Każda runda zostawia ślad.</p>
              </div>
              <span className="text-[var(--accent-400)] shrink-0 group-hover:translate-x-0.5 transition-transform">›</span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">Nadaj tytuł temu tekstowi</p>
              <input
                type="text"
                value={saveTitle}
                onChange={e => setSaveTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && saveTitle.trim()) { onSaveToLibrary(saveTitle.trim()); setSavedToLib(true) }
                  if (e.key === 'Escape') setSaveExpanded(false)
                }}
                placeholder="Np. Wspomnienie, Moja afirmacja..."
                autoFocus
                className="w-full bg-white dark:bg-[#161616] border border-[var(--accent-200)] dark:border-[var(--accent-500)]/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-400)] transition"
              />
              <div className="flex gap-2">
                <button onClick={() => setSaveExpanded(false)} className="px-4 py-2 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">
                  Anuluj
                </button>
                <button
                  onClick={() => { if (saveTitle.trim()) { onSaveToLibrary(saveTitle.trim()); setSavedToLib(true) } }}
                  disabled={!saveTitle.trim()}
                  className="flex-1 py-2 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-xs font-bold rounded-xl transition disabled:opacity-40"
                >
                  Zapisz →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ACTIONS ── */}
      <div className="flex gap-3">
        <button
          onClick={onRepeat}
          className="flex-1 py-3.5 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#252525] border border-gray-200 dark:border-[#2e2e2e] text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
        >
          <span>↩</span>
          {isBlind && incomplete ? 'Spróbuj jeszcze raz' : 'Powtórz'}
        </button>
        <button
          onClick={onNewRound}
          className="fk-btn flex-1 py-3.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          <span>✦</span>
          Nowa runda
        </button>
      </div>

      {/* ── REPLAY MODAL ── */}
      {replayOpen && replayData && replayData.length > 0 && (
        <ReplayModal
          replayData={replayData}
          trainingText={trainingText}
          onClose={() => setReplayOpen(false)}
        />
      )}
      {historyReplay && historyReplay.replayData && (
        <ReplayModal
          replayData={historyReplay.replayData}
          trainingText={historyReplay.trainingText}
          onClose={() => setHistoryReplay(null)}
        />
      )}

    </div>
  )
}

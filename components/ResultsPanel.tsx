'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import type { TypingStats, TypingMode, TransformMode, ReplayEvent, TypingSessionRecord } from '@/lib/types'
import { FINGER_LABELS, FINGER_COLORS } from '@/lib/fingerMap'
import { getCustomText, type CustomText } from '@/lib/library'
import { getSessions } from '@/lib/storage'
import { getSessionDiagnosis, type CoachInsightKey } from '@/lib/coach'
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

const TIER_BG: Record<Tier, string> = {
  great:    'bg-teal-50 dark:bg-teal-500/8',
  good:     'bg-blue-50 dark:bg-blue-500/8',
  ok:       'bg-amber-50 dark:bg-amber-500/8',
  practice: 'bg-gray-50 dark:bg-[#161616]',
}
const TIER_BORDER: Record<Tier, string> = {
  great:    'border-teal-200 dark:border-teal-500/20',
  good:     'border-blue-200 dark:border-blue-500/20',
  ok:       'border-amber-200 dark:border-amber-500/20',
  practice: 'border-gray-200 dark:border-[#242424]',
}
const TIER_TEXT: Record<Tier, string> = {
  great:    'text-teal-700 dark:text-teal-300',
  good:     'text-blue-700 dark:text-blue-300',
  ok:       'text-amber-700 dark:text-amber-300',
  practice: 'text-gray-700 dark:text-gray-300',
}
const BLIND_STYLE = {
  bg: 'bg-purple-50 dark:bg-purple-500/8',
  border: 'border-purple-200 dark:border-purple-500/20',
  text: 'text-purple-700 dark:text-purple-300',
}

const STAR_UP: Record<number, { acc: number; calm: number }> = {
  1: { acc: 88, calm: 72 },
  2: { acc: 93, calm: 80 },
  3: { acc: 96, calm: 85 },
  4: { acc: 98, calm: 90 },
}

const POLISH_STRIPPED: Record<string, string> = {
  'ą': 'a', 'ę': 'e', 'ć': 'c', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
  'Ą': 'A', 'Ę': 'E', 'Ć': 'C', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
}

function isPolishDiacriticLoss(expected: string, actual: string): boolean {
  return !!(expected && actual && POLISH_STRIPPED[expected]?.toLowerCase() === actual.toLowerCase())
}

function relDate(iso: string, locale: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 2) return locale === 'pl' ? 'przed chwilą' : locale === 'de' ? 'gerade eben' : locale === 'es' ? 'hace un momento' : 'just now'
  if (m < 60) return locale === 'pl' ? `${m} min temu` : locale === 'de' ? `vor ${m} Min.` : locale === 'es' ? `hace ${m} min` : `${m} min ago`
  if (h < 24) return locale === 'pl' ? `${h} godz. temu` : locale === 'de' ? `vor ${h} Std.` : locale === 'es' ? `hace ${h} h` : `${h}h ago`
  if (d === 1) return locale === 'pl' ? 'wczoraj' : locale === 'de' ? 'gestern' : locale === 'es' ? 'ayer' : 'yesterday'
  if (d < 7) return locale === 'pl' ? `${d} dni temu` : locale === 'de' ? `vor ${d} Tagen` : locale === 'es' ? `hace ${d} días` : `${d}d ago`
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

function niceTop(v: number): number {
  for (const s of [20, 30, 40, 50, 60, 75, 80, 100, 120, 150]) if (s >= v) return s
  return Math.ceil(v / 20) * 20
}

function WpmBarChart({ points }: { points: { wpm: number; current?: boolean }[] }) {
  const W = 300, H = 120
  const PL = 28, PR = 8, PT = 12, PB = 16
  const iW = W - PL - PR, iH = H - PT - PB
  const n = points.length
  const maxY = niceTop(Math.max(20, ...points.map(p => p.wpm)))
  const ticks = [0, Math.round(maxY / 2), maxY]
  const slotW = iW / n
  const barW = Math.min(18, slotW * 0.7)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {ticks.map(v => {
        const y = PT + (1 - v / maxY) * iH
        return (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <text x={PL - 4} y={y + 3.5} textAnchor="end" fontSize={7} fill="currentColor" fillOpacity={0.4}>{v}</text>
          </g>
        )
      })}
      {points.map((p, i) => {
        const bH = Math.max(2, (p.wpm / maxY) * iH)
        const x = PL + slotW * i + (slotW - barW) / 2
        const y = PT + iH - bH
        const isCur = !!p.current
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH}
              fill="var(--accent-500)" fillOpacity={isCur ? 1 : 0.35} rx={2} />
            {isCur && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={8} fill="var(--accent-500)" fontWeight="bold">{p.wpm}</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function AccLineChart({ points }: { points: { acc: number; current?: boolean }[] }) {
  const W = 300, H = 120
  const PL = 32, PR = 8, PT = 12, PB = 16
  const iW = W - PL - PR, iH = H - PT - PB
  const n = points.length
  const minAcc = Math.max(0, Math.floor(Math.min(...points.map(p => p.acc)) / 10) * 10 - 10)
  const ticks = [minAcc, Math.round((minAcc + 100) / 2), 100]

  const xOf = (i: number) => PL + (n < 2 ? iW / 2 : (i / (n - 1)) * iW)
  const yOf = (v: number) => PT + (1 - (v - minAcc) / (100 - minAcc)) * iH
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(p.acc).toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {ticks.map(v => {
        const y = yOf(v)
        return (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
            <text x={PL - 4} y={y + 3.5} textAnchor="end" fontSize={7} fill="currentColor" fillOpacity={0.4}>{v}%</text>
          </g>
        )
      })}
      <path d={`${linePath} L${xOf(n - 1)},${H - PB} L${xOf(0)},${H - PB}Z`} fill="#10b981" fillOpacity={0.07} />
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth={1.5} strokeLinejoin="round" />
      {points.map((p, i) => {
        const isCur = !!p.current
        return (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(p.acc)} r={isCur ? 4 : 3}
              fill={isCur ? '#10b981' : 'var(--chart-dot-bg, white)'} stroke="#10b981" strokeWidth={1.5} />
            {isCur && (
              <text x={xOf(i)} y={yOf(p.acc) - 8} textAnchor="middle" fontSize={8} fill="#10b981" fontWeight="bold">{p.acc}%</text>
            )}
          </g>
        )
      })}
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
  earnedStars?: 0 | 1 | 2 | 3 | 4 | 5
  lessonId?: number
  hasNextLesson?: boolean
  replayData?: ReplayEvent[]
  currentSessionId?: string
  libraryTextId?: string | null
  onSaveToLibrary?: (title: string) => void
  hasNextChunk?: boolean
  onNextChunk?: () => void
  coachInsight?: CoachInsightKey | null
  locale?: string
  onNewRound: () => void
  onRepeat: () => void
  onAction?: (action: SuggestionAction) => void
  onBackToAcademy?: () => void
}

export default function ResultsPanel({
  stats, trainingText, typedText, typingMode,
  newBadges, earnedStars, lessonId, hasNextLesson,
  replayData, currentSessionId, libraryTextId, onSaveToLibrary, hasNextChunk, onNextChunk,
  coachInsight, locale = 'pl', onNewRound, onRepeat, onAction, onBackToAcademy,
}: Props) {
  const router = useRouter()
  const t = useTranslations('results')
  const tDiagnosis = useTranslations('diagnosis')
  const tCoach = useTranslations('coach')

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      e.preventDefault()
      if (hasNextLesson && onAction) { onAction('next_lesson'); return }
      if (hasNextChunk && onNextChunk) { onNextChunk(); return }
      if (onBackToAcademy) { onBackToAcademy(); return }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasNextLesson, onAction, hasNextChunk, onNextChunk, onBackToAcademy])

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

  const heroBg     = isBlind ? BLIND_STYLE.bg     : TIER_BG[tier]
  const heroBorder = isBlind ? BLIND_STYLE.border  : TIER_BORDER[tier]
  const heroText   = isBlind ? BLIND_STYLE.text    : TIER_TEXT[tier]

  const accColor  = acc  >= 95 ? 'text-green-600 dark:text-green-400'  : acc  >= 80 ? 'text-amber-600 dark:text-amber-400'  : 'text-red-500 dark:text-red-400'
  const calmColor = calm >= 80 ? 'text-teal-600 dark:text-teal-400'    : calm >= 60 ? 'text-amber-600 dark:text-amber-400'   : 'text-red-500 dark:text-red-400'
  const bsColor   = bs   >  40 ? 'text-red-500 dark:text-red-400'      : bs   >  10 ? 'text-amber-600 dark:text-amber-400'   : 'text-gray-700 dark:text-gray-300'
  const fingerErrors = stats.errorsByFinger ?? {}
  const hasFingerErrors = Object.keys(fingerErrors).length > 0

  const wpmBadgeKey = stats.wpm >= 60 ? 'fast' : stats.wpm >= 40 ? 'smooth' : stats.wpm >= 25 ? 'good' : 'slow'
  const accBadgeKey = acc >= 97 ? 'perfect' : acc >= 95 ? 'veryGood' : acc >= 88 ? 'good' : acc >= 80 ? 'solid' : 'slow'
  const calmBadgeKey = calm >= 90 ? 'calm' : calm >= 75 ? 'stable' : calm >= 55 ? 'ok' : 'nervous'
  const bsBadgeKey = bs <= 5 ? 'clean' : bs <= 15 ? 'ok' : bs <= 30 ? 'some' : 'many'

  const tierLabel = t(`tierLabel.${tier}`)
  const starLabel = (earnedStars ?? 0) > 0 ? t(`starLabel.${earnedStars}`) : tierLabel

  const diagKey = getSessionDiagnosis(stats)

  const starBreakdown = (() => {
    const stars = earnedStars ?? 0
    if (!stars) return null
    const nextThresh = STAR_UP[stars]
    const accV = stats.accuracy
    const calmV = stats.calmScore ?? accV
    const bsV = stats.backspaceCount ?? 0

    const reasonKey = `starBreakdown.reason${stars}` as const
    const reason = t(reasonKey, { acc: accV })

    if (stars === 5) return { reason: t('starBreakdown.reason5'), next: null }
    if (!nextThresh) return null

    const blockers: string[] = []
    if (accV < nextThresh.acc) blockers.push(t('starBreakdown.nextAccuracy', { delta: nextThresh.acc - accV }))
    if (calmV < nextThresh.calm) {
      blockers.push(bsV > 5 ? t('starBreakdown.nextBackspace', { count: bsV }) : t('starBreakdown.nextCalm'))
    }
    const next = blockers.length > 0
      ? t('starBreakdown.next', { stars: stars + 1, blockers: blockers.join(t('starBreakdown.and')) })
      : null

    return { reason, next }
  })()

  const nextGoal = (() => {
    if ((earnedStars ?? 0) > 0) return null
    const accV = stats.accuracy
    const bsV = stats.backspaceCount ?? 0
    const errors = stats.mistakesCount
    const wpm = stats.wpm
    if (accV < 85) return t('nextGoalTexts.accuracy1', { target: Math.min(90, accV + 5) })
    if (accV < 92) return t('nextGoalTexts.accuracy2', { acc: accV, target: Math.min(97, accV + 3) })
    if (bsV > 20) return t('nextGoalTexts.backspace', { count: bsV, target: Math.round(bsV * 0.6) })
    if (errors > 8) return t('nextGoalTexts.errors', { count: errors, target: Math.max(3, errors - 4) })
    const nextMilestone = [25, 30, 35, 40, 50, 60, 70, 80, 100].find(m => m > wpm)
    if (nextMilestone && accV >= 88) return t('nextGoalTexts.wpm', { target: nextMilestone })
    if (accV >= 95 && bsV <= 5) return t('nextGoalTexts.noBackspace')
    return null
  })()

  return (
    <div className="space-y-4">

      {/* ── HERO ── */}
      <div className={`${heroBg} ${heroBorder} border rounded-3xl px-6 py-8`}>

        {(earnedStars ?? 0) > 0 && (
          <div className="flex justify-center gap-1.5 mb-5">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`leading-none transition-transform ${
                  i <= (earnedStars ?? 0)
                    ? 'text-4xl text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                    : 'text-3xl text-gray-200 dark:text-gray-800 opacity-40'
                }`}
              >★</span>
            ))}
          </div>
        )}

        <div className="text-center mb-5">
          <p className={`text-9xl font-black leading-none ${heroText}`}>{stats.wpm}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-medium">
            WPM · {t(`wpmBadge.${wpmBadgeKey}`)}
          </p>
        </div>

        <div className="flex justify-center gap-12 mb-5">
          <div className="text-center">
            <p className={`text-4xl font-bold leading-none ${accColor}`}>{acc}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
              {t('label.accuracy', { badge: t(`accBadge.${accBadgeKey}`) })}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-4xl font-bold leading-none ${calmColor}`}>{calm}</p>
            <p
              className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 cursor-help border-b border-dashed border-gray-300 dark:border-gray-700 inline-block pb-px"
              title={t('label.calmTooltip')}
            >
              {t('label.calm', { badge: t(`calmBadge.${calmBadgeKey}`) })}
            </p>
          </div>
        </div>

        <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${calm >= 80 ? 'bg-teal-400' : calm >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${calm}%` }}
          />
        </div>

        {(earnedStars ?? 0) > 0 && (
          <p className={`text-center text-base font-bold ${heroText} mb-3`}>{starLabel}</p>
        )}

        <p className={`text-sm ${heroText} leading-relaxed text-center bg-black/5 dark:bg-white/5 rounded-2xl px-5 py-3`}>
          {String(tDiagnosis(diagKey.key as any, diagKey.params as any))}
        </p>

        <div className="flex justify-center gap-2 flex-wrap mt-4">
          {typingMode !== 'normal' && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${heroBorder} ${heroText}`}>
              {TYPING_LABEL[typingMode]}
            </span>
          )}
          {lessonId !== undefined && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${heroBorder} ${heroText}`}>
              {t('lesson', { id: String(lessonId).padStart(3, '0'), label: tierLabel })}
            </span>
          )}
          {incomplete && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
              {t('incomplete', { percent: stats.completionPercent })}
            </span>
          )}
        </div>
      </div>

      {/* ── DLACZEGO TAKI WYNIK? ── */}
      {starBreakdown && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">{t('whyScore')}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{starBreakdown.reason}</p>
          {starBreakdown.next && (
            <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)] leading-snug">{starBreakdown.next}</p>
          )}
        </div>
      )}

      {/* ── NEXT LESSON / BACK TO ACADEMY ── */}
      {hasNextLesson && onAction ? (
        <button
          onClick={() => onAction('next_lesson')}
          className="fk-btn w-full py-5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-3 group"
        >
          <span>{t('nextLesson')}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
          <kbd className="text-xs font-normal bg-white/20 px-2.5 py-1 rounded-lg ml-1 opacity-70">Enter</kbd>
        </button>
      ) : onBackToAcademy ? (
        <button
          onClick={onBackToAcademy}
          className="fk-btn w-full py-5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center justify-center gap-3 group"
        >
          <span>{t('backToAcademy')}</span>
          <kbd className="text-xs font-normal bg-white/20 px-2.5 py-1 rounded-lg ml-1 opacity-70">Enter</kbd>
        </button>
      ) : null}

      {/* ── COACH INSIGHT ── */}
      {coachInsight && (
        <div className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border ${
          coachInsight.tone === 'positive'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
            : coachInsight.tone === 'constructive'
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
            : 'bg-gray-50 dark:bg-[#161616] border-gray-200 dark:border-[#242424]'
        }`}>
          <span className="text-base shrink-0 mt-0.5">
            {coachInsight.tone === 'positive' ? '✦' : coachInsight.tone === 'constructive' ? '◈' : '◇'}
          </span>
          <p className={`text-sm leading-relaxed ${
            coachInsight.tone === 'positive'
              ? 'text-emerald-800 dark:text-emerald-300'
              : coachInsight.tone === 'constructive'
              ? 'text-amber-800 dark:text-amber-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}>{String(tCoach(coachInsight.key as any, coachInsight.params as any))}</p>
        </div>
      )}

      {/* ── NEXT GOAL ── */}
      {nextGoal && (
        <div className="flex items-center gap-3 bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/8 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 rounded-2xl px-4 py-3.5">
          <span className="text-base shrink-0 text-[var(--accent-500)] dark:text-[var(--accent-400)]">◎</span>
          <div>
            <p className="text-[10px] font-bold text-[var(--accent-600)] dark:text-[var(--accent-400)] uppercase tracking-widest mb-0.5">{t('nextGoal')}</p>
            <p className="text-sm text-[var(--accent-800)] dark:text-[var(--accent-200)] leading-snug">{nextGoal}</p>
          </div>
        </div>
      )}

      {/* ── SECONDARY STATS ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${bs <= 10 ? 'bg-green-400' : bs <= 30 ? 'bg-amber-400' : 'bg-red-400'}`} />
          <p className="text-xl mt-1 mb-1">⌫</p>
          <p className={`text-2xl font-black leading-none ${bsColor}`}>{bs}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">{t('label.backspace')}</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">{t(`bsBadge.${bsBadgeKey}`)}</p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${streak >= 20 ? 'bg-green-400' : streak >= 10 ? 'bg-amber-400' : 'bg-gray-300 dark:bg-[#333]'}`} />
          <p className="text-xl mt-1 mb-1">🔥</p>
          <p className="text-2xl font-black leading-none text-gray-700 dark:text-gray-300">{streak}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">{t('label.bestStreak')}</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
            {t(`streakQuality.${streak >= 20 ? 'great' : streak >= 10 ? 'good' : 'practice'}`)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-3 py-4 text-center relative overflow-hidden">
          <div className={`absolute top-0 inset-x-0 h-1 ${stats.mistakesCount === 0 ? 'bg-green-400' : stats.mistakesCount <= 3 ? 'bg-amber-400' : 'bg-red-400'}`} />
          <p className="text-xl mt-1 mb-1">{stats.mistakesCount === 0 ? '✓' : '✕'}</p>
          <p className={`text-2xl font-black leading-none ${stats.mistakesCount === 0 ? 'text-green-600 dark:text-green-400' : stats.mistakesCount <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
            {stats.mistakesCount}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1.5 font-medium">{t('label.errors')}</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
            {t(`errorsQuality.${stats.mistakesCount === 0 ? 'clean' : stats.mistakesCount <= 3 ? 'few' : 'practice'}`)}
          </p>
        </div>
      </div>

      {/* ── TEXT DIFF ── */}
      {trainingText && typedText && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#1e1e1e]">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
              {t('textWithErrors')}
            </p>
            {(replayData?.length ?? 0) > 0 && (
              <button
                onClick={() => setReplayOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors"
              >
                <span>▶</span> {t('playback')}
              </button>
            )}
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-8 font-mono break-words whitespace-pre-wrap select-none">
              {trainingText.split('').map((ch, i) => {
                const typed = typedText[i]
                if (typed === undefined) {
                  return <span key={i} className="text-gray-300 dark:text-gray-700">{ch === ' ' ? ' ' : ch}</span>
                }
                if (typed === ch) {
                  return <span key={i} className="text-gray-600 dark:text-gray-400">{ch === ' ' ? ' ' : ch}</span>
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
        const older = [...prevSessions].reverse()
        const wpmPts = [...older.map(s => ({ wpm: s.stats.wpm })), { wpm: stats.wpm, current: true }]
        const accPts = [...older.map(s => ({ acc: s.stats.accuracy })), { acc: stats.accuracy, current: true }]
        const total = prevSessions.length + 1
        return (
          <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#1e1e1e]">
              {t('progress.title', { count: total, label: t('progress.attempt', { count: total }) })}
            </p>

            <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-[#1e1e1e]">
              <div className="bg-white dark:bg-[#161616] px-4 pt-3 pb-2">
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">{t('charts.speed')}</p>
                <WpmBarChart points={wpmPts} />
              </div>
              <div className="bg-white dark:bg-[#161616] px-4 pt-3 pb-2">
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">{t('charts.accuracy')}</p>
                <AccLineChart points={accPts} />
              </div>
            </div>

            <div>
              <div className="grid grid-cols-[1fr_44px_52px_52px_32px] gap-2 px-5 py-2 border-t border-gray-100 dark:border-[#1e1e1e]">
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{t('table.when')}</span>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-right">{t('table.wpm')}</span>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-right">{t('table.acc')}</span>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-right">{t('table.calm')}</span>
                <span />
              </div>
              <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
                {prevSessions.slice(0, 10).map(s => {
                  const sCalm = s.stats.calmScore ?? s.stats.accuracy
                  return (
                    <div key={s.id} className="grid grid-cols-[1fr_44px_52px_52px_32px] gap-2 items-center px-5 py-2.5">
                      <span className="text-xs text-gray-500 dark:text-gray-500 truncate">{relDate(s.createdAt, locale)}</span>
                      <span className="text-sm font-bold text-[var(--accent-500)] tabular-nums text-right">{s.stats.wpm}</span>
                      <span className={`text-sm font-semibold tabular-nums text-right ${s.stats.accuracy >= 95 ? 'text-green-600 dark:text-green-400' : s.stats.accuracy >= 80 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>{s.stats.accuracy}%</span>
                      <span className={`text-sm font-semibold tabular-nums text-right ${sCalm >= 80 ? 'text-teal-600 dark:text-teal-400' : sCalm >= 60 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>{sCalm}</span>
                      <div className="flex justify-end">
                        {s.replayData?.length ? (
                          <button onClick={() => setHistoryReplay(s)}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--accent-500)] hover:bg-[var(--accent-500)]/10 transition-colors text-xs">
                            ▶
                          </button>
                        ) : (
                          <span className="w-6 h-6 flex items-center justify-center text-[10px] text-gray-300 dark:text-gray-700">—</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── BADGE ── */}
      {(newBadges?.length ?? 0) > 0 && (() => {
        const first = newBadges![0]
        const extra = (newBadges?.length ?? 0) - 1
        return (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">{first.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{t('newBadge', { title: first.title })}</p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">{first.description}</p>
            </div>
            {extra > 0 && (
              <button
                onClick={() => router.push('/badges')}
                className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-500/30 transition"
              >
                {t('moreBadges', { count: extra })}
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
              {t('commonMistakes')}
            </p>
            <p className="text-[9px] text-gray-400 dark:text-gray-600">
              <span className="text-red-400 dark:text-red-500">{t('target')}</span> → {t('mistype')}
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
                    <span className="text-[8px] text-gray-400 dark:text-gray-600 mt-0.5 leading-none">{t('target')}</span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-600 text-xs shrink-0">→</span>
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#1e1e1e] min-w-[28px] text-center">
                      {m.actual === ' ' ? '␣' : m.actual}
                    </span>
                    <span className="text-[8px] text-gray-400 dark:text-gray-600 mt-0.5 leading-none">{t('mistype')}</span>
                  </div>
                  {isPolish && <span className="text-[9px] bg-orange-100 dark:bg-orange-500/15 text-orange-500 dark:text-orange-400 px-1.5 py-0.5 rounded shrink-0">{t('polish')}</span>}
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
          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">{t('fingerErrors')}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(fingerErrors).sort((a, b) => b[1] - a[1]).map(([f, c]) => (
              <span key={f} className={`text-xs px-3 py-1.5 rounded-xl font-medium ${FINGER_COLORS[f] ?? ''}`}>
                {FINGER_LABELS[f] ?? f} · {c}×
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── LIBRARY CONTEXT ── */}
      {libraryEntry && (
        <div className="bg-[var(--accent-50)] dark:bg-[var(--accent-500)]/8 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--accent-100)] dark:border-[var(--accent-500)]/15 flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--accent-600)] dark:text-[var(--accent-400)] uppercase tracking-widest">{t('thisText')}</p>
            <p className="text-xs text-[var(--accent-500)]/70 dark:text-[var(--accent-400)]/60 truncate max-w-[60%] text-right">{libraryEntry.title}</p>
          </div>
          <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-[var(--accent-100)] dark:border-[var(--accent-500)]/15">
            <div className="text-center">
              <p className="text-2xl font-black text-[var(--accent-600)] dark:text-[var(--accent-400)]">{libraryEntry.practiceCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                {t('round', { count: libraryEntry.practiceCount })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{libraryEntry.bestWpm ?? '—'}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">{t('wpmBest')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-600 dark:text-green-400">
                {libraryEntry.bestAccuracy != null ? `${libraryEntry.bestAccuracy}%` : '—'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">{t('accBest')}</p>
            </div>
          </div>
          <div className="px-5 py-3 flex gap-2 flex-wrap">
            {hasNextChunk && onNextChunk ? (
              <button
                onClick={onNextChunk}
                className="flex-1 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-xs font-bold rounded-xl transition"
              >
                {t('nextFragment')}
              </button>
            ) : (
              <button
                onClick={onRepeat}
                className="flex-1 py-2.5 bg-[var(--accent-100)] dark:bg-[var(--accent-500)]/15 hover:bg-[var(--accent-200)] dark:hover:bg-[var(--accent-500)]/25 text-[var(--accent-600)] dark:text-[var(--accent-400)] text-xs font-bold rounded-xl transition"
              >
                {t('repeatText')}
              </button>
            )}
            <button
              onClick={() => router.push('/library')}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-xl transition"
            >
              {t('backToLibrary')}
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
                <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">{t('savedToLibrary')}</p>
                <button onClick={() => router.push('/library')} className="text-xs text-[var(--accent-500)] hover:text-[var(--accent-600)] dark:hover:text-[var(--accent-400)] underline mt-0.5 transition">
                  {t('goToLibrary')}
                </button>
              </div>
            </div>
          ) : !saveExpanded ? (
            <button onClick={() => setSaveExpanded(true)} className="w-full flex items-center gap-3 text-left group">
              <span className="text-xl shrink-0">📚</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">{t('saveToLibrary')}</p>
                <p className="text-xs text-[var(--accent-500)]/70 dark:text-[var(--accent-400)]/60 mt-0.5">{t('saveToLibraryDesc')}</p>
              </div>
              <span className="text-[var(--accent-400)] shrink-0 group-hover:translate-x-0.5 transition-transform">›</span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)]">{t('titleText')}</p>
              <input
                type="text"
                value={saveTitle}
                onChange={e => setSaveTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && saveTitle.trim()) { onSaveToLibrary(saveTitle.trim()); setSavedToLib(true) }
                  if (e.key === 'Escape') setSaveExpanded(false)
                }}
                placeholder={t('titlePlaceholder')}
                autoFocus
                className="w-full bg-white dark:bg-[#161616] border border-[var(--accent-200)] dark:border-[var(--accent-500)]/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-400)] transition"
              />
              <div className="flex gap-2">
                <button onClick={() => setSaveExpanded(false)} className="px-4 py-2 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">
                  {t('cancel')}
                </button>
                <button
                  onClick={() => { if (saveTitle.trim()) { onSaveToLibrary(saveTitle.trim()); setSavedToLib(true) } }}
                  disabled={!saveTitle.trim()}
                  className="flex-1 py-2 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-xs font-bold rounded-xl transition disabled:opacity-40"
                >
                  {t('save')}
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
          {t('repeat')}
        </button>
        <button
          onClick={onNewRound}
          className="fk-btn flex-1 py-3.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          <span>✦</span>
          {t('newRound')}
        </button>
      </div>

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

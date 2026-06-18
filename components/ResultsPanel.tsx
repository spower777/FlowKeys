'use client'

import { useState } from 'react'
import type { TypingStats, TypingMode, TransformMode } from '@/lib/types'
import { align } from '@/lib/analyzeTyping'
import { FINGER_LABELS, FINGER_COLORS } from '@/lib/fingerMap'

const MODE_LABEL: Record<TransformMode, string> = {
  '1to1': 'Bez zmian', clean: 'Oczyść', story: 'Opowieść', exercise: 'Ćwiczenie', polish_chars: 'Trudne znaki',
}
const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

// ── Tier ─────────────────────────────────────────────────────────────────────

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
const BLIND_STYLE = { bg: 'bg-purple-50 dark:bg-purple-500/8', border: 'border-purple-200 dark:border-purple-500/20', text: 'text-purple-700 dark:text-purple-300' }

// ── Label helpers ─────────────────────────────────────────────────────────────

function wpmBadge(v: number) { return v >= 60 ? 'ekspres' : v >= 40 ? 'sprawnie' : v >= 25 ? 'dobrze' : 'spokojne tempo' }
function accBadge(v: number) { return v >= 97 ? 'perfekcja' : v >= 95 ? 'bardzo dobrze' : v >= 88 ? 'dobrze' : v >= 80 ? 'solidnie' : 'warto zwolnić' }
function calmBadge(v: number) { return v >= 90 ? 'spokojnie' : v >= 75 ? 'stabilnie' : v >= 55 ? 'ok' : 'nerwowo' }
function bsBadge(v: number) { return v <= 5 ? 'czysto' : v <= 15 ? 'ok' : v <= 30 ? 'sporo' : 'dużo poprawek' }

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

type SuggestionAction = 'blind' | 'no_backspace' | 'next_lesson'
interface Suggestion { text: string; action?: SuggestionAction }

function getNextSuggestions(stats: TypingStats, typingMode: TypingMode): Suggestion[] {
  const bs = stats.backspaceCount ?? 0
  const sugg: Suggestion[] = []
  if (stats.polishCharsMissed >= 2) sugg.push({ text: 'Ćwicz polskie znaki — ą ę ć ł ń ó ś ź ż' })
  if (bs > 20 && typingMode !== 'no_backspace') sugg.push({ text: 'Spróbuj No Backspace — jeden raz bez poprawek', action: 'no_backspace' })
  if (typingMode === 'normal' && stats.accuracy >= 90) sugg.push({ text: 'Wypróbuj Blind Flow — pisz z pamięci', action: 'blind' })
  if (stats.accuracy < 80) sugg.push({ text: 'Zwolnij — celność ważniejsza niż szybkość' })
  if (stats.completionPercent < 80) sugg.push({ text: 'Powtórz ten fragment — tym razem dotrzyj do końca' })
  return sugg.slice(0, 2)
}

// ── Polish char detection ─────────────────────────────────────────────────────

const POLISH_STRIPPED: Record<string, string> = {
  'ą': 'a', 'ę': 'e', 'ć': 'c', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
  'Ą': 'A', 'Ę': 'E', 'Ć': 'C', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
}

function isPolishDiacriticLoss(expected: string, actual: string): boolean {
  return !!(expected && actual && POLISH_STRIPPED[expected]?.toLowerCase() === actual.toLowerCase())
}

// ── Components ────────────────────────────────────────────────────────────────

interface StatCardProps { value: string | number; label: string; desc: string; badge?: string; color: string }
function StatCard({ value, label, desc, badge, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center flex flex-col items-center">
      <p className={`text-3xl font-black leading-none ${color}`}>{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">{label}</p>
      {badge && <span className="mt-1.5 text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#2e2e2e] text-gray-500 dark:text-gray-500">{badge}</span>}
      <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1 leading-tight">{desc}</p>
    </div>
  )
}

function DiffView({ trainingText, typedText }: { trainingText: string; typedText: string }) {
  const ops = align(trainingText, typedText)
  const highDivergence = trainingText.length > 0 &&
    ops.filter(o => o.op !== 'match').length / Math.min(trainingText.length, typedText.length || 1) > 0.6

  return (
    <div className="space-y-3">
      {highDivergence && (
        <p className="text-xs text-gray-400 italic">Tekst mocno różni się od źródła — analiza ma ograniczoną wartość diagnostyczną.</p>
      )}
      <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Różnice znak po znaku</p>
        <p className="text-sm leading-8 font-mono break-words whitespace-pre-wrap">
          {ops.map((op, i) => {
            if (op.op === 'match') return <span key={i} className="text-gray-500 dark:text-gray-500">{op.ch}</span>
            if (op.op === 'sub') {
              const isPolish = op.expected && op.actual ? isPolishDiacriticLoss(op.expected, op.actual) : false
              return (
                <span
                  key={i}
                  className={`px-0.5 py-0.5 rounded font-bold ${
                    isPolish
                      ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-500/20'
                      : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/20'
                  }`}
                  title={isPolish ? `zgubiony ogonek: wpisano „${op.actual}"` : `zamiana: wpisano „${op.actual}"`}
                >
                  {op.expected}
                </span>
              )
            }
            if (op.op === 'del') return (
              <span key={i} className="text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-0.5 rounded" title="pominięto">
                {op.expected}
              </span>
            )
            return (
              <span key={i} className="text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 px-0.5 rounded" title="dodatkowy znak">
                {op.actual}
              </span>
            )
          })}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
        <span><span className="text-gray-400">■</span> poprawnie</span>
        <span><span className="text-red-500">■</span> zamiana</span>
        <span><span className="text-orange-500">■</span> zgubiony ogonek</span>
        <span><span className="text-amber-500">■</span> pominięcie</span>
        <span><span className="text-blue-500">■</span> dodatkowy znak</span>
      </div>
    </div>
  )
}

interface ComparisonProps {
  trainingText: string
  typedText: string
  incomplete: boolean
  charsTyped: number
  isBlind: boolean
}
function ComparisonSection({ trainingText, typedText, incomplete, charsTyped, isBlind }: ComparisonProps) {
  const [diffOpen, setDiffOpen] = useState(isBlind || incomplete)
  const relevantSource = incomplete ? trainingText.slice(0, charsTyped + 40) : trainingText

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest">Porównaj teksty</p>
      {incomplete && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Porównanie dotyczy pierwszych {charsTyped} wpisanych znaków.</p>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">A · Tekst źródłowy</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono break-words">{relevantSource}</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">B · Twoja wersja</p>
          {typedText
            ? <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono break-words">{typedText}</p>
            : <p className="text-xs text-gray-400 italic">Nic nie wpisano.</p>}
        </div>
      </div>

      <button
        onClick={() => setDiffOpen(v => !v)}
        className="flex items-center gap-2 w-full text-left px-4 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] border border-gray-200 dark:border-[#2a2a2a] rounded-xl text-xs text-gray-600 dark:text-gray-400 transition"
      >
        <span className={`transition-transform duration-150 ${diffOpen ? 'rotate-90' : ''}`}>›</span>
        C · Różnice (kolorowa analiza)
        <span className="ml-auto">{diffOpen ? 'zwiń' : 'rozwiń'}</span>
      </button>

      {diffOpen && <DiffView trainingText={relevantSource} typedText={typedText} />}
    </div>
  )
}

// ── Badge summary type (passed from page.tsx) ─────────────────────────────────

export interface BadgeSummary { icon: string; title: string; description: string }

// ── Main ──────────────────────────────────────────────────────────────────────

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
  onNewRound: () => void
  onRepeat: () => void
  onAction?: (action: SuggestionAction) => void
}

export default function ResultsPanel({
  stats, trainingText, typedText, transformMode, typingMode,
  newBadges, earnedStars, lessonId, hasNextLesson,
  onNewRound, onRepeat, onAction,
}: Props) {
  const acc = stats.accuracy
  const calm = stats.calmScore ?? acc
  const bs = stats.backspaceCount ?? 0
  const streak = stats.bestStreak ?? 0
  const incomplete = stats.completionPercent < 90
  const isBlind = typingMode === 'blind'
  const tier = getTier(acc, calm)

  const hero = isBlind
    ? { ...BLIND_STYLE, label: 'Blind Flow' }
    : { ...TIER_STYLE[tier], label: TIER_STYLE[tier].label }

  const accColor = acc >= 95 ? 'text-green-600 dark:text-green-400' : acc >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
  const calmColor = calm >= 80 ? 'text-teal-600 dark:text-teal-400' : calm >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
  const bsColor = bs > 40 ? 'text-red-500 dark:text-red-400' : bs > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'
  const fingerErrors = stats.errorsByFinger ?? {}
  const hasFingerErrors = Object.keys(fingerErrors).length > 0
  const suggestions = getNextSuggestions(stats, typingMode)
  const showBadgeSection = (earnedStars ?? 0) > 0 || (newBadges?.length ?? 0) > 0

  return (
    <div className="space-y-5">

      {/* ── HERO BANNER ── */}
      <div className={`${hero.bg} ${hero.border} border rounded-3xl px-6 py-4`}>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${hero.border} ${hero.text}`}>
            {TYPING_LABEL[typingMode]}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${hero.border} ${hero.text}`}>
            {lessonId !== undefined && transformMode === '1to1'
              ? `Lekcja ${String(lessonId).padStart(3, '0')}`
              : MODE_LABEL[transformMode]}
          </span>
          {incomplete && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
              Niedokończone
            </span>
          )}
          <span className={`ml-auto text-xs font-bold tracking-wide ${hero.text}`}>{hero.label}</span>
        </div>

        <div className="flex items-end gap-6 mb-3">
          <div>
            <p className={`text-5xl font-black leading-none ${hero.text}`}>{stats.wpm}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">WPM · {wpmBadge(stats.wpm)}</p>
          </div>
          <div>
            <p className={`text-3xl font-bold leading-none ${accColor}`}>{acc}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">dokładność</p>
          </div>
          <div className="ml-auto text-right">
            <p className={`text-2xl font-bold leading-none ${calmColor}`}>{calm}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">indeks spokoju</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${calm >= 80 ? 'bg-teal-400' : calm >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
              style={{ width: `${calm}%` }}
            />
          </div>
        </div>

        <p className={`text-sm ${hero.text} bg-black/5 dark:bg-white/5 rounded-xl px-4 py-2.5 leading-relaxed`}>
          {getDiagnosis(stats)}
        </p>
      </div>

      {/* ── STARS & BADGES ── */}
      {showBadgeSection && (
        <div className="space-y-3">
          {(earnedStars ?? 0) > 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/25 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3].map(i => (
                  <span key={i} className={`text-2xl leading-none ${i <= (earnedStars ?? 0) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-800'}`}>★</span>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {earnedStars === 3 ? 'Lekcja opanowana!' : earnedStars === 2 ? 'Świetny wynik!' : 'Lekcja zaliczona!'}
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
                  {earnedStars === 3 ? 'acc ≥ 98% + spokój ≥ 90 — idealne opanowanie' : earnedStars === 2 ? 'acc ≥ 94% + spokój ≥ 80 — bardzo dobrze' : 'acc ≥ 85% — dobry start, wróć po więcej gwiazdek'}
                </p>
              </div>
            </div>
          )}
          {newBadges?.map((b, i) => (
            <div key={i} className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl px-5 py-3.5 flex items-center gap-3">
              <span className="text-2xl shrink-0">{b.icon}</span>
              <div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">🏅 Nowa odznaka: {b.title}</p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value={stats.wpm} label="WPM" desc="słów na minutę" badge={wpmBadge(stats.wpm)} color="text-blue-600 dark:text-blue-400" />
        <StatCard value={`${acc}%`} label="Dokładność" desc="poprawnych znaków" badge={accBadge(acc)} color={accColor} />
        <StatCard
          value={`${stats.completionPercent}%`}
          label="Ukończenie"
          desc="tekstu przepisano"
          badge={incomplete ? 'fragment' : 'pełny tekst'}
          color={incomplete ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}
        />
        <StatCard
          value={stats.mistakesCount}
          label="Błędy"
          desc="zamian i wstawień"
          badge={stats.mistakesCount === 0 ? 'idealnie' : stats.mistakesCount <= 3 ? 'świetnie' : undefined}
          color={stats.mistakesCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={calm} label="Indeks spokoju" desc="dokładność – Backspace" badge={calmBadge(calm)} color={calmColor} />
        <StatCard value={bs} label="Backspace" desc="cofnięć podczas rundy" badge={bsBadge(bs)} color={bsColor} />
        <StatCard
          value={streak}
          label="Najlepsza seria"
          desc="znaków bez błędu"
          badge={streak >= 20 ? 'świetna' : streak >= 10 ? 'dobra' : undefined}
          color="text-gray-700 dark:text-gray-300"
        />
      </div>

      {/* ── FINGER ERRORS + MISTAKES ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {hasFingerErrors && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Błędy wg palca</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(fingerErrors).sort((a, b) => b[1] - a[1]).map(([f, c]) => (
                  <span key={f} className={`text-xs px-3 py-1.5 rounded-xl font-medium ${FINGER_COLORS[f] ?? ''}`}>
                    {FINGER_LABELS[f] ?? f} · {c}×
                  </span>
                ))}
              </div>
            </div>
          )}

          {stats.commonMistakes.length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#242424]">Najczęstsze błędy</p>
              <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
                {stats.commonMistakes.slice(0, 5).map((m, i) => {
                  const isPolish = isPolishDiacriticLoss(m.expected, m.actual)
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-2">
                      <span className={`font-mono text-sm w-6 text-center shrink-0 ${isPolish ? 'text-orange-600 dark:text-orange-400' : 'text-red-500 dark:text-red-400'}`}>
                        {m.expected === ' ' ? '␣' : m.expected}
                      </span>
                      <span className="text-gray-400 text-xs">→</span>
                      <span className="font-mono text-sm text-gray-600 dark:text-gray-400 w-6 text-center shrink-0">
                        {m.actual === ' ' ? '␣' : m.actual}
                      </span>
                      {isPolish && <span className="text-[9px] text-orange-500 dark:text-orange-400 shrink-0">ogonek</span>}
                      {m.count > 1 ? (
                        <div className="flex-1 h-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div
                            className={`h-1 ${isPolish ? 'bg-orange-300 dark:bg-orange-700' : 'bg-red-300 dark:bg-red-700'} rounded-full`}
                            style={{ width: `${Math.min(100, (m.count / (stats.commonMistakes[0]?.count || 1)) * 100)}%` }}
                          />
                        </div>
                      ) : <span className="flex-1" />}
                      <span className="text-xs text-gray-400 dark:text-gray-600 shrink-0">{m.count}×</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {stats.polishCharsMissed > 0 && (() => {
            const POLISH = new Set('ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')
            const missedChars = [...new Set(
              stats.commonMistakes.filter(m => POLISH.has(m.expected)).map(m => m.expected)
            )].slice(0, 6)
            return (
              <div className="bg-orange-50 dark:bg-orange-500/8 border border-orange-200 dark:border-orange-500/20 rounded-2xl px-5 py-4">
                <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                  {stats.polishCharsMissed === 1 ? '1 błąd' : `${stats.polishCharsMissed} błędy`} w polskich znakach
                </p>
                {missedChars.length > 0 && (
                  <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1 font-mono tracking-wider">
                    {missedChars.join(', ')}
                  </p>
                )}
              </div>
            )
          })()}

          {stats.difficultWords.length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Trudne słowa</p>
              <div className="flex flex-wrap gap-2">
                {stats.difficultWords.map((w, i) => (
                  <span key={i} className="font-mono text-sm bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] text-red-600 dark:text-red-300/80 px-3 py-1 rounded-lg">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── COMPARISON ── */}
      <ComparisonSection
        trainingText={trainingText}
        typedText={typedText}
        incomplete={incomplete}
        charsTyped={stats.charsTyped}
        isBlind={isBlind}
      />

      {/* ── NEXT STEP ── */}
      {(suggestions.length > 0 || hasNextLesson) && (
        <div className="bg-[var(--accent-50)] dark:bg-[var(--accent-600)]/8 border border-[var(--accent-200)] dark:border-[var(--accent-500)]/20 rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-[var(--accent-600)] dark:text-[var(--accent-400)] uppercase tracking-widest mb-3">
            Następna zalecana runda
          </p>
          <div className="space-y-2.5">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="shrink-0 text-[var(--accent-500)] font-bold">→</span>
                <span className="flex-1 text-sm text-[var(--accent-700)] dark:text-[var(--accent-300)]">{s.text}</span>
                {s.action && onAction && (
                  <button
                    onClick={() => onAction(s.action!)}
                    className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white rounded-lg transition font-medium"
                  >
                    Zacznij
                  </button>
                )}
              </div>
            ))}
            {hasNextLesson && onAction && (
              <div className="flex items-center gap-3 pt-1 border-t border-[var(--accent-200)] dark:border-[var(--accent-500)]/15">
                <span className="shrink-0 text-[var(--accent-500)] font-bold">→</span>
                <span className="flex-1 text-sm text-[var(--accent-700)] dark:text-[var(--accent-300)]">Przejdź do następnej lekcji</span>
                <button
                  onClick={() => onAction('next_lesson')}
                  className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white rounded-lg transition font-semibold"
                >
                  Następna →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ACTIONS ── */}
      <div className="flex gap-3">
        <button
          onClick={onRepeat}
          className="flex-1 py-3 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
        >
          {isBlind && incomplete ? 'Spróbuj jeszcze raz' : 'Powtórz tekst'}
        </button>
        <button
          onClick={onNewRound}
          className="flex-1 py-3 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white text-sm font-semibold rounded-xl transition"
        >
          Nowa runda
        </button>
      </div>
    </div>
  )
}

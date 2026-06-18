'use client'

import { useState, useEffect } from 'react'
import { getSessions } from '@/lib/storage'
import type { TypingSessionRecord, TransformMode, TypingMode } from '@/lib/types'
import { FINGER_LABELS, FINGER_COLORS } from '@/lib/fingerMap'
import ReplayModal from './ReplayModal'

const MODE_LABEL: Record<TransformMode, string> = {
  '1to1': '1:1', clean: 'Oczyść', story: 'Opowieść', exercise: 'Ćwiczenie', polish_chars: 'Trudne znaki',
}
const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}
type FilterValue = TypingMode | 'all' | 'lessons'
const TYPING_FILTERS: Array<{ label: string; value: FilterValue }> = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Lekcje', value: 'lessons' },
  { label: 'Normal', value: 'normal' },
  { label: 'Blind Flow', value: 'blind' },
  { label: 'No Backspace', value: 'no_backspace' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function accColor(acc: number) {
  return acc >= 95 ? 'text-green-600 dark:text-green-400' : acc >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
}
function calmColor(c: number) {
  return c >= 80 ? 'text-teal-600 dark:text-teal-400' : c >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
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
  const [sessions, setSessions] = useState<TypingSessionRecord[]>([])
  const [selected, setSelected] = useState<TypingSessionRecord | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sortBest, setSortBest] = useState(false)
  const [replaySession, setReplaySession] = useState<TypingSessionRecord | null>(null)

  useEffect(() => { setSessions(getSessions()) }, [])

  const base = filter === 'all' ? sessions
    : filter === 'lessons' ? sessions.filter(s => s.lessonId !== undefined)
    : sessions.filter(s => s.typingMode === filter)
  const filtered = sortBest ? [...base].sort((a, b) => b.stats.wpm - a.stats.wpm) : base

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">⌨️</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Brak sesji</p>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Wróć na stronę główną i zacznij pierwszą rundę.</p>
      </div>
    )
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    const st = selected.stats
    const incomplete = st.completionPercent < 90
    const hasReplay = !!selected.replayData?.length
    const fingerErrors = st.errorsByFinger ?? {}

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
              ← Wróć do historii
            </button>
            {hasReplay && (
              <button
                onClick={() => setReplaySession(selected)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white text-sm font-medium rounded-xl transition"
              >
                ▶ Odtwórz rundę
              </button>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              {fmtDate(selected.createdAt)} · {MODE_LABEL[selected.mode]} · {TYPING_LABEL[selected.typingMode]}
            </p>
            {incomplete && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Runda niedokończona — metryki dotyczą {st.charsTyped} wpisanych znaków
              </p>
            )}
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value={st.wpm} label="WPM" desc="Słowa na minutę" color="text-blue-600 dark:text-blue-400" />
            <StatCard value={`${st.accuracy}%`} label="Dokładność" desc="Poprawnych znaków" color={accColor(st.accuracy)} />
            <StatCard value={`${st.completionPercent}%`} label="Ukończenie" color={incomplete ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'} />
            <StatCard value={st.mistakesCount} label="Błędy" color={st.mistakesCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'} />
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={st.calmScore ?? st.accuracy} label="Indeks spokoju" desc="Dokładność – Backspace" color={calmColor(st.calmScore ?? st.accuracy)} />
            <StatCard value={st.backspaceCount ?? 0} label="Backspace" desc="Cofnięć" color="text-gray-700 dark:text-gray-300" />
            <StatCard value={st.bestStreak ?? 0} label="Najlepsza seria" desc="Znaków bez błędu" color="text-gray-700 dark:text-gray-300" />
          </div>

          {/* Finger errors */}
          {Object.keys(fingerErrors).length > 0 && (
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

          {/* Common mistakes */}
          {st.commonMistakes.length > 0 && (
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#242424]">Najczęstsze błędy</p>
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
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Tekst treningowy</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{selected.trainingText}</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Twój tekst</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{selected.typedText}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Filters + sort */}
      <div className="flex gap-2 flex-wrap items-center">
        {TYPING_FILTERS.map(f => {
          const count = f.value === 'all' ? null
            : f.value === 'lessons' ? sessions.filter(s => s.lessonId !== undefined).length
            : sessions.filter(s => s.typingMode === f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f.value
                  ? 'bg-[var(--accent-500)] text-white'
                  : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-[#2a2a2a]'
              }`}
            >
              {f.label}
              {count !== null && <span className="ml-1 opacity-60">{count}</span>}
            </button>
          )
        })}
        <button
          onClick={() => setSortBest(v => !v)}
          className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition border ${
            sortBest
              ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/25'
              : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'
          }`}
        >
          {sortBest ? '↓ Najlepsze' : '↓ Ostatnie'}
        </button>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Brak sesji dla tego filtra.</p>
      )}

      <div className="space-y-2">
        {filtered.map(s => {
          const calm = s.stats.calmScore ?? s.stats.accuracy
          const bs = s.stats.backspaceCount ?? 0
          const hasReplay = !!s.replayData?.length

          return (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="w-full flex items-center gap-4 bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 text-left transition group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">{s.trainingText.slice(0, 55)}…</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400 dark:text-gray-600">{fmtDate(s.createdAt)}</span>
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
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{s.stats.wpm}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">wpm</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${accColor(s.stats.accuracy)}`}>{s.stats.accuracy}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">acc</p>
                </div>
                <div>
                  <p className={`text-sm font-bold ${calmColor(calm)}`}>{calm}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">spokój</p>
                </div>
                <div>
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

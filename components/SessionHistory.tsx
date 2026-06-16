'use client'

import { useState, useEffect } from 'react'
import { getSessions } from '@/lib/storage'
import type { TypingSessionRecord, TransformMode, TypingMode } from '@/lib/types'

const MODE_LABEL: Record<TransformMode, string> = {
  '1to1': '1:1', clean: 'Oczyść', story: 'Opowieść', exercise: 'Ćwiczenie', polish_chars: 'Trudne znaki',
}
const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function SessionHistory() {
  const [sessions, setSessions] = useState<TypingSessionRecord[]>([])
  const [selected, setSelected] = useState<TypingSessionRecord | null>(null)

  useEffect(() => {
    setSessions(getSessions())
  }, [])

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">⌨️</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Brak sesji</p>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Wróć na stronę główną i zacznij pierwszą rundę.</p>
      </div>
    )
  }

  if (selected) {
    const acc = selected.stats.accuracy
    const accColor = acc >= 95
      ? 'text-green-600 dark:text-green-400'
      : acc >= 80
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-500 dark:text-red-400'

    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition flex items-center gap-1">
          ← Wróć do historii
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-600">
          {fmtDate(selected.createdAt)} · {MODE_LABEL[selected.mode]} · {TYPING_LABEL[selected.typingMode]}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'WPM', value: selected.stats.wpm, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Dokładność', value: `${selected.stats.accuracy}%`, color: accColor },
            { label: 'Ukończenie', value: `${selected.stats.completionPercent ?? 100}%`, color: 'text-gray-700 dark:text-gray-300' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Mode badges */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
            {MODE_LABEL[selected.mode]}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
            {TYPING_LABEL[selected.typingMode]}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
            {selected.stats.mistakesCount} błędów
          </span>
        </div>
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
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map(s => {
        const acc = s.stats.accuracy
        const accColor = acc >= 95
          ? 'text-green-600 dark:text-green-400'
          : acc >= 80
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-red-500 dark:text-red-400'
        return (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className="w-full flex items-center gap-4 bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-4 text-left transition group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">{s.trainingText.slice(0, 60)}…</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-400 dark:text-gray-600">{fmtDate(s.createdAt)}</span>
                <span className="text-[10px] bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                  {MODE_LABEL[s.mode]}
                </span>
                <span className="text-[10px] bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                  {TYPING_LABEL[s.typingMode]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-right">
              <div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{s.stats.wpm}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600">wpm</p>
              </div>
              <div>
                <p className={`text-sm font-bold ${accColor}`}>{s.stats.accuracy}%</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600">acc</p>
              </div>
              <span className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition">›</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

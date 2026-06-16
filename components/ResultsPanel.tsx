'use client'

import type { TypingStats, TypingMode, TransformMode } from '@/lib/types'

const MODE_LABEL: Record<TransformMode, string> = {
  '1to1': '1:1', clean: 'Oczyść', story: 'Opowieść', exercise: 'Ćwiczenie', polish_chars: 'Trudne znaki',
}
const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

interface Props {
  stats: TypingStats
  trainingText: string
  typedText: string
  transformMode: TransformMode
  typingMode: TypingMode
  onNewRound: () => void
}

export default function ResultsPanel({ stats, trainingText, typedText, transformMode, typingMode, onNewRound }: Props) {
  const accuracyColor = stats.accuracy >= 95 ? 'text-green-400' : stats.accuracy >= 80 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="space-y-6">
      {/* Tagline */}
      <p className="text-center text-gray-500 text-sm italic">To była runda. Nie wyrok.</p>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'WPM', value: stats.wpm, color: 'text-blue-400' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, color: accuracyColor },
          { label: 'Słowa', value: stats.wordsTyped, color: 'text-gray-300' },
          { label: 'Błędy', value: stats.mistakesCount, color: stats.mistakesCount > 0 ? 'text-red-400' : 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {MODE_LABEL[transformMode]}
        </span>
        <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {TYPING_LABEL[typingMode]}
        </span>
        <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {stats.charsTyped} znaków
        </span>
      </div>

      {/* Polish chars warning */}
      {stats.polishCharsMissed > 0 && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-400 font-medium">Gubisz polskie znaki</p>
          <p className="text-xs text-amber-500/70 mt-0.5">{stats.polishCharsMissed} × ą ć ę ł ń ó ś ź ż pominięto lub zamieniono</p>
        </div>
      )}

      {/* Common mistakes */}
      {stats.commonMistakes.length > 0 && (
        <div className="bg-[#161616] border border-[#242424] rounded-2xl overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-5 py-3 border-b border-[#242424]">Najczęstsze błędy</p>
          <div className="divide-y divide-[#1e1e1e]">
            {stats.commonMistakes.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-2.5">
                <span className="font-mono text-sm text-red-400 w-6 text-center">
                  {m.expected === ' ' ? '␣' : m.expected}
                </span>
                <span className="text-gray-600 text-xs">→</span>
                <span className="font-mono text-sm text-gray-400 w-6 text-center">
                  {m.actual === ' ' ? '␣' : m.actual}
                </span>
                <span className="flex-1" />
                <span className="text-xs text-gray-600">{m.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficult words */}
      {stats.difficultWords.length > 0 && (
        <div className="bg-[#161616] border border-[#242424] rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Trudne słowa</p>
          <div className="flex flex-wrap gap-2">
            {stats.difficultWords.map((w, i) => (
              <span key={i} className="font-mono text-sm bg-[#1e1e1e] border border-[#2e2e2e] text-red-300/80 px-3 py-1 rounded-lg">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Text comparison */}
      <details className="group">
        <summary className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer select-none transition">
          Porównaj teksty ↓
        </summary>
        <div className="mt-3 space-y-3">
          <div className="bg-[#161616] border border-[#242424] rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Oryginał</p>
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{trainingText}</p>
          </div>
          <div className="bg-[#161616] border border-[#242424] rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Twój tekst</p>
            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{typedText}</p>
          </div>
        </div>
      </details>

      <button
        onClick={onNewRound}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
      >
        Nowa runda
      </button>
    </div>
  )
}

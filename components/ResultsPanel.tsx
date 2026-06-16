'use client'

import type { TypingStats, TypingMode, TransformMode } from '@/lib/types'

const MODE_LABEL: Record<TransformMode, string> = {
  '1to1': '1:1', clean: 'Oczyść', story: 'Opowieść', exercise: 'Ćwiczenie', polish_chars: 'Trudne znaki',
}
const TYPING_LABEL: Record<TypingMode, string> = {
  normal: 'Normal', blind: 'Blind Flow', no_backspace: 'No Backspace',
}

function getDiagnosis(stats: TypingStats): string {
  if (stats.polishCharsMissed >= 3) return 'Najczęściej gubisz polskie znaki — ą ę ć ł ń ó ś ź ż.'
  if (stats.accuracy >= 97) return 'Świetna dokładność. Teraz pracuj nad prędkością.'
  if (stats.accuracy >= 90) return 'Dobra ciągłość. Ćwicz końcówki słów.'
  if (stats.mistakesCount > 0 && stats.commonMistakes[0]?.count >= 3) {
    const m = stats.commonMistakes[0]
    return `Powtarzający się błąd: „${m.expected === ' ' ? '␣' : m.expected}" zamieniasz na „${m.actual === ' ' ? '␣' : m.actual}".`
  }
  if (stats.wpm < 20) return 'Spokojne tempo — to dobry start. Rytm ważniejszy niż szybkość.'
  return 'Runda zapisana.'
}

interface Props {
  stats: TypingStats
  trainingText: string
  typedText: string
  transformMode: TransformMode
  typingMode: TypingMode
  onNewRound: () => void
  onRepeat: () => void
}

export default function ResultsPanel({ stats, trainingText, typedText, transformMode, typingMode, onNewRound, onRepeat }: Props) {
  const acc = stats.accuracy
  const accColor = acc >= 95 ? 'text-green-600 dark:text-green-400' : acc >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'

  return (
    <div className="space-y-6">
      <p className="text-center text-gray-400 dark:text-gray-500 text-sm italic">To była runda. Nie wyrok.</p>

      {/* Diagnosis */}
      <div className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">{getDiagnosis(stats)}</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'WPM', value: stats.wpm, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Dokładność', value: `${acc}%`, color: accColor },
          { label: 'Słowa', value: stats.wordsTyped, color: 'text-gray-700 dark:text-gray-300' },
          { label: 'Do poprawy', value: stats.mistakesCount, color: stats.mistakesCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {MODE_LABEL[transformMode]}
        </span>
        <span className="text-xs bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {TYPING_LABEL[typingMode]}
        </span>
        <span className="text-xs bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 px-3 py-1 rounded-full">
          {stats.charsTyped} znaków
        </span>
      </div>

      {/* Polish chars warning */}
      {stats.polishCharsMissed > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Gubisz polskie znaki</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-0.5">{stats.polishCharsMissed} × ą ć ę ł ń ó ś ź ż pominięto lub zamieniono</p>
        </div>
      )}

      {/* Common mistakes */}
      {stats.commonMistakes.length > 0 && (
        <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-5 py-3 border-b border-gray-100 dark:border-[#242424]">Najczęstsze błędy</p>
          <div className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
            {stats.commonMistakes.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-2.5">
                <span className="font-mono text-sm text-red-500 dark:text-red-400 w-6 text-center">
                  {m.expected === ' ' ? '␣' : m.expected}
                </span>
                <span className="text-gray-400 text-xs">→</span>
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400 w-6 text-center">
                  {m.actual === ' ' ? '␣' : m.actual}
                </span>
                <span className="flex-1" />
                <span className="text-xs text-gray-400 dark:text-gray-600">{m.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficult words */}
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

      {/* Text comparison */}
      <details className="group">
        <summary className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer select-none transition">
          Porównaj teksty ↓
        </summary>
        <div className="mt-3 space-y-3">
          <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Oryginał</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{trainingText}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Twój tekst</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">{typedText}</p>
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRepeat}
          className="flex-1 py-3 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
        >
          Powtórz tekst
        </button>
        <button
          onClick={onNewRound}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
        >
          Nowa runda
        </button>
      </div>
    </div>
  )
}

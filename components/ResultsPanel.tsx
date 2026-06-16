'use client'

import type { TypingStats, TypingMode, TransformMode } from '@/lib/types'
import { align } from '@/lib/analyzeTyping'

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

interface DiffCharProps {
  trainingText: string
  typedText: string
}

function DiffView({ trainingText, typedText }: DiffCharProps) {
  const ops = align(trainingText, typedText)

  const highDivergence = trainingText.length > 0 &&
    ops.filter(o => o.op !== 'match').length / Math.min(trainingText.length, typedText.length || 1) > 0.6

  return (
    <div className="space-y-3">
      {highDivergence && (
        <p className="text-xs text-gray-500 dark:text-gray-600 italic">
          Tekst mocno różni się od źródła — porównanie ma ograniczoną wartość.
        </p>
      )}
      <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-xl px-4 py-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Porównanie znak po znaku</p>
        <p className="text-xs leading-7 font-mono break-words whitespace-pre-wrap">
          {ops.map((op, i) => {
            if (op.op === 'match') {
              return (
                <span key={i} className="text-gray-500 dark:text-gray-500">{op.ch}</span>
              )
            }
            if (op.op === 'sub') {
              return (
                <span key={i} className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20" title={`wpisano: "${op.actual}"`}>
                  {op.expected}
                </span>
              )
            }
            if (op.op === 'del') {
              return (
                <span key={i} className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20" title="pominięto">
                  {op.expected}
                </span>
              )
            }
            // ins — extra char typed
            return (
              <span key={i} className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" title="dodatkowy znak">
                {op.actual}
              </span>
            )
          })}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
        <span><span className="text-gray-500 dark:text-gray-400">■</span> poprawnie</span>
        <span><span className="text-red-500">■</span> zamiana</span>
        <span><span className="text-amber-500">■</span> pominięcie</span>
        <span><span className="text-blue-500">■</span> dodatkowy znak</span>
      </div>
    </div>
  )
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
  const incomplete = stats.completionPercent < 90

  return (
    <div className="space-y-6">
      <p className="text-center text-gray-400 dark:text-gray-500 text-sm italic">To była runda. Nie wyrok.</p>

      {/* Incomplete round notice */}
      {incomplete && (
        <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Runda niedokończona — wynik dokładności dotyczy przepisanego fragmentu.
          </p>
        </div>
      )}

      {/* Diagnosis */}
      <div className="bg-blue-50 dark:bg-blue-500/8 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">{getDiagnosis(stats)}</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.wpm}</p>
          <p className="text-xs text-gray-500 mt-1">WPM</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
          <p className={`text-2xl font-bold ${accColor}`}>{acc}%</p>
          <p className="text-xs text-gray-500 mt-1">Dokładność</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
          <p className={`text-2xl font-bold ${incomplete ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {stats.completionPercent}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Ukończenie</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-4 py-4 text-center">
          <p className={`text-2xl font-bold ${stats.mistakesCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {stats.mistakesCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Do poprawy</p>
        </div>
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

      {/* Text comparison — colored diff */}
      <details className="group">
        <summary className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer select-none transition">
          Porównaj teksty ↓
        </summary>
        <div className="mt-3">
          <DiffView trainingText={trainingText} typedText={typedText} />
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

'use client'

import type { TransformMode } from '@/lib/types'

const MODES: { value: TransformMode; label: string; desc: string }[] = [
  { value: '1to1',         label: '1:1',           desc: 'Ćwicz na swoim tekście bez zmian' },
  { value: 'clean',        label: 'Oczyść',         desc: 'Popraw literówki i interpunkcję' },
  { value: 'story',        label: 'Opowieść',       desc: 'Zamień w narrację z początkiem i końcem' },
  { value: 'exercise',     label: 'Ćwiczenie',      desc: 'Spokojny tekst do nauki, ~200 słów' },
  { value: 'polish_chars', label: 'Trudne znaki',   desc: 'Więcej ą ć ę ł ń ó ś ź ż' },
]

interface Props {
  selected: TransformMode
  onChange: (m: TransformMode) => void
  onConfirm: () => void
  loading: boolean
}

export default function TransformOptions({ selected, onChange, onConfirm, loading }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border text-left transition ${
              selected === m.value
                ? 'border-blue-400 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-500/10 text-gray-900 dark:text-white'
                : 'border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#3a3a3a] hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
              selected === m.value ? 'border-blue-500' : 'border-gray-300 dark:border-[#444]'
            }`}>
              {selected === m.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-[#2a2a2a] disabled:text-gray-400 dark:disabled:text-gray-600 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Transformuję...
          </>
        ) : (
          selected === '1to1' ? 'Dalej →' : 'Transformuj z AI →'
        )}
      </button>
    </div>
  )
}

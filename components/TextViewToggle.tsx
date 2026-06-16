'use client'

import type { TextViewMode } from '@/lib/types'

interface Props {
  value: TextViewMode
  onChange: (mode: TextViewMode) => void
}

const OPTIONS: { mode: TextViewMode; label: string; title: string }[] = [
  { mode: 'sentence', label: 'Zdanie', title: 'Tylko aktualne zdanie' },
  { mode: 'word',     label: 'Słowo',  title: 'Podświetlone aktualne słowo' },
  { mode: 'full',     label: 'Pełny',  title: 'Cały tekst widoczny' },
]

export default function TextViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide shrink-0">Widok</span>
      <div className="flex gap-1">
        {OPTIONS.map(o => (
          <button
            key={o.mode}
            onClick={() => onChange(o.mode)}
            title={o.title}
            className={`text-xs px-2.5 py-1 rounded-lg transition font-medium border ${
              value === o.mode
                ? 'text-white border-[var(--accent-600)]'
                : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-gray-200 dark:border-[#2e2e2e]'
            }`}
            style={value === o.mode ? { backgroundColor: 'var(--accent-600)' } : undefined}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

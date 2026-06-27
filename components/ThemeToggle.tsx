'use client'

import { useEffect, useState } from 'react'
import { loadSettings, saveSettings, applySettingsToDOM } from '@/lib/settings'
import type { Theme } from '@/lib/settings'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const s = loadSettings()
    setTheme(s.theme)
    applySettingsToDOM(s)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const current = loadSettings()
      if (current.theme === 'system') applySettingsToDOM(current)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function set(t: Theme) {
    setTheme(t)
    const updated = { ...loadSettings(), theme: t }
    saveSettings(updated)
    applySettingsToDOM(updated)
  }

  const options: { value: Theme; icon: string }[] = [
    { value: 'light', icon: '☀️' },
    { value: 'system', icon: '⚙️' },
    { value: 'dark', icon: '🌙' },
  ]

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => set(o.value)}
          title={o.value}
          className={`text-xs px-2 py-1 rounded-md transition ${
            theme === o.value
              ? 'bg-white dark:bg-[#2e2e2e] text-gray-900 dark:text-gray-200 shadow-sm'
              : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  )
}

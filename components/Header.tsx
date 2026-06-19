'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'
import { loadSettings, saveSettings, applySettingsToDOM } from '@/lib/settings'
import type { Settings } from '@/lib/settings'

interface Props {
  onHomeClick?: () => void
  onSettingsClick?: () => void
}

const NAV = [
  {
    href: '/lessons',
    label: 'Lekcje',
    icon: '📚',
    active: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25',
    inactive: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/25 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-300 dark:hover:border-blue-400/40',
  },
  {
    href: '/badges',
    label: 'Nagrody',
    icon: '🏅',
    active: 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25',
    inactive: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/25 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:border-amber-300 dark:hover:border-amber-400/40',
  },
  {
    href: '/history',
    label: 'Historia',
    icon: '📊',
    active: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25',
    inactive: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-400/40',
  },
]

export default function Header({ onHomeClick, onSettingsClick }: Props) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(loadSettings)

  function handleChange(partial: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      applySettingsToDOM(next)
      return next
    })
  }

  const openSettings = onSettingsClick ?? (() => setSettingsOpen(true))

  return (
    <div className="flex items-center justify-between mb-12">
      {/* Logo */}
      {onHomeClick ? (
        <button
          onClick={onHomeClick}
          className="select-none cursor-pointer text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 hover:text-[var(--accent-500)] transition-colors duration-200"
        >
          FlowKeys
        </button>
      ) : (
        <Link
          href="/"
          className="select-none text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 hover:text-[var(--accent-500)] transition-colors duration-200"
        >
          FlowKeys
        </Link>
      )}

      {/* Nav — colored standalone pills */}
      <nav className="flex items-center gap-3">
        {NAV.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl font-bold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                active ? link.active : link.inactive
              }`}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={openSettings}
          title="Ustawienia"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
        >
          ☰
        </button>
      </div>

      {!onSettingsClick && settingsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onChange={handleChange}
        />
      )}
    </div>
  )
}

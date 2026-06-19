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
  { href: '/lessons', label: 'Akademia' },
  { href: '/history', label: 'Historia' },
  { href: '/badges',  label: 'Odznaki'  },
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

      {/* Nav */}
      <nav className="flex items-center gap-6">
        {NAV.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-150 ${
                active
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
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

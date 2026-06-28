'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import ThemeToggle from './ThemeToggle'
import SettingsModal from './SettingsModal'
import { loadSettings, saveSettings, applySettingsToDOM } from '@/lib/settings'
import type { Settings } from '@/lib/settings'
import { routing } from '@/i18n/routing'

interface Props {
  onHomeClick?: () => void
  onSettingsClick?: () => void
  compact?: boolean
}

const LOCALE_FLAG: Record<string, string> = {
  pl: '🇵🇱', en: '🇬🇧', de: '🇩🇪', es: '🇪🇸',
}

export default function Header({ onHomeClick, onSettingsClick, compact }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('nav')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [langOpen, setLangOpen] = useState(false)

  const NAV = [
    { href: '/library', label: t('library') },
    { href: '/lessons', label: t('academy')  },
    { href: '/history', label: t('history')  },
    { href: '/badges',  label: t('badges')   },
  ]

  function handleChange(partial: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      applySettingsToDOM(next)
      return next
    })
  }

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
    setLangOpen(false)
  }

  const openSettings = onSettingsClick ?? (() => setSettingsOpen(true))

  return (
    <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-12'}`}>
      {/* Logo */}
      {onHomeClick ? (
        <button
          onClick={onHomeClick}
          className="select-none cursor-pointer text-2xl font-black tracking-tight text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors duration-200"
        >
          FlowKeys
        </button>
      ) : (
        <Link
          href="/"
          className="select-none text-2xl font-black tracking-tight text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors duration-200"
        >
          FlowKeys
        </Link>
      )}

      {/* Nav */}
      {!compact && (
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
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!compact && <ThemeToggle />}

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(v => !v)}
            title={t('language')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all duration-200 text-base"
          >
            {LOCALE_FLAG[locale] ?? locale.toUpperCase()}
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              <div className="absolute right-0 top-11 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl shadow-lg overflow-hidden min-w-[100px]">
                {routing.locales.map(loc => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      loc === locale
                        ? 'bg-[var(--accent-500)]/10 text-[var(--accent-600)] dark:text-[var(--accent-400)] font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525]'
                    }`}
                  >
                    <span>{LOCALE_FLAG[loc]}</span>
                    <span className="uppercase font-mono text-xs">{loc}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={openSettings}
          title={t('settings')}
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

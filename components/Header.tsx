'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

interface Props {
  onHomeClick?: () => void
  onSettingsClick?: () => void
}

export default function Header({ onHomeClick, onSettingsClick }: Props) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/lessons', label: 'Lekcje' },
    { href: '/badges', label: 'Nagrody' },
    { href: '/history', label: 'Historia' },
  ]

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

      {/* Nav — pill container */}
      <nav className="flex items-center gap-0.5 bg-gray-100/80 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-1 backdrop-blur-sm">
        {navLinks.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                active
                  ? 'bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-gray-100 shadow-md shadow-black/5 dark:shadow-black/30 scale-[1.02]'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-[#222]/60'
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
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            title="Ustawienia"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252525] hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  )
}

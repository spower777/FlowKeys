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
    <div className="flex items-center justify-between mb-10">
      {/* Logo */}
      {onHomeClick ? (
        <button
          onClick={onHomeClick}
          className="select-none cursor-pointer text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          FlowKeys
        </button>
      ) : (
        <Link
          href="/"
          className="select-none text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          FlowKeys
        </Link>
      )}

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navLinks.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                active
                  ? 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
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
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#222] transition text-sm"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  )
}

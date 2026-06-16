import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface Props {
  onHomeClick?: () => void
  onSettingsClick?: () => void
}

export default function Header({ onHomeClick, onSettingsClick }: Props) {
  return (
    <div className="flex items-center justify-between mb-12">
      {onHomeClick ? (
        <button
          onClick={onHomeClick}
          className="select-none cursor-pointer text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          FlowKeys
        </button>
      ) : (
        <Link
          href="/"
          className="select-none text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          FlowKeys
        </Link>
      )}
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
        <Link href="/history" className="text-xs text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition">
          Historia →
        </Link>
      </div>
    </div>
  )
}

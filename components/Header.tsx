import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-12">
      <Link
        href="/"
        className="select-none text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        FlowKeys
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/history" className="text-xs text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition">
          Historia →
        </Link>
      </div>
    </div>
  )
}

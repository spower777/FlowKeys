'use client'

import { useTranslations } from 'next-intl'

export default function MarqueeBanner() {
  const t = useTranslations('marquee')
  const items = t.raw('items') as string[]
  const text = items.join('   ')
  const doubled = `${text}   ${text}   `

  return (
    <div className="overflow-hidden rounded-xl bg-gray-950 dark:bg-black border border-gray-800 dark:border-gray-900 h-12 flex items-center select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="font-mono text-sm font-semibold tracking-widest text-[var(--accent-400)] opacity-90">
          {doubled}
        </span>
      </div>
    </div>
  )
}

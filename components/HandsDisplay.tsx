'use client'

import { FINGER } from '@/lib/fingerMap'

const LEFT  = ['lp', 'lr', 'lm', 'li'] as const
const RIGHT = ['ri', 'rm', 'rr', 'rp'] as const

// Idle: very light tint, Active: vivid fill
const IDLE: Record<string, string> = {
  lp: 'bg-violet-100 dark:bg-violet-900/20 border-violet-200/60 dark:border-violet-700/20',
  lr: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-700/20',
  lm: 'bg-teal-100 dark:bg-teal-900/20 border-teal-200/60 dark:border-teal-700/20',
  li: 'bg-amber-100 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-700/20',
  ri: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200/60 dark:border-orange-700/20',
  rm: 'bg-teal-100 dark:bg-teal-900/20 border-teal-200/60 dark:border-teal-700/20',
  rr: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-700/20',
  rp: 'bg-violet-100 dark:bg-violet-900/20 border-violet-200/60 dark:border-violet-700/20',
}

const VIVID: Record<string, string> = {
  lp: 'bg-violet-400 dark:bg-violet-500 border-violet-400 dark:border-violet-500',
  lr: 'bg-blue-400 dark:bg-blue-500 border-blue-400 dark:border-blue-500',
  lm: 'bg-teal-400 dark:bg-teal-500 border-teal-400 dark:border-teal-500',
  li: 'bg-amber-400 dark:bg-amber-400 border-amber-400 dark:border-amber-400',
  ri: 'bg-orange-400 dark:bg-orange-400 border-orange-400 dark:border-orange-400',
  rm: 'bg-teal-400 dark:bg-teal-500 border-teal-400 dark:border-teal-500',
  rr: 'bg-blue-400 dark:bg-blue-500 border-blue-400 dark:border-blue-500',
  rp: 'bg-violet-400 dark:bg-violet-500 border-violet-400 dark:border-violet-500',
}

// Natural finger height ratios
const HEIGHT: Record<string, number> = { lp: 18, lr: 24, lm: 28, li: 22, ri: 22, rm: 28, rr: 24, rp: 18 }

interface Props {
  activeFinger: string | null
}

export default function HandsDisplay({ activeFinger }: Props) {
  const isThumb = activeFinger === 'th'

  function renderFinger(id: string) {
    const active = activeFinger === id
    const h = active ? HEIGHT[id] + 6 : HEIGHT[id]
    return (
      <div
        key={id}
        style={{ height: `${h}px` }}
        className={`w-[14px] rounded-full border transition-all duration-100 ${
          active ? VIVID[id] : IDLE[id]
        }`}
      />
    )
  }

  return (
    <div className="flex justify-center items-end gap-5 pb-2 pt-1 select-none">
      {/* Left hand: pinky → index */}
      <div className="flex items-end gap-[3px]">
        {LEFT.map(id => renderFinger(id))}
      </div>

      {/* Spacebar */}
      <div className={`w-10 h-[6px] rounded-full border transition-all duration-100 self-center ${
        isThumb
          ? 'bg-[var(--accent-500)] border-[var(--accent-600)]'
          : 'bg-gray-200 dark:bg-[#2a2a2a] border-gray-300 dark:border-[#333]'
      }`} />

      {/* Right hand: index → pinky */}
      <div className="flex items-end gap-[3px]">
        {RIGHT.map(id => renderFinger(id))}
      </div>
    </div>
  )
}

export function charToActiveFinger(ch: string): string | null {
  if (!ch) return null
  const lc = ch.toLowerCase()
  return FINGER[lc] ?? FINGER[ch] ?? null
}

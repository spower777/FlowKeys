'use client'

import { FINGER } from '@/lib/fingerMap'

const LEFT  = ['lp', 'lr', 'lm', 'li'] as const
const RIGHT = ['ri', 'rm', 'rr', 'rp'] as const

// Natural finger heights in px (left: pinky→index, right: index→pinky)
const L_H: Record<string, number> = { lp: 20, lr: 28, lm: 32, li: 26 }
const R_H: Record<string, number> = { ri: 26, rm: 32, rr: 28, rp: 20 }

const IDLE: Record<string, string> = {
  lp: 'bg-violet-100 dark:bg-violet-900/25 border-violet-200 dark:border-violet-700/30',
  lr: 'bg-blue-100 dark:bg-blue-900/25 border-blue-200 dark:border-blue-700/30',
  lm: 'bg-teal-100 dark:bg-teal-900/25 border-teal-200 dark:border-teal-700/30',
  li: 'bg-amber-100 dark:bg-amber-900/25 border-amber-200 dark:border-amber-700/30',
  ri: 'bg-orange-100 dark:bg-orange-900/25 border-orange-200 dark:border-orange-700/30',
  rm: 'bg-teal-100 dark:bg-teal-900/25 border-teal-200 dark:border-teal-700/30',
  rr: 'bg-blue-100 dark:bg-blue-900/25 border-blue-200 dark:border-blue-700/30',
  rp: 'bg-violet-100 dark:bg-violet-900/25 border-violet-200 dark:border-violet-700/30',
}

const VIVID: Record<string, string> = {
  lp: 'bg-violet-400 dark:bg-violet-500 border-violet-500 dark:border-violet-400',
  lr: 'bg-blue-400 dark:bg-blue-500 border-blue-500 dark:border-blue-400',
  lm: 'bg-teal-400 dark:bg-teal-500 border-teal-500 dark:border-teal-400',
  li: 'bg-amber-400 dark:bg-amber-400 border-amber-500 dark:border-amber-300',
  ri: 'bg-orange-400 dark:bg-orange-400 border-orange-500 dark:border-orange-300',
  rm: 'bg-teal-400 dark:bg-teal-500 border-teal-500 dark:border-teal-400',
  rr: 'bg-blue-400 dark:bg-blue-500 border-blue-500 dark:border-blue-400',
  rp: 'bg-violet-400 dark:bg-violet-500 border-violet-500 dark:border-violet-400',
}

interface Props {
  activeFinger: string | null
}

export default function HandsDisplay({ activeFinger }: Props) {
  const isThumb = activeFinger === 'th'

  const palmCls  = 'bg-gray-100 dark:bg-[#1e1e1e] border-gray-200 dark:border-[#2a2a2a]'
  const thumbCls = isThumb
    ? 'bg-[var(--accent-500)] border-[var(--accent-600)] scale-110'
    : palmCls

  function finger(id: string, h: number) {
    const active = activeFinger === id
    return (
      <div
        key={id}
        style={{ height: `${h}px` }}
        className={`w-5 rounded-t-xl border transition-all duration-100 ${
          active ? `${VIVID[id]} scale-110 -translate-y-1.5` : IDLE[id]
        }`}
      />
    )
  }

  return (
    <div className="flex justify-center gap-10 pb-2 pt-1 select-none">
      {/* Left hand */}
      <div className="flex flex-col items-end">
        <div className="flex items-end gap-1">
          {LEFT.map(id => finger(id, L_H[id]))}
        </div>
        <div className={`w-[88px] h-4 rounded-b-lg border border-t-0 ${palmCls}`} />
        <div className={`h-3 w-7 rounded-r-full border border-t-0 mr-1 transition-all duration-100 ${thumbCls}`} />
      </div>

      {/* Right hand */}
      <div className="flex flex-col items-start">
        <div className="flex items-end gap-1">
          {RIGHT.map(id => finger(id, R_H[id]))}
        </div>
        <div className={`w-[88px] h-4 rounded-b-lg border border-t-0 ${palmCls}`} />
        <div className={`h-3 w-7 rounded-l-full border border-t-0 ml-1 transition-all duration-100 ${thumbCls}`} />
      </div>
    </div>
  )
}

// Derive activeFinger from a character
export function charToActiveFinger(ch: string): string | null {
  if (!ch) return null
  const lc = ch.toLowerCase()
  return FINGER[lc] ?? FINGER[ch] ?? null
}

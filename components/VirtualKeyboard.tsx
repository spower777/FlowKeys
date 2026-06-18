'use client'

import { FINGER, POLISH_BASE, FINGER_COLORS, FINGER_LABELS } from '@/lib/fingerMap'

// Standard QWERTY rows (lowercase)
const ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
]

const BASE_CLS = 'bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300'
const ACTIVE_CLS = 'bg-[var(--accent-500)] text-white scale-110 shadow-lg z-10'
const ALT_BADGE = 'absolute -top-1 -right-1 text-[7px] bg-violet-500 text-white rounded px-0.5 leading-tight font-bold'
const SHIFT_BADGE = 'absolute -top-1 -right-1 text-[7px] bg-blue-500 text-white rounded px-0.5 leading-tight font-bold'

interface Props {
  nextChar: string
  showFingers: boolean
  pressedKey?: string  // replay mode: highlight last pressed key
}

export default function VirtualKeyboard({ nextChar, showFingers, pressedKey }: Props) {
  const charToResolve = pressedKey ?? nextChar
  const lc = charToResolve.toLowerCase()
  const isPolish = lc in POLISH_BASE || charToResolve in POLISH_BASE
  const isUppercase = charToResolve !== lc && !isPolish && charToResolve.length === 1
  const isPolishUpper = charToResolve !== lc && isPolish

  const baseKey = isPolish
    ? POLISH_BASE[charToResolve] ?? ''
    : charToResolve === ' ' ? ' ' : lc

  const showAlt = isPolish && !pressedKey
  const showShift = (isUppercase || isPolishUpper) && !pressedKey

  function keyClass(k: string): string {
    const isActive = k === baseKey
    if (isActive) return ACTIVE_CLS
    if (showFingers && FINGER[k]) return FINGER_COLORS[FINGER[k]] ?? BASE_CLS
    return BASE_CLS
  }

  return (
    <div className="select-none rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#111] p-3 space-y-1.5">
      {/* Letter + number rows */}
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1">
          {/* Stagger: row 1 = 0.5 key, row 2 = 1 key, row 3 = 1.5 key */}
          {ri === 1 && <div className="w-5" />}
          {ri === 2 && <div className="w-9" />}
          {ri === 3 && <div className="w-14" />}
          {row.map(k => (
            <div
              key={k}
              className={`relative flex items-center justify-center w-9 h-9 rounded-lg text-xs font-mono font-medium transition-all duration-75 ${keyClass(k)}`}
            >
              {k.toUpperCase()}
              {k === baseKey && showAlt && <span className={ALT_BADGE}>Alt</span>}
              {k === baseKey && showShift && <span className={SHIFT_BADGE}>⇧</span>}
            </div>
          ))}
        </div>
      ))}

      {/* Space bar */}
      <div className="flex justify-center mt-0.5">
        <div className={`flex items-center justify-center h-9 w-52 rounded-lg text-xs font-medium transition-all duration-75 ${baseKey === ' ' ? ACTIVE_CLS : showFingers ? FINGER_COLORS['th'] : BASE_CLS}`}>
          Spacja
        </div>
      </div>

      {/* Finger legend */}
      {showFingers && (
        <div className="flex justify-center gap-3 pt-1 flex-wrap">
          {Object.entries(FINGER_LABELS).filter(([id]) => id !== 'th').map(([id, label]) => (
            <span key={id} className={`text-[9px] px-1.5 py-0.5 rounded-full ${FINGER_COLORS[id]}`}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

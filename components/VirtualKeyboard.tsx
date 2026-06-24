'use client'

import { FINGER, POLISH_BASE, FINGER_COLORS, FINGER_LABELS } from '@/lib/fingerMap'
import HandsDisplay from './HandsDisplay'

// ── Row definitions ───────────────────────────────────────────────────────────

type SpecialKey = { id: string; label: string; w: string }
type KeySpec = string | SpecialKey

const ROWS: KeySpec[][] = [
  [
    '1','2','3','4','5','6','7','8','9','0',
    { id: 'Backspace', label: '⌫', w: 'w-[52px]' },
  ],
  [
    { id: 'Tab', label: '⇥ Tab', w: 'w-[52px]' },
    'q','w','e','r','t','y','u','i','o','p',
  ],
  [
    { id: 'Caps', label: '⇪', w: 'w-[52px]' },
    'a','s','d','f','g','h','j','k','l',
    { id: 'Enter', label: '↵ Enter', w: 'w-[58px]' },
  ],
  [
    { id: 'ShiftL', label: '⇧ Shift', w: 'w-[70px]' },
    'z','x','c','v','b','n','m',
    { id: 'ShiftR', label: '⇧', w: 'w-[52px]' },
  ],
]

// ── Styles ────────────────────────────────────────────────────────────────────

const KEY_BASE = 'relative flex items-center justify-center h-9 rounded-md text-[10px] font-mono font-medium transition-all duration-75 border select-none'
const STD_W = 'w-9'

const KEY_CHAR = `${KEY_BASE} ${STD_W} bg-white dark:bg-[#282828] border-gray-200 dark:border-[#161616] text-gray-700 dark:text-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.12)] dark:shadow-[0_2px_0_rgba(0,0,0,0.55)]`
const KEY_MOD  = `${KEY_BASE} bg-gray-100 dark:bg-[#1e1e1e] border-gray-200 dark:border-[#161616] text-gray-500 dark:text-gray-600 shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_0_rgba(0,0,0,0.5)]`
const KEY_ACT  = `${KEY_BASE} bg-[var(--accent-500)] border-[var(--accent-600)] text-white shadow-[0_2px_0_var(--accent-600)] scale-105 z-10`

const ALT_BADGE   = 'absolute -top-1 -right-1 text-[6px] bg-violet-500 text-white rounded px-0.5 leading-tight font-bold'

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  nextChar: string
  showFingers: boolean
  pressedKey?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VirtualKeyboard({ nextChar, showFingers, pressedKey }: Props) {
  const ch = pressedKey ?? nextChar

  const isBackspace = ch === 'Backspace'
  const isEnter     = ch === '\n' || ch === 'Enter'
  const isSpace     = ch === ' '
  const lc          = ch.toLowerCase()
  const isPolish    = !isBackspace && !isEnter && !isSpace && (lc in POLISH_BASE || ch in POLISH_BASE)
  const isUppercase = !isBackspace && !isEnter && !isSpace && !isPolish && ch !== lc && ch.length === 1
  const isPolishUp  = isPolish && ch !== lc
  const isShift     = (isUppercase || isPolishUp) && !pressedKey

  const baseKey = isPolish
    ? (POLISH_BASE[ch] ?? POLISH_BASE[lc] ?? '')
    : isBackspace ? 'Backspace'
    : isEnter     ? 'Enter'
    : isSpace     ? ' '
    : lc

  const showAlt = isPolish && !pressedKey

  // ── class helpers ──────────────────────────────────────────────────────────

  function charCls(k: string): string {
    if (k === baseKey) return `${KEY_ACT} ${STD_W}`
    if (showFingers && FINGER[k]) {
      return `${KEY_BASE} ${STD_W} ${FINGER_COLORS[FINGER[k]]} border-transparent shadow-[0_2px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_0_rgba(0,0,0,0.4)]`
    }
    return KEY_CHAR
  }

  function specCls(id: string, w: string): string {
    const active =
      (id === 'Backspace' && baseKey === 'Backspace') ||
      (id === 'Enter'     && baseKey === 'Enter')     ||
      ((id === 'ShiftL' || id === 'ShiftR') && isShift)
    return `${KEY_MOD} ${w} ${active ? 'bg-[var(--accent-500)] border-[var(--accent-600)] text-white shadow-[0_2px_0_var(--accent-600)] scale-105 z-10 dark:bg-[var(--accent-500)]' : ''}`
  }

  const spaceActive = isSpace
  const spaceCls = spaceActive
    ? `${KEY_BASE} w-56 bg-[var(--accent-500)] border-[var(--accent-600)] text-white shadow-[0_2px_0_var(--accent-600)] scale-105`
    : showFingers
      ? `${KEY_BASE} w-56 ${FINGER_COLORS['th']} border-transparent shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_0_rgba(0,0,0,0.4)]`
      : `${KEY_BASE} w-56 bg-white dark:bg-[#282828] border-gray-200 dark:border-[#161616] text-gray-500 dark:text-gray-600 shadow-[0_2px_0_rgba(0,0,0,0.12)] dark:shadow-[0_2px_0_rgba(0,0,0,0.55)]`

  // ── render ─────────────────────────────────────────────────────────────────

  const activeFinger = FINGER[baseKey] ?? null

  return (
    <div className="select-none rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-[#e8e8e8] dark:bg-[#111] p-3 space-y-1.5">

      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1">
          {row.map(k => {
            if (typeof k === 'string') {
              return (
                <div key={k} className={charCls(k)}>
                  {k.toUpperCase()}
                  {k === baseKey && showAlt   && <span className={ALT_BADGE}>Alt</span>}
                </div>
              )
            }
            return (
              <div key={k.id} className={specCls(k.id, k.w)}>
                {k.label}
              </div>
            )
          })}
        </div>
      ))}

      {/* Space bar */}
      <div className="flex justify-center mt-0.5">
        <div className={spaceCls}>Space</div>
      </div>

      {/* Finger legend */}
      {showFingers && (
        <div className="flex justify-center gap-1.5 pt-1 flex-wrap">
          {Object.entries(FINGER_LABELS).filter(([id]) => id !== 'th').map(([id, label]) => {
            const isActive = activeFinger === id
            return (
              <span
                key={id}
                className={`text-[9px] px-2 py-0.5 rounded-full border transition-all duration-100 ${
                  isActive
                    ? `${FINGER_COLORS[id]} border-current font-bold`
                    : `${FINGER_COLORS[id]} border-transparent opacity-50`
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

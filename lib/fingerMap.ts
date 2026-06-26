import { LAYOUTS, type KeyboardLayout } from './keyboardLayouts'

// QWERTY finger map kept for backward-compat (VirtualKeyboard default)
export const FINGER: Record<string, string> = LAYOUTS.qwerty.finger

export const POLISH_BASE: Record<string, string> = {
  'ą':'a','ę':'e','ó':'o','ś':'s','ź':'z','ż':'x','ć':'c','ń':'n','ł':'l',
  'Ą':'a','Ę':'e','Ó':'o','Ś':'s','Ź':'z','Ż':'x','Ć':'c','Ń':'n','Ł':'l',
}

export const FINGER_LABELS: Record<string, string> = {
  lp: 'L. mały', lr: 'L. serdeczny', lm: 'L. środkowy', li: 'L. wskazujący',
  ri: 'P. wskazujący', rm: 'P. środkowy', rr: 'P. serdeczny', rp: 'P. mały',
  th: 'Kciuk',
}

export const FINGER_COLORS: Record<string, string> = {
  lp: 'bg-violet-100 dark:bg-violet-900/25 text-violet-600 dark:text-violet-400',
  lr: 'bg-blue-100 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400',
  lm: 'bg-teal-100 dark:bg-teal-900/25 text-teal-600 dark:text-teal-400',
  li: 'bg-amber-100 dark:bg-amber-900/25 text-amber-600 dark:text-amber-400',
  ri: 'bg-orange-100 dark:bg-orange-900/25 text-orange-600 dark:text-orange-400',
  rm: 'bg-teal-100 dark:bg-teal-900/25 text-teal-600 dark:text-teal-400',
  rr: 'bg-blue-100 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400',
  rp: 'bg-violet-100 dark:bg-violet-900/25 text-violet-600 dark:text-violet-400',
  th: 'bg-gray-200 dark:bg-gray-700/40 text-gray-500 dark:text-gray-400',
}

export function charToFinger(ch: string, layout: KeyboardLayout = 'qwerty'): string | null {
  const lc = ch.toLowerCase()
  const base = POLISH_BASE[ch] ?? POLISH_BASE[lc] ?? lc
  return LAYOUTS[layout].finger[base] ?? null
}

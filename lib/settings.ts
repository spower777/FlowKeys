import type { TextViewMode } from './types'

export type Theme = 'light' | 'dark' | 'system'
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange'
export type Density = 'comfortable' | 'compact'
export type VoiceRate = 0.75 | 1 | 1.25 | 1.5
export type VoiceMode = 'all' | 'sentence'

export interface Settings {
  theme: Theme
  accentColor: AccentColor
  density: Density
  textViewMode: TextViewMode
  showFingers: boolean
  showKeyboard: boolean
  keyboardSounds: boolean
  blockPaste: boolean
  calmMode: boolean
  voiceRate: VoiceRate
  voiceMode: VoiceMode
  blindHint: boolean
}

export const DEFAULTS: Settings = {
  theme: 'system',
  accentColor: 'blue',
  density: 'comfortable',
  textViewMode: 'sentence',
  showFingers: false,
  showKeyboard: false,
  keyboardSounds: false,
  blockPaste: true,
  calmMode: false,
  voiceRate: 1,
  voiceMode: 'all',
  blindHint: true,
}

const KEY = 'flowkeys_settings'

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(KEY)
    const stored: Partial<Settings> = raw ? JSON.parse(raw) : {}
    // Migrate legacy keys written before unified settings existed
    if (!stored.theme) {
      const t = localStorage.getItem('flowkeys_theme') as Theme | null
      if (t) stored.theme = t
    }
    if (!stored.textViewMode) {
      const v = localStorage.getItem('flowkeys_text_view_mode') as TextViewMode | null
      if (v) stored.textViewMode = v
    }
    return { ...DEFAULTS, ...stored }
  } catch {
    return DEFAULTS
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(s))
  // Keep legacy keys in sync so the layout.tsx flash-prevention script still works
  localStorage.setItem('flowkeys_theme', s.theme)
  localStorage.setItem('flowkeys_text_view_mode', s.textViewMode)
}

export function applySettingsToDOM(s: Settings): void {
  const isDark =
    s.theme === 'dark' ||
    (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.setAttribute('data-accent', s.accentColor)
  document.documentElement.setAttribute('data-density', s.density)
}

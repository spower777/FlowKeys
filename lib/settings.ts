import type { TextViewMode } from './types'
import { type PackGroupId, DEFAULT_PACK_GROUPS } from '@/data/packGroups'

export type Theme = 'light' | 'dark' | 'system'
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'rose' | 'teal' | 'amber' | 'indigo' | 'emerald' | 'fuchsia'
export type Density = 'comfortable' | 'compact'
export type VoiceRate = 0.75 | 1 | 1.25 | 1.5
export type VoiceMode = 'all' | 'sentence'
export type SoundProfile = 'off' | 'mechanical' | 'soft' | 'typewriter' | 'deep'

export interface Settings {
  theme: Theme
  accentColor: AccentColor
  density: Density
  textViewMode: TextViewMode
  showFingers: boolean
  showKeyboard: boolean
  soundProfile: SoundProfile
  blockPaste: boolean
  calmMode: boolean
  voiceRate: VoiceRate
  voiceMode: VoiceMode
  blindHint: boolean
  devUnlockAll: boolean
  preferredPackGroups: PackGroupId[]
}

export const DEFAULTS: Settings = {
  theme: 'system',
  accentColor: 'blue',
  density: 'comfortable',
  textViewMode: 'sentence',
  showFingers: false,
  showKeyboard: false,
  soundProfile: 'off',
  blockPaste: true,
  calmMode: false,
  voiceRate: 1,
  voiceMode: 'all',
  blindHint: true,
  devUnlockAll: false,
  preferredPackGroups: DEFAULT_PACK_GROUPS,
}

const KEY = 'flowkeys_settings'

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(KEY)
    const stored: Partial<Settings> & { keyboardSounds?: boolean } = raw ? JSON.parse(raw) : {}
    // Migrate legacy keys written before unified settings existed
    if (stored.keyboardSounds === true && !stored.soundProfile) stored.soundProfile = 'mechanical'
    delete stored.keyboardSounds
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

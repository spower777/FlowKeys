import type { TextViewMode } from './types'
import { type PackGroupId, DEFAULT_PACK_GROUPS } from '@/data/packGroups'

export type Theme = 'light' | 'dark' | 'system'
export type ThemePreset = 'classic' | 'ocean' | 'cyber' | 'aurora' | 'retro' | 'sunset' | 'zen' | 'midnight' | 'sakura' | 'cosmos'
export type Density = 'comfortable' | 'compact'
export type VoiceRate = 0.75 | 1 | 1.25 | 1.5
export type VoiceMode = 'all' | 'sentence'
export type SoundProfile = 'off' | 'mechanical' | 'soft' | 'typewriter' | 'deep'

// Maps old accentColor values to their closest ThemePreset
const ACCENT_TO_PRESET: Record<string, ThemePreset> = {
  blue: 'classic', green: 'zen', purple: 'cosmos', orange: 'sunset',
  rose: 'sakura', teal: 'ocean', amber: 'retro', indigo: 'midnight',
  emerald: 'cyber', fuchsia: 'aurora',
}

export interface Settings {
  theme: Theme
  themePreset: ThemePreset
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
  themePreset: 'classic',
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
    const stored: Partial<Settings> & { keyboardSounds?: boolean; accentColor?: string } = raw ? JSON.parse(raw) : {}
    // Migrate legacy keys
    if (stored.keyboardSounds === true && !stored.soundProfile) stored.soundProfile = 'mechanical'
    delete stored.keyboardSounds
    if (stored.accentColor && !stored.themePreset) {
      stored.themePreset = ACCENT_TO_PRESET[stored.accentColor] ?? 'classic'
    }
    delete stored.accentColor
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
  localStorage.setItem('flowkeys_theme', s.theme)
  localStorage.setItem('flowkeys_text_view_mode', s.textViewMode)
  localStorage.setItem('flowkeys_preset', s.themePreset)
}

export function applySettingsToDOM(s: Settings): void {
  const isDark =
    s.theme === 'dark' ||
    (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.setAttribute('data-preset', s.themePreset)
  document.documentElement.setAttribute('data-density', s.density)
}

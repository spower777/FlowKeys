'use client'

import { useState, useEffect, useCallback } from 'react'
import { clearSessions } from '@/lib/storage'
import { DEFAULTS, applySettingsToDOM } from '@/lib/settings'
import type { Settings, Theme, ThemePreset, Density, VoiceRate, VoiceMode, SoundProfile, KeyboardLayout } from '@/lib/settings'
import { LAYOUTS } from '@/lib/keyboardLayouts'
import type { TextViewMode } from '@/lib/types'
import { PACK_GROUPS, type PackGroupId } from '@/data/packGroups'

interface Props {
  settings: Settings
  onClose: () => void
  onChange: (partial: Partial<Settings>) => void
}

// ── theme / color data ────────────────────────────────────────────────────────

const THEME_PRESETS: { id: ThemePreset; label: string; theme: Theme; from: string; to: string }[] = [
  { id: 'classic',  label: 'Classic',  theme: 'light', from: '#3b82f6', to: '#1d4ed8' },
  { id: 'ocean',    label: 'Ocean',    theme: 'dark',  from: '#06b6d4', to: '#0369a1' },
  { id: 'cyber',    label: 'Cyber',    theme: 'dark',  from: '#10b981', to: '#065f46' },
  { id: 'aurora',   label: 'Aurora',   theme: 'dark',  from: '#d946ef', to: '#7c3aed' },
  { id: 'retro',    label: 'Retro',    theme: 'light', from: '#f59e0b', to: '#78350f' },
  { id: 'sunset',   label: 'Sunset',   theme: 'dark',  from: '#f97316', to: '#9f1239' },
  { id: 'zen',      label: 'Zen',      theme: 'light', from: '#22c55e', to: '#166534' },
  { id: 'midnight', label: 'Midnight', theme: 'dark',  from: '#6366f1', to: '#1e1b4b' },
  { id: 'sakura',   label: 'Sakura',   theme: 'light', from: '#fb7185', to: '#881337' },
  { id: 'cosmos',   label: 'Cosmos',   theme: 'dark',  from: '#a855f7', to: '#1e1b4b' },
]

// ── small UI helpers ──────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span className="text-sm">{icon}</span>}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
      </div>
      <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl divide-y divide-gray-100 dark:divide-[#242424] shadow-sm dark:shadow-none overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 leading-snug">{sub}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
      className={`relative w-10 h-[22px] rounded-full transition-colors ${
        value ? 'bg-[var(--accent-600)]' : 'bg-gray-300 dark:bg-[#444]'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform ${
          value ? 'translate-x-[18px]' : ''
        }`}
      />
    </button>
  )
}

function Pills<T extends string | number>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 flex-wrap justify-end">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`text-xs px-2.5 py-1 rounded-lg transition font-medium border ${
            value === o.value
              ? 'bg-[var(--accent-600)] text-white border-[var(--accent-600)]'
              : 'bg-white dark:bg-[#232323] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── browser / mic detection ───────────────────────────────────────────────────

type BrowserName = 'brave' | 'chrome' | 'firefox' | 'safari' | 'unknown'

function getBrowser(): BrowserName {
  if (typeof navigator === 'undefined') return 'unknown'
  const nav = navigator as Navigator & { brave?: unknown }
  if (nav.brave) return 'brave'
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari'
  if (ua.includes('Chrome')) return 'chrome'
  return 'unknown'
}

const BROWSER_LABELS: Record<BrowserName, string> = {
  brave: 'Brave',
  chrome: 'Chrome',
  firefox: 'Firefox',
  safari: 'Safari',
  unknown: 'Nieznana',
}

// ── main component ────────────────────────────────────────────────────────────

export default function SettingsModal({ settings, onClose, onChange }: Props) {
  const [micPerm, setMicPerm] = useState<PermissionState | null>(null)
  const [browser, setBrowser] = useState<BrowserName>('unknown')
  const [speechSupported, setSpeechSupported] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  useEffect(() => {
    setBrowser(getBrowser())
    const w = window as unknown as Record<string, unknown>
    setSpeechSupported(!!(w['SpeechRecognition'] ?? w['webkitSpeechRecognition']))

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then(r => {
          setMicPerm(r.state)
          r.onchange = () => setMicPerm(r.state)
        })
        .catch(() => {})
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ [key]: value } as Partial<Settings>)
  }

  function handleClearHistory() {
    clearSessions()
    setCleared(true)
    setConfirmClear(false)
  }

  function handleResetSettings() {
    onChange({ ...DEFAULTS })
    applySettingsToDOM(DEFAULTS)
    setConfirmReset(false)
  }

  const micLabel: Record<PermissionState, string> = {
    granted: 'Przyznany',
    denied: 'Zablokowany',
    prompt: 'Niezapytano',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-[#111] rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#2a2a2a]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#222] sticky top-0 bg-white dark:bg-[#111] z-10">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Ustawienia</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] transition text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">

          {/* ── Wygląd ── */}
          <Section title="Wygląd" icon="🎨">
            <div className="px-4 pt-3.5 pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">Motyw</p>
              <div className="grid grid-cols-5 gap-2">
                {THEME_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onChange({ themePreset: preset.id, theme: preset.theme })}
                    title={preset.label}
                    style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                    className={`h-12 rounded-xl flex items-end justify-center pb-1.5 transition-all duration-200 ${
                      settings.themePreset === preset.id
                        ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 shadow-lg scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <span className="text-[8px] font-bold text-white drop-shadow-sm leading-none">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Row label="Jasność">
              <Pills<Theme>
                value={settings.theme}
                onChange={v => set('theme', v)}
                options={[
                  { value: 'light', label: '☀️' },
                  { value: 'system', label: 'Auto' },
                  { value: 'dark', label: '🌙' },
                ]}
              />
            </Row>

            <Row label="Gęstość UI">
              <Pills<Density>
                value={settings.density}
                onChange={v => set('density', v)}
                options={[
                  { value: 'comfortable', label: 'Komfortowa' },
                  { value: 'compact', label: 'Kompaktowa' },
                ]}
              />
            </Row>
          </Section>

          {/* ── Pisanie ── */}
          <Section title="Pisanie" icon="⌨️">
            <Row label="Widok tekstu">
              <Pills<TextViewMode>
                value={settings.textViewMode}
                onChange={v => set('textViewMode', v)}
                options={[
                  { value: 'sentence', label: 'Zdanie' },
                  { value: 'word', label: 'Słowo' },
                  { value: 'full', label: 'Pełny' },
                ]}
              />
            </Row>
            <Row label="Pokaż klawiaturę" sub="Podświetla następny klawisz">
              <Toggle value={settings.showKeyboard} onChange={v => set('showKeyboard', v)} />
            </Row>
            <Row label="Strefy palców" sub="Koloruje klawisze wg palca">
              <Toggle value={settings.showFingers} onChange={v => set('showFingers', v)} />
            </Row>
          </Section>

          {/* ── Klimat tekstów ── */}
          <Section title="Klimat tekstów" icon="📚">
            <div className="px-4 py-3">
              <p className="text-[11px] text-gray-400 dark:text-gray-600 mb-3">
                Domyślny widok na mapie lekcji.
              </p>
              <div className="flex flex-wrap gap-2">
                {PACK_GROUPS.map(group => {
                  const isActive = (settings.preferredPackGroups ?? []).includes(group.id as PackGroupId)
                  return (
                    <button
                      key={group.id}
                      onClick={() => {
                        const current: PackGroupId[] = settings.preferredPackGroups ?? []
                        const next = isActive
                          ? current.length > 1 ? current.filter(g => g !== group.id) : current
                          : [...current, group.id as PackGroupId]
                        set('preferredPackGroups', next)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-[var(--accent-500)] border-[var(--accent-500)] text-white'
                          : 'bg-gray-100 dark:bg-[#1e1e1e] border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      <span>{group.icon}</span>
                      <span>{group.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Section>

          {/* ── Zaawansowane toggle ── */}
          <button
            onClick={() => setAdvancedOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-xs font-medium text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-[#3a3a3a] transition-all"
          >
            <span>Zaawansowane</span>
            <span className="text-gray-400 dark:text-gray-600 transition-transform duration-200" style={{ display: 'inline-block', transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          </button>

          {/* ── Advanced content ── */}
          {advancedOpen && (
            <div className="space-y-6">

              {/* Układ i dźwięki */}
              <Section title="Układ i dźwięki">
                <Row label="Układ klawiatury" sub="Wizualny układ klawiszy i przypisanie palców">
                  <Pills<KeyboardLayout>
                    value={settings.keyboardLayout}
                    onChange={v => set('keyboardLayout', v)}
                    options={(Object.keys(LAYOUTS) as KeyboardLayout[]).map(id => ({ value: id, label: LAYOUTS[id].label }))}
                  />
                </Row>
                <Row label="Dźwięki klawiatury">
                  <Pills<SoundProfile>
                    value={settings.soundProfile}
                    onChange={v => set('soundProfile', v)}
                    options={[
                      { value: 'off', label: 'Wył.' },
                      { value: 'mechanical', label: 'Mech.' },
                      { value: 'soft', label: 'Cichy' },
                      { value: 'typewriter', label: 'Retro' },
                      { value: 'deep', label: 'Głęboki' },
                    ]}
                  />
                </Row>
                <Row label="Blokuj wklejanie" sub="Zapobiega nabijaniu wyników">
                  <Toggle value={settings.blockPaste} onChange={v => set('blockPaste', v)} />
                </Row>
                <Row label="Tryb spokojny" sub="Łagodniejsze kolory błędów, mniej dominujące WPM">
                  <Toggle value={settings.calmMode} onChange={v => set('calmMode', v)} />
                </Row>
              </Section>

              {/* Audio / Blind Flow */}
              <Section title="Audio / Blind Flow" icon="🔊">
                <Row label="Prędkość lektora">
                  <Pills<VoiceRate>
                    value={settings.voiceRate}
                    onChange={v => set('voiceRate', v)}
                    options={[
                      { value: 0.75, label: '0.75×' },
                      { value: 1, label: '1×' },
                      { value: 1.25, label: '1.25×' },
                      { value: 1.5, label: '1.5×' },
                    ]}
                  />
                </Row>
                <Row label="Tryb lektora">
                  <Pills<VoiceMode>
                    value={settings.voiceMode}
                    onChange={v => set('voiceMode', v)}
                    options={[
                      { value: 'all', label: 'Cały tekst' },
                      { value: 'sentence', label: 'Zdanie' },
                    ]}
                  />
                </Row>
                <Row label="Podpowiedź zdania w Blind Flow" sub="Pokazuje pierwsze słowa aktualnego zdania">
                  <Toggle value={settings.blindHint} onChange={v => set('blindHint', v)} />
                </Row>
              </Section>

              {/* Nagrywanie */}
              <Section title="Nagrywanie głosem" icon="🎙️">
                <div className="px-4 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <span className="text-gray-400 dark:text-gray-600">Web Speech API</span>
                    <span className={speechSupported ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                      {speechSupported ? 'Dostępne' : 'Niedostępne'}
                    </span>

                    <span className="text-gray-400 dark:text-gray-600">Przeglądarka</span>
                    <span className={`${browser === 'brave' || browser === 'firefox' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {BROWSER_LABELS[browser]}
                      {browser === 'brave' && ' ⚠️'}
                      {browser === 'firefox' && ' ⚠️'}
                    </span>

                    {micPerm && (
                      <>
                        <span className="text-gray-400 dark:text-gray-600">Mikrofon</span>
                        <span className={micPerm === 'granted' ? 'text-green-600 dark:text-green-400' : micPerm === 'denied' ? 'text-red-500' : 'text-gray-500'}>
                          {micLabel[micPerm]}
                        </span>
                      </>
                    )}
                  </div>

                  {(browser === 'brave' || browser === 'firefox') && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-lg px-3 py-2 leading-relaxed">
                      {browser === 'brave'
                        ? 'Brave blokuje Google Speech API nawet po wyłączeniu Shields. Użyj Chrome dla nagrywania głosem.'
                        : 'Firefox nie obsługuje Web Speech API. Użyj Chrome.'}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
                    Nagrywanie głosem zależy od Google Speech API w przeglądarce.
                  </p>
                </div>
              </Section>

              {/* Dane */}
              <Section title="Dane" icon="🗄️">
                <div className="px-4 py-3 space-y-3">
                  {cleared ? (
                    <p className="text-xs text-green-600 dark:text-green-400">Historia sesji wyczyszczona.</p>
                  ) : confirmClear ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Usunąć całą historię sesji? Nie można cofnąć.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClearHistory}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition"
                        >
                          Tak, usuń
                        </button>
                        <button
                          onClick={() => setConfirmClear(false)}
                          className="flex-1 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2e2e2e] text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClear(true)}
                      className="w-full py-2.5 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2e2e2e] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
                    >
                      Wyczyść historię sesji
                    </button>
                  )}

                  {confirmReset ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Przywrócić ustawienia domyślne?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleResetSettings}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition"
                        >
                          Tak, resetuj
                        </button>
                        <button
                          onClick={() => setConfirmReset(false)}
                          className="flex-1 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2e2e2e] text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmReset(true)}
                      className="w-full py-2.5 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2e2e2e] border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl transition"
                    >
                      Resetuj ustawienia
                    </button>
                  )}
                </div>
              </Section>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

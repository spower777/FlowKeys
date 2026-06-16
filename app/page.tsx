'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import TextInput from '@/components/TextInput'
import VoiceInput from '@/components/VoiceInput'
import TransformOptions from '@/components/TransformOptions'
import TypingSession from '@/components/TypingSession'
import ResultsPanel from '@/components/ResultsPanel'
import SettingsModal from '@/components/SettingsModal'
import { analyzeTyping } from '@/lib/analyzeTyping'
import { saveSession } from '@/lib/storage'
import { EXAMPLE_TEXT } from '@/lib/transformPrompt'
import { loadSettings, saveSettings, applySettingsToDOM, DEFAULTS } from '@/lib/settings'
import type { TransformMode, TypingMode, TypingStats } from '@/lib/types'
import type { Settings } from '@/lib/settings'

type Step = 'home' | 'input' | 'transform' | 'preview' | 'typing' | 'results'
type InputMethod = 'paste' | 'voice' | 'example'

export default function Home() {
  const [step, setStep] = useState<Step>('home')
  const [inputMethod, setInputMethod] = useState<InputMethod>('paste')
  const [sourceText, setSourceText] = useState('')
  const [trainingText, setTrainingText] = useState('')
  const [transformMode, setTransformMode] = useState<TransformMode>('exercise')
  const [typingMode, setTypingMode] = useState<TypingMode>('normal')
  const [stats, setStats] = useState<TypingStats | null>(null)
  const [typedText, setTypedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [transformError, setTransformError] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(DEFAULTS)

  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    applySettingsToDOM(s)

    // Keep theme in sync when system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const current = loadSettings()
      if (current.theme === 'system') applySettingsToDOM(current)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function handleSettingsChange(partial: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      applySettingsToDOM(next)
      return next
    })
  }

  async function handleTransform() {
    if (transformMode === '1to1') {
      setTrainingText(sourceText)
      setIsMock(false)
      setStep('preview')
      return
    }
    setLoading(true)
    setTransformError(null)
    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, mode: transformMode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Błąd serwera')
      setTrainingText(data.result)
      setIsMock(data.mock === true)
      setStep('preview')
    } catch (err) {
      setTransformError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  function handleFinish(typed: string, start: number, end: number) {
    const s = analyzeTyping(trainingText, typed, start, end)
    setTypedText(typed)
    setStats(s)
    saveSession({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      sourceText,
      trainingText,
      typedText: typed,
      mode: transformMode,
      typingMode,
      stats: s,
    })
    setStep('results')
  }

  function reset() {
    setStep('home')
    setSourceText('')
    setTrainingText('')
    setTypedText('')
    setStats(null)
    setTransformError(null)
    setIsMock(false)
  }

  function repeatRound() {
    setTypedText('')
    setStats(null)
    setStep('typing')
  }

  function pickExample() {
    setSourceText(EXAMPLE_TEXT)
    setInputMethod('example')
    setStep('transform')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <Header onHomeClick={reset} onSettingsClick={() => setSettingsOpen(true)} />

        {/* ── HOME ── */}
        {step === 'home' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-6">
              Wklej tekst, nagraj wspomnienie albo zacznij od przykładu. AI zamieni to w ćwiczenie pisania.
            </p>
            {[
              {
                id: 'paste' as InputMethod,
                icon: '✍️',
                label: 'Wklej własny tekst',
                sub: 'Notatka, wspomnienie, fragment czegokolwiek',
                action: () => { setInputMethod('paste'); setStep('input') },
              },
              {
                id: 'voice' as InputMethod,
                icon: '🎙️',
                label: 'Nagraj historię głosem',
                sub: 'Transkrypcja przez Web Speech API',
                action: () => { setInputMethod('voice'); setStep('input') },
              },
              {
                id: 'example' as InputMethod,
                icon: '📖',
                label: 'Użyj przykładowego tekstu',
                sub: 'Szybki start bez własnego materiału',
                action: pickExample,
              },
            ].map(item => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center gap-4 bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] border border-gray-200 dark:border-[#242424] hover:border-gray-300 dark:hover:border-[#333] rounded-2xl px-5 py-4 text-left transition group"
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
                <span className="text-gray-400 dark:text-gray-700 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition shrink-0">›</span>
              </button>
            ))}
          </div>
        )}

        {/* ── INPUT ── */}
        {step === 'input' && (
          <div className="space-y-5">
            <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">← Wróć</button>
            <h2 className="text-lg font-semibold">Twój tekst</h2>
            {inputMethod === 'voice' && (
              <VoiceInput onTranscript={t => setSourceText(prev => prev ? prev + ' ' + t : t)} />
            )}
            <TextInput
              value={sourceText}
              onChange={setSourceText}
              onSubmit={() => setStep('transform')}
            />
          </div>
        )}

        {/* ── TRANSFORM ── */}
        {step === 'transform' && (
          <div className="space-y-5">
            <button onClick={() => setStep(inputMethod === 'example' ? 'home' : 'input')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">← Wróć</button>
            <div>
              <h2 className="text-lg font-semibold">Tryb transformacji</h2>
              <p className="text-sm text-gray-500 mt-1">Jak AI ma przetworzyć Twój tekst?</p>
            </div>
            {transformError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-xl px-4 py-3">
                {transformError}
              </div>
            )}
            <TransformOptions
              selected={transformMode}
              onChange={setTransformMode}
              onConfirm={handleTransform}
              loading={loading}
            />
          </div>
        )}

        {/* ── PREVIEW ── */}
        {step === 'preview' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('transform')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">← Wróć</button>
              {isMock && (
                <span className="text-[10px] font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25 px-2.5 py-1 rounded-full">
                  Mock mode — brak OPENAI_API_KEY
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Tekst treningowy</h2>
              <p className="text-sm text-gray-500 mt-1">{trainingText.trim().split(/\s+/).length} słów · {trainingText.length} znaków</p>
            </div>
            <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {trainingText}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">Wybierz tryb pisania:</p>
              {[
                { mode: 'normal' as TypingMode, label: 'Start normalnie', sub: 'Tekst widoczny, pełna kontrola' },
                { mode: 'blind' as TypingMode, label: 'Start Blind Flow', sub: 'Tekst znika — lektor czyta zdania' },
                { mode: 'no_backspace' as TypingMode, label: 'Start No Backspace', sub: 'Nie poprawiasz — jedziemy dalej' },
              ].map(item => (
                <button
                  key={item.mode}
                  onClick={() => { setTypingMode(item.mode); setStep('typing') }}
                  className="w-full flex items-center gap-4 bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] border border-gray-200 dark:border-[#242424] hover:border-blue-300 dark:hover:border-blue-500/30 rounded-xl px-5 py-3.5 text-left transition group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-gray-400 dark:text-gray-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition shrink-0">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TYPING ── */}
        {step === 'typing' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('preview')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition">← Porzuć rundę</button>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] px-3 py-1 rounded-full">
                {typingMode === 'normal' ? 'Normal' : typingMode === 'blind' ? 'Blind Flow' : 'No Backspace'}
              </span>
            </div>
            <TypingSession
              trainingText={trainingText}
              typingMode={typingMode}
              textViewMode={settings.textViewMode}
              onTextViewModeChange={v => handleSettingsChange({ textViewMode: v })}
              blockPaste={settings.blockPaste}
              calmMode={settings.calmMode}
              blindHint={settings.blindHint}
              voiceRate={settings.voiceRate}
              voiceMode={settings.voiceMode}
              onFinish={handleFinish}
            />
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === 'results' && stats && (
          <ResultsPanel
            stats={stats}
            trainingText={trainingText}
            typedText={typedText}
            transformMode={transformMode}
            typingMode={typingMode}
            onNewRound={reset}
            onRepeat={repeatRound}
          />
        )}
      </div>

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onChange={handleSettingsChange}
        />
      )}
    </main>
  )
}

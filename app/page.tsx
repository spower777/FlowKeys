'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import TextInput from '@/components/TextInput'
import VoiceInput from '@/components/VoiceInput'
import TransformOptions from '@/components/TransformOptions'
import TypingSession from '@/components/TypingSession'
import ResultsPanel from '@/components/ResultsPanel'
import SettingsModal from '@/components/SettingsModal'
import { analyzeTyping, computeCorrectedPositions } from '@/lib/analyzeTyping'
import { saveSession, getSessions } from '@/lib/storage'
import { getLibrary, saveCustomText, recordLibrarySession } from '@/lib/library'
import { EXAMPLE_TEXT } from '@/lib/transformPrompt'
import { loadSettings, saveSettings, applySettingsToDOM, DEFAULTS } from '@/lib/settings'
import { updateLessonProgress, checkAndUnlockBadges, lessonModeToTypingMode, calculateStars } from '@/lib/lessonProgress'
import { badges } from '@/data/badges'
import { lessons } from '@/data/lessons'
import { chapters } from '@/data/chapters'
import type { TransformMode, TypingMode, TypingStats, ReplayEvent, TypingSessionRecord } from '@/lib/types'
import type { Settings } from '@/lib/settings'
import type { FlowLesson, LessonMode } from '@/data/lessons'
import type { BadgeSummary } from '@/components/ResultsPanel'

type Step = 'home' | 'input' | 'transform' | 'preview' | 'typing' | 'results'
type InputMethod = 'paste' | 'voice' | 'example'

export default function Home() {
  const router = useRouter()
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
  const [currentLesson, setCurrentLesson] = useState<FlowLesson | null>(null)
  const [newBadges, setNewBadges] = useState<BadgeSummary[]>([])
  const [earnedStars, setEarnedStars] = useState<0|1|2|3>(0)
  const [lastReplayData, setLastReplayData] = useState<ReplayEvent[]>([])
  const [lastSession, setLastSession] = useState<TypingSessionRecord | null>(null)
  const [currentLibraryTextId, setCurrentLibraryTextId] = useState<string | null>(null)
  const [libraryCount, setLibraryCount] = useState(0)

  // Load last session + library count whenever returning to home
  useEffect(() => {
    if (step === 'home') {
      try { setLastSession(getSessions()[0] ?? null) } catch {}
      try { setLibraryCount(getLibrary().length) } catch {}
    }
  }, [step])

  // Launch lesson / library text from localStorage signal
  useEffect(() => {
    try {
      const libRaw = localStorage.getItem('flowkeys_pending_library_text')
      if (libRaw) {
        localStorage.removeItem('flowkeys_pending_library_text')
        const pending = JSON.parse(libRaw) as { id: string; text: string; title: string }
        setSourceText(pending.text)
        setTrainingText(pending.text)
        setTransformMode('1to1')
        setTypingMode('normal')
        setCurrentLesson(null)
        setCurrentLibraryTextId(pending.id)
        setStep('typing')
        return
      }
      const raw = localStorage.getItem('flowkeys_pending_lesson')
      if (!raw) return
      localStorage.removeItem('flowkeys_pending_lesson')
      const pending = JSON.parse(raw) as { id: number; text: string; mode: LessonMode; title: string; typingMode?: TypingMode }
      const lesson = lessons.find(l => l.id === pending.id) ?? null
      setSourceText(pending.text)
      setTrainingText(pending.text)
      setTransformMode('1to1')
      setTypingMode(pending.typingMode ?? lessonModeToTypingMode(pending.mode))
      setCurrentLesson(lesson)
      setStep('typing')
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    applySettingsToDOM(s)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const current = loadSettings()
      if (current.theme === 'system') applySettingsToDOM(current)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Esc exits focus mode (typing → preview)
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setStep('preview')
  }, [])
  useEffect(() => {
    if (step !== 'typing') return
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [step, handleEsc])

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

  function handleFinish(typed: string, start: number, end: number, backspaceCount: number, replayData: ReplayEvent[]) {
    const s = analyzeTyping(trainingText, typed, start, end, backspaceCount)
    setTypedText(typed)
    setStats(s)
    setLastReplayData(replayData)
    const sessionId = Date.now().toString()
    saveSession({
      id: sessionId,
      createdAt: new Date().toISOString(),
      sourceText,
      trainingText,
      typedText: typed,
      mode: transformMode,
      typingMode,
      lessonId: currentLesson?.id,
      libraryTextId: currentLibraryTextId ?? undefined,
      stats: s,
      replayData,
    })
    if (currentLibraryTextId) {
      const corrected = replayData?.length
        ? computeCorrectedPositions(trainingText, replayData).size
        : 0
      const firstHit = corrected > 0 && s.charsTyped > 0
        ? Math.min(99, Math.round(((s.charsTyped - corrected) / s.charsTyped) * 100))
        : s.accuracy
      recordLibrarySession(currentLibraryTextId, s, typingMode, firstHit)
    }
    if (currentLesson !== null) {
      updateLessonProgress(currentLesson.id, s)
      setEarnedStars(calculateStars(s))
    }
    // Check badges after every session, not just lesson sessions
    const unlockedIds = checkAndUnlockBadges(badges)
    if (unlockedIds.length > 0) {
      const badgeObjects: BadgeSummary[] = unlockedIds
        .map(id => badges.find(b => b.id === id))
        .filter((b): b is typeof badges[0] => !!b)
        .map(b => ({ icon: b.icon, title: b.title, description: b.description }))
      setNewBadges(badgeObjects)
    }
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
    setCurrentLesson(null)
    setCurrentLibraryTextId(null)
    setNewBadges([])
    setEarnedStars(0)
  }

  function handleSaveToLibrary(title: string) {
    const saved = saveCustomText({ title, text: trainingText, tags: [], mood: '' })
    if (stats) {
      recordLibrarySession(saved.id, stats, typingMode)
    }
    setCurrentLibraryTextId(saved.id)
  }

  function repeatRound() {
    setTypedText('')
    setStats(null)
    setStep('typing')
  }

  function handleResultAction(action: 'blind' | 'no_backspace' | 'next_lesson') {
    setTypedText('')
    setStats(null)
    setNewBadges([])
    setEarnedStars(0)
    if (action === 'blind') { setTypingMode('blind'); setStep('typing') }
    else if (action === 'no_backspace') { setTypingMode('no_backspace'); setStep('typing') }
    else if (action === 'next_lesson' && currentLesson) {
      const next = lessons.find(l => l.id === currentLesson.id + 1) ?? null
      if (next) {
        setSourceText(next.text); setTrainingText(next.text)
        setTransformMode('1to1'); setTypingMode(lessonModeToTypingMode(next.mode))
        setCurrentLesson(next); setStep('typing')
      }
    }
  }

  function handleContinue() {
    if (!lastSession) return
    if (lastSession.lessonId != null) {
      const lesson = lessons.find(l => l.id === lastSession.lessonId) ?? null
      if (lesson) {
        setSourceText(lesson.text)
        setTrainingText(lesson.text)
        setTransformMode('1to1')
        setTypingMode(lessonModeToTypingMode(lesson.mode))
        setCurrentLesson(lesson)
        setStep('typing')
        return
      }
    }
    setSourceText(lastSession.trainingText)
    setTrainingText(lastSession.trainingText)
    setTransformMode(lastSession.mode)
    setTypingMode(lastSession.typingMode)
    setCurrentLesson(null)
    setStep('typing')
  }

  function pickExample() {
    setSourceText(EXAMPLE_TEXT)
    setInputMethod('example')
    setStep('transform')
  }

  const isFocus = step === 'typing'

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100">
      <div className={`mx-auto px-4 ${step === 'results' ? 'max-w-5xl py-10 sm:py-16' : isFocus ? 'max-w-4xl py-6' : step === 'home' ? 'max-w-4xl py-10 sm:py-16' : 'max-w-3xl py-10 sm:py-16'}`}>
        {!isFocus && <Header onHomeClick={reset} onSettingsClick={() => setSettingsOpen(true)} />}

        {/* ── HOME ── */}
        {step === 'home' && (
          <div className="space-y-5 relative">

            {/* Kontynuuj — tylko dla powracających użytkowników */}
            {lastSession && (() => {
              const lessonTitle = lastSession.lessonId != null
                ? (lessons.find(l => l.id === lastSession.lessonId)?.title ?? `Lekcja ${lastSession.lessonId}`)
                : 'Twój ostatni tekst'
              const dateStr = new Date(lastSession.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
              return (
                <button
                  onClick={handleContinue}
                  className="animate-fade-up w-full flex items-center gap-4 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white rounded-2xl px-6 py-5 text-left transition-all duration-200 hover:shadow-xl hover:shadow-[var(--accent-600)]/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none group"
                  style={{ animationDelay: '0ms' }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
                    ▶
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-65 mb-0.5">Kontynuuj gdzie skończyłeś</p>
                    <p className="text-base font-bold leading-tight truncate">{lessonTitle}</p>
                    <p className="text-xs opacity-60 mt-0.5">
                      {lastSession.stats.wpm} WPM · {lastSession.stats.accuracy}% · {dateStr}
                    </p>
                  </div>
                  <span className="shrink-0 text-2xl opacity-70 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              )
            })()}

            {/* Invisible cat trail — łapki pojawiają się sekwencyjnie */}
            {[
              { top: '4%',   right: '9%',  left: undefined, rot: -14, delay: 250  },
              { top: '10%',  right: '3%',  left: undefined, rot: 22,  delay: 480  },
              { top: '17%',  right: '13%', left: undefined, rot: -8,  delay: 710  },
              { top: '23%',  right: undefined, left: '4%',  rot: 18,  delay: 940  },
              { top: '30%',  right: undefined, left: '10%', rot: -22, delay: 1170 },
              { top: '37%',  right: undefined, left: '2%',  rot: 14,  delay: 1400 },
              { top: '45%',  right: '6%',  left: undefined, rot: -16, delay: 1630 },
              { top: '53%',  right: '14%', left: undefined, rot: 20,  delay: 1860 },
              { top: '61%',  right: undefined, left: '7%',  rot: -10, delay: 2090 },
              { top: '68%',  right: undefined, left: '13%', rot: 18,  delay: 2320 },
              { top: '76%',  right: '5%',  left: undefined, rot: -20, delay: 2550 },
              { top: '83%',  right: '11%', left: undefined, rot: 12,  delay: 2780 },
              { top: '90%',  right: undefined, left: '3%',  rot: -16, delay: 3010 },
              { top: '96%',  right: undefined, left: '9%',  rot: 22,  delay: 3240 },
            ].map((paw, i) => (
              <div
                key={i}
                className="absolute pointer-events-none select-none z-30"
                style={{ top: paw.top, right: paw.right ?? undefined, left: paw.left ?? undefined, transform: `rotate(${paw.rot}deg)` }}
                aria-hidden
              >
                <span className="text-lg block" style={{ animation: `pawFadeIn 0.35s ease-out ${paw.delay}ms both` }}>🐾</span>
              </div>
            ))}

            {/* Big Logo / Brand */}
            <div
              className="animate-fade-up relative overflow-hidden rounded-3xl border border-[var(--accent-100)] dark:border-[var(--accent-600)]/20 bg-gradient-to-br from-[var(--accent-50)] via-white to-white dark:from-[var(--accent-600)]/10 dark:via-[#111] dark:to-[#0d0d0d] px-10 py-10"
              style={{ animationDelay: '60ms' }}
            >
              {/* Decorative keyboard rows */}
              <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-2 opacity-[0.07] dark:opacity-[0.10] pointer-events-none select-none" aria-hidden>
                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                  <div key={i} className="flex gap-1.5" style={{ paddingLeft: `${i * 12}px` }}>
                    {row.split('').map(k => (
                      <span key={k} className="text-[11px] font-mono border border-current rounded-md px-1.5 py-0.5 leading-tight">{k}</span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,var(--accent-100),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_20%_60%,var(--accent-600)/12%,transparent_65%)] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">⌨️</span>
                  <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-none">
                    FlowKeys
                  </h1>
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                  Zamień własny tekst, wspomnienia i notatki w&nbsp;trening na klawiaturze. Z pomocą AI.
                </p>
              </div>
            </div>

            {/* Action cards */}
            <div className="space-y-2.5">
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
                  sub: 'Nagraj głosem — transkrypcja przez Whisper AI',
                  action: () => { setInputMethod('voice'); setStep('input') },
                },
                {
                  id: 'example' as InputMethod,
                  icon: '📖',
                  label: 'Użyj przykładowego tekstu',
                  sub: 'Szybki start bez własnego materiału',
                  action: pickExample,
                },
              ].map((item, i) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="animate-fade-up w-full flex items-center gap-5 bg-white dark:bg-[#161616] hover:bg-[var(--accent-50)]/60 dark:hover:bg-[#1d1d1d] border border-gray-200 dark:border-[#242424] hover:border-[var(--accent-300)] dark:hover:border-[var(--accent-600)]/40 rounded-2xl px-6 py-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none group"
                  style={{ animationDelay: `${140 + i * 70}ms` }}
                >
                  <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                  {/* paw on hover */}
                  <span className="shrink-0 text-xl w-6 text-center transition-all duration-200 text-gray-300 dark:text-gray-700 group-hover:text-[var(--accent-400)]">
                    <span className="group-hover:hidden">›</span>
                    <span className="hidden group-hover:inline animate-paw-pop">🐾</span>
                  </span>
                </button>
              ))}

              {/* Moja Biblioteka */}
              <button
                onClick={() => router.push('/library')}
                className="animate-fade-up w-full flex items-center gap-5 bg-white dark:bg-[#161616] hover:bg-violet-50/40 dark:hover:bg-[#1d1d1d] border border-gray-200 dark:border-[#242424] hover:border-violet-300 dark:hover:border-violet-500/30 rounded-2xl px-6 py-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none group"
                style={{ animationDelay: '365ms' }}
              >
                <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200">📚</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Moja Biblioteka</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    {libraryCount > 0
                      ? `${libraryCount} ${libraryCount === 1 ? 'tekst' : libraryCount < 5 ? 'teksty' : 'tekstów'} · Teksty, do których warto wracać`
                      : 'Wracaj do tekstów, które coś znaczą'}
                  </p>
                </div>
                <span className="shrink-0 text-xl w-6 text-center transition-all duration-200 text-gray-300 dark:text-gray-700 group-hover:text-violet-400">
                  <span className="group-hover:hidden">›</span>
                  <span className="hidden group-hover:inline animate-paw-pop">📖</span>
                </span>
              </button>
            </div>

            {/* Odkryj — ciche linki, nie pitch deck */}
            <div
              className="animate-fade-up flex flex-wrap gap-x-4 gap-y-1.5 px-1"
              style={{ animationDelay: '360ms' }}
            >
              {([
                { label: '100+ lekcji',   icon: '📚', action: () => router.push('/lessons') },
                { label: 'Blind Flow',    icon: '🙈', action: () => router.push('/lessons') },
                { label: 'Nagraj głosem', icon: '🎙️', action: () => { setInputMethod('voice'); setStep('input') } },
                { label: 'Odznaki',       icon: '🏅', action: () => router.push('/badges') },
                { label: 'Historia',      icon: '📊', action: () => router.push('/history') },
                { label: 'Biblioteka',    icon: '📖', action: () => router.push('/library') },
              ] as { label: string; icon: string; action: () => void }[]).map(feat => (
                <button
                  key={feat.label}
                  onClick={feat.action}
                  className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-[var(--accent-500)] dark:hover:text-[var(--accent-400)] transition-colors duration-150"
                >
                  <span className="text-[11px]">{feat.icon}</span>{feat.label}
                </button>
              ))}
              <span className="text-gray-300 dark:text-gray-700 text-xs select-none">🐾</span>
            </div>

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

        {/* ── TYPING (focus mode) ── */}
        {step === 'typing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentLesson) router.push('/lessons')
                  else if (currentLibraryTextId) router.push('/library')
                  else reset()
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 transition"
              >
                ← {currentLesson ? 'Lekcje' : currentLibraryTextId ? 'Biblioteka' : 'Porzuć rundę'}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-600 select-none">Esc — wyjdź</span>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] px-3 py-1 rounded-full">
                  {typingMode === 'normal' ? 'Normal' : typingMode === 'blind' ? 'Blind Flow' : 'No Backspace'}
                </span>
              </div>
            </div>

            {currentLesson && (() => {
              const chapterTitle = chapters.find(c => c.id === currentLesson.chapterId)?.title ?? ''
              return (
                <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-3.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-600 tabular-nums">
                      {String(currentLesson.id).padStart(3, '0')}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentLesson.title}</span>
                    {currentLesson.subtitle && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">— {currentLesson.subtitle}</span>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <span className="text-[10px] text-gray-400 dark:text-gray-600">Rozdz. {currentLesson.chapterId} · {chapterTitle}</span>
                      {typingMode === 'blind' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full border font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/25">
                          🙈 Blind
                        </span>
                      )}
                      {typingMode === 'no_backspace' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full border font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/25">
                          ⌫ No BS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 dark:text-gray-600 select-none">
                    <span>★ &nbsp;acc 85%</span>
                    <span>★★ acc 94% + spokój 80</span>
                    <span>★★★ acc 98% + spokój 90</span>
                  </div>
                </div>
              )
            })()}
            <TypingSession
              trainingText={trainingText}
              typingMode={typingMode}
              textViewMode={settings.textViewMode}
              onTextViewModeChange={v => handleSettingsChange({ textViewMode: v })}
              showKeyboard={settings.showKeyboard}
              showFingers={settings.showFingers}
              keyboardSounds={settings.keyboardSounds}
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
            newBadges={newBadges}
            earnedStars={earnedStars}
            lessonId={currentLesson?.id}
            hasNextLesson={!!currentLesson && !!lessons.find(l => l.id === (currentLesson.id + 1))}
            replayData={lastReplayData}
            libraryTextId={currentLibraryTextId}
            onSaveToLibrary={handleSaveToLibrary}
            onNewRound={reset}
            onRepeat={repeatRound}
            onAction={handleResultAction}
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

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import AudioControls from './AudioControls'
import type { TypingMode } from '@/lib/types'

interface Props {
  trainingText: string
  typingMode: TypingMode
  onFinish: (typed: string, startTime: number, endTime: number) => void
}

export default function TypingSession({ trainingText, typingMode, onFinish }: Props) {
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [textHidden, setTextHidden] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pasteBlocked, setPasteBlocked] = useState(false)
  const [dropBlocked, setDropBlocked] = useState(false)

  const captureRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pasteToastRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropToastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isBlind = typingMode === 'blind'
  const isNoBackspace = typingMode === 'no_backspace'

  useEffect(() => {
    captureRef.current?.focus()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pasteToastRef.current) clearTimeout(pasteToastRef.current)
      if (dropToastRef.current) clearTimeout(dropToastRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Re-focus capture div after Blind mode hides the text
  useEffect(() => {
    if (textHidden) captureRef.current?.focus()
  }, [textHidden])

  function startTimer() {
    const t = Date.now()
    setStartTime(t)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - t) / 1000))
    }, 1000)
  }

  function showPasteToast() {
    setPasteBlocked(true)
    if (pasteToastRef.current) clearTimeout(pasteToastRef.current)
    pasteToastRef.current = setTimeout(() => setPasteBlocked(false), 2500)
  }

  function showDropToast() {
    setDropBlocked(true)
    if (dropToastRef.current) clearTimeout(dropToastRef.current)
    dropToastRef.current = setTimeout(() => setDropBlocked(false), 2500)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Extra layer: block paste shortcuts even before onPaste fires
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault()
      showPasteToast()
      return
    }

    // Keep focus inside (don't let Tab escape)
    if (e.key === 'Tab') {
      e.preventDefault()
      return
    }

    if (isNoBackspace && e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      setTyped(prev => prev.slice(0, -1))
      return
    }

    // Accept only single printable characters — no Ctrl/Meta combos
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault() // prevent page scroll on Space, etc.
      if (!startTime) {
        startTimer()
        if (isBlind) setTextHidden(true)
      }
      setTyped(prev => prev + e.key)
    }
  }

  // Belt-and-suspenders: onPaste prevents right-click → Paste and other paste paths
  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    showPasteToast()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    showDropToast()
  }

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    window.speechSynthesis?.cancel()
    onFinish(typed, startTime ?? Date.now(), Date.now())
  }, [typed, startTime, onFinish])

  const progress = trainingText.length > 0
    ? Math.min(100, Math.round((typed.length / trainingText.length) * 100))
    : 0
  const wpmLive = startTime && elapsed > 0
    ? Math.round((typed.length / 5) / (elapsed / 60))
    : 0
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-5">
      {/* Mode badges */}
      {isNoBackspace && (
        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl px-4 py-2.5 text-center">
          Backspace wyłączony. Nie poprawiaj. Jedź dalej.
        </div>
      )}
      {isBlind && (
        <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 border border-purple-200 dark:border-purple-400/20 rounded-xl px-4 py-2.5 text-center">
          Tekst znika. Piszesz. Analiza przyjdzie później.
        </div>
      )}

      {/* Toasts */}
      {pasteBlocked && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-2.5 text-center">
          Wklejanie wyłączone w rundzie treningowej.
        </div>
      )}
      {dropBlocked && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-2.5 text-center">
          Przeciąganie tekstu jest wyłączone w rundzie treningowej.
        </div>
      )}

      {/* Audio for Blind mode */}
      {isBlind && <AudioControls text={trainingText} />}

      {/*
        Controlled typing engine.
        A single <div tabIndex={0}> captures ALL keyboard input.
        No textarea — no native paste/drop/autocorrect.
        typedText grows only via onKeyDown, one character at a time.
      */}
      <div
        ref={captureRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`relative bg-gray-100 dark:bg-[#141414] border rounded-2xl px-5 py-5 cursor-text outline-none transition-colors ${
          focused
            ? 'border-blue-400 dark:border-blue-500/40'
            : 'border-gray-200 dark:border-[#242424]'
        }`}
      >
        {textHidden ? (
          /* Blind mode body — source text hidden, show keystroke count */
          <div className="flex items-center justify-center h-20">
            <p className="text-sm font-mono text-gray-400 dark:text-gray-600 select-none">
              {typed.length > 0 ? `${typed.length} znaków…` : 'Słuchaj i pisz…'}
            </p>
          </div>
        ) : (
          /* Normal mode — source text with per-character colour feedback */
          <div className="text-sm leading-7 font-mono break-words whitespace-pre-wrap select-none">
            {trainingText.split('').map((char, i) => {
              const typed_i = typed[i]
              const isTyped = i < typed.length
              const isCurrent = i === typed.length
              const isCorrect = isTyped && typed_i === char
              const isWrong = isTyped && typed_i !== char

              return (
                <span
                  key={i}
                  className={
                    isCurrent
                      ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white'
                      : isCorrect
                      ? 'text-green-600 dark:text-green-400'
                      : isWrong
                      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 dark:text-gray-500'
                  }
                >
                  {char}
                </span>
              )
            })}
            {/* Blinking caret when all source text is covered */}
            {typed.length >= trainingText.length && trainingText.length > 0 && (
              <span className="animate-pulse text-blue-500">▌</span>
            )}
          </div>
        )}

        {/* "Click to type" overlay — only before first keystroke */}
        {!focused && typed.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-50/80 dark:bg-black/50">
            <p className="text-xs text-gray-400 dark:text-gray-600 select-none">Kliknij, żeby pisać</p>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="tabular-nums">{fmtTime(elapsed)}</span>
        <div className="flex-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{progress}%</span>
        {wpmLive > 0 && <span className="tabular-nums">{wpmLive} wpm</span>}
      </div>

      <button
        onClick={handleFinish}
        disabled={typed.length === 0}
        className="w-full py-3 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] disabled:opacity-30 border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
      >
        Zakończ rundę
      </button>
    </div>
  )
}

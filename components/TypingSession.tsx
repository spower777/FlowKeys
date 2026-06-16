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
  const [pasteBlocked, setPasteBlocked] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pasteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isBlind = typingMode === 'blind'
  const isNoBackspace = typingMode === 'no_backspace'

  useEffect(() => {
    textareaRef.current?.focus()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pasteTimerRef.current) clearTimeout(pasteTimerRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  function startTimer() {
    const t = Date.now()
    setStartTime(t)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - t) / 1000))
    }, 1000)
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    if (!startTime) {
      startTimer()
      if (isBlind) setTextHidden(true)
    }
    setTyped(val)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isNoBackspace && e.key === 'Backspace') {
      e.preventDefault()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setPasteBlocked(true)
    if (pasteTimerRef.current) clearTimeout(pasteTimerRef.current)
    pasteTimerRef.current = setTimeout(() => setPasteBlocked(false), 2500)
  }

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    window.speechSynthesis?.cancel()
    onFinish(typed, startTime ?? Date.now(), Date.now())
  }, [typed, startTime, onFinish])

  const progress = Math.min(100, Math.round((typed.length / trainingText.length) * 100))
  const wpmLive = startTime && elapsed > 0
    ? Math.round((typed.length / 5) / (elapsed / 60))
    : 0

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-5">
      {/* Mode badge */}
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

      {/* Paste blocked notification */}
      {pasteBlocked && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-2.5 text-center">
          Wklejanie wyłączone w rundzie treningowej.
        </div>
      )}

      {/* Audio for Blind mode */}
      {isBlind && <AudioControls text={trainingText} />}

      {/* Source text display */}
      {!textHidden && (
        <div className="bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-[#242424] rounded-2xl px-5 py-5">
          <div className="text-sm leading-7 font-mono break-words whitespace-pre-wrap">
            {trainingText.split('').map((char, i) => {
              const isTypedPos = i < typed.length
              const isCurrent = i === typed.length
              const isCorrect = isTypedPos && typed[i] === char
              const isWrong = isTypedPos && typed[i] !== char

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
          </div>
        </div>
      )}

      {/* Typing area */}
      <textarea
        ref={textareaRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Zacznij pisać..."
        className="w-full h-36 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2e2e2e] focus:border-blue-400 dark:focus:border-blue-500/40 rounded-2xl px-5 py-4 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-700 resize-none focus:outline-none text-sm leading-relaxed font-mono"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{fmtTime(elapsed)}</span>
        <div className="flex-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full h-1">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{progress}%</span>
        {wpmLive > 0 && <span>{wpmLive} wpm</span>}
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

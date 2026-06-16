'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isBlind = typingMode === 'blind'
  const isNoBackspace = typingMode === 'no_backspace'

  useEffect(() => {
    textareaRef.current?.focus()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
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

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
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
        <div className="text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-2.5 text-center">
          Backspace wyłączony. Jedziemy dalej.
        </div>
      )}
      {isBlind && textHidden && (
        <div className="text-xs text-purple-400/80 bg-purple-400/10 border border-purple-400/20 rounded-xl px-4 py-2.5 text-center">
          Tekst znika. Piszesz. Analiza przyjdzie później.
        </div>
      )}

      {/* Source text display */}
      <div
        className={`bg-[#141414] border border-[#242424] rounded-2xl px-5 py-5 transition-all duration-700 ${
          textHidden ? 'opacity-[0.04] select-none pointer-events-none' : ''
        }`}
        aria-hidden={textHidden}
      >
        <div className="text-sm leading-7 font-mono break-words whitespace-pre-wrap">
          {trainingText.split('').map((char, i) => {
            const isTyped = i < typed.length
            const isCurrent = i === typed.length
            const isCorrect = isTyped && typed[i] === char
            const isWrong = isTyped && typed[i] !== char

            return (
              <span
                key={i}
                className={
                  isCurrent
                    ? 'border-b-2 border-blue-400 text-white'
                    : isCorrect
                    ? 'text-green-400/80'
                    : isWrong
                    ? 'text-red-400 bg-red-900/20'
                    : 'text-gray-500'
                }
              >
                {char}
              </span>
            )
          })}
        </div>
      </div>

      {/* Typing area */}
      <textarea
        ref={textareaRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Zacznij pisać..."
        className="w-full h-36 bg-[#1a1a1a] border border-[#2e2e2e] focus:border-blue-500/40 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-700 resize-none focus:outline-none text-sm leading-relaxed font-mono"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{fmtTime(elapsed)}</span>
        <div className="flex-1 bg-[#1a1a1a] rounded-full h-1">
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
        className="w-full py-3 bg-[#1e1e1e] hover:bg-[#282828] disabled:opacity-30 border border-[#2e2e2e] text-gray-300 text-sm font-medium rounded-xl transition"
      >
        Zakończ rundę
      </button>
    </div>
  )
}

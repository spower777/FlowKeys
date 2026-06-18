'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import type { ReplayEvent } from '@/lib/types'
import VirtualKeyboard from './VirtualKeyboard'

interface Props {
  replayData: ReplayEvent[]
  trainingText: string
  onClose: () => void
}

const SPEEDS = [1, 2, 4] as const
type Speed = typeof SPEEDS[number]

export default function ReplayModal({ replayData, trainingText, onClose }: Props) {
  const [speed, setSpeed] = useState<Speed>(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [replayTyped, setReplayTyped] = useState('')
  const [isDone, setIsDone] = useState(false)
  const speedRef = useRef<Speed>(1)

  // Normalize timestamps to start at 0
  const events = useMemo(() => {
    if (!replayData.length) return []
    const t0 = replayData[0].ts
    return replayData.map(e => ({ ...e, relTs: e.ts - t0 }))
  }, [replayData])

  // Keep speedRef in sync with speed state (for use inside effect closure)
  useEffect(() => { speedRef.current = speed }, [speed])

  // Core playback engine: fires on each currentIdx change while playing
  useEffect(() => {
    if (!isPlaying) return
    if (currentIdx >= events.length) {
      setIsPlaying(false)
      setIsDone(true)
      return
    }

    const ev = events[currentIdx]
    const prevEv = currentIdx > 0 ? events[currentIdx - 1] : null
    const rawDelay = prevEv ? ev.relTs - prevEv.relTs : 0
    // Cap long pauses at 800ms (1x) and enforce 10ms minimum
    const delay = Math.max(10, Math.min(rawDelay / speedRef.current, 800 / speedRef.current))

    const timer = setTimeout(() => {
      setReplayTyped(prev => {
        if (ev.isBackspace) return prev.slice(0, -1)
        if (ev.char.length === 1) return prev + ev.char
        return prev
      })
      setCurrentIdx(i => i + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [isPlaying, currentIdx, events])

  function play() {
    if (isDone) reset()
    setIsPlaying(true)
  }
  function pause() { setIsPlaying(false) }
  function reset() {
    setIsPlaying(false)
    setCurrentIdx(0)
    setReplayTyped('')
    setIsDone(false)
  }
  function changeSpeed(s: Speed) {
    setSpeed(s)
    speedRef.current = s
  }

  const cursorPos = replayTyped.length
  const progress = events.length > 0 ? Math.round((currentIdx / events.length) * 100) : 0
  const lastChar = events[currentIdx - 1]?.isBackspace ? undefined : events[currentIdx - 1]?.char

  // Character rendering with colors
  function renderText() {
    const chars = trainingText.split('')
    return chars.map((ch, i) => {
      if (i > cursorPos) return <span key={i} className="text-gray-300 dark:text-gray-700">{ch}</span>
      if (i === cursorPos) return <span key={i} className="border-b-2 border-[var(--accent-500)] text-gray-900 dark:text-white">{ch}</span>
      const typed = replayTyped[i]
      if (typed === ch) return <span key={i} className="text-green-600 dark:text-green-400">{ch}</span>
      return <span key={i} className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20">{ch}</span>
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white dark:bg-[#111] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-[#222]">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Odtwarzanie rundy</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{events.length} zdarzeń · {replayData.length > 0 ? Math.round((replayData[replayData.length - 1].ts - replayData[0].ts) / 1000) : 0}s</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none transition">×</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Speed controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Prędkość:</span>
            <div className="flex gap-1">
              {SPEEDS.map(s => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${speed === s ? 'bg-[var(--accent-500)] text-white' : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Text display */}
          <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl px-5 py-5 min-h-[120px]">
            <p className="text-base leading-8 font-mono break-words whitespace-pre-wrap select-none">
              {renderText()}
              {cursorPos >= trainingText.length && trainingText.length > 0 && (
                <span className="animate-pulse text-[var(--accent-500)]">▌</span>
              )}
            </p>
          </div>

          {/* Virtual keyboard */}
          <VirtualKeyboard
            nextChar={trainingText[cursorPos] ?? ''}
            showFingers={false}
            pressedKey={lastChar}
          />

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600">
              <span>{currentIdx} / {events.length} zdarzeń</span>
              <span>{progress}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-[#1a1a1a] rounded-full h-1.5">
              <div className="bg-[var(--accent-500)] h-1.5 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2.5 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-[#2e2e2e] text-gray-600 dark:text-gray-400 text-sm rounded-xl transition"
            >
              ↺ Reset
            </button>
            {isPlaying ? (
              <button
                onClick={pause}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition"
              >
                ⏸ Pauza
              </button>
            ) : (
              <button
                onClick={play}
                disabled={events.length === 0}
                className="flex-1 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] disabled:opacity-30 text-white text-sm font-semibold rounded-xl transition"
              >
                {isDone ? '↺ Odtwórz ponownie' : currentIdx === 0 ? '▶ Odtwórz' : '▶ Kontynuuj'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

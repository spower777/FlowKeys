'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  text: string
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5]

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
}

export default function AudioControls({ text }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [sentences, setSentences] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
    setSentences(splitSentences(text))
    return () => { window.speechSynthesis?.cancel() }
  }, [text])

  const speak = useCallback((idx: number, rate: number) => {
    if (!supported || idx >= sentences.length) return
    window.speechSynthesis.cancel()

    const utt = new SpeechSynthesisUtterance(sentences[idx])
    utt.lang = 'pl-PL'
    utt.rate = rate

    // Try to pick a Polish voice
    const voices = window.speechSynthesis.getVoices()
    const plVoice = voices.find(v => v.lang.startsWith('pl'))
    if (plVoice) utt.voice = plVoice

    utt.onend = () => setPlaying(false)
    utt.onerror = () => setPlaying(false)

    utteranceRef.current = utt
    window.speechSynthesis.speak(utt)
    setPlaying(true)
    setCurrent(idx)
  }, [supported, sentences])

  function pause() {
    window.speechSynthesis.pause()
    setPlaying(false)
  }

  function resume() {
    window.speechSynthesis.resume()
    setPlaying(true)
  }

  function prev() {
    const idx = Math.max(0, current - 1)
    speak(idx, speed)
  }

  function next() {
    const idx = Math.min(sentences.length - 1, current + 1)
    speak(idx, speed)
  }

  function repeat() {
    speak(current, speed)
  }

  function changeSpeed(s: number) {
    setSpeed(s)
    if (playing) speak(current, s)
  }

  if (supported === null) return null

  if (!supported) {
    return (
      <p className="text-xs text-gray-500 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3">
        Twoja przeglądarka nie obsługuje czytania tekstu.
      </p>
    )
  }

  return (
    <div className="bg-purple-500/8 border border-purple-500/20 rounded-2xl px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-purple-400">Lektor</p>
        <p className="text-xs text-gray-500">{current + 1} / {sentences.length || 1}</p>
      </div>

      {/* Main controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 transition text-sm"
          title="Poprzednie zdanie"
        >
          ⏮
        </button>
        <button
          onClick={repeat}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition text-sm"
          title="Powtórz zdanie"
        >
          🔁
        </button>
        {!playing ? (
          <button
            onClick={() => speaking() ? resume() : speak(current, speed)}
            className="flex-1 h-8 flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition text-sm font-medium gap-1.5"
          >
            ▶ Odtwórz
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex-1 h-8 flex items-center justify-center rounded-lg bg-purple-600/60 hover:bg-purple-600/80 text-white transition text-sm font-medium gap-1.5"
          >
            ⏸ Pauza
          </button>
        )}
        <button
          onClick={next}
          disabled={current >= sentences.length - 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 transition text-sm"
          title="Następne zdanie"
        >
          ⏭
        </button>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-600 mr-1">Prędkość:</span>
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => changeSpeed(s)}
            className={`text-[10px] px-2 py-1 rounded-lg transition font-medium ${
              speed === s
                ? 'bg-purple-600/40 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Current sentence preview */}
      {sentences[current] && (
        <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">
          „{sentences[current]}"
        </p>
      )}
    </div>
  )
}

function speaking() {
  return window.speechSynthesis.paused
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  text: string
  initialRate?: number
  voiceMode?: 'all' | 'sentence'
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5]

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
}

export default function AudioControls({ text, initialRate = 1.0, voiceMode = 'all' }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [noPolishVoice, setNoPolishVoice] = useState(false)
  const [sentences, setSentences] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialRate)

  // Refs so callbacks always read fresh values without re-creating on every state change
  const sentencesRef = useRef<string[]>([])
  const speedRef = useRef(initialRate)
  const autoAdvanceRef = useRef(voiceMode === 'all')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
    const s = splitSentences(text)
    setSentences(s)
    sentencesRef.current = s
    return () => { window.speechSynthesis?.cancel() }
  }, [text])

  useEffect(() => { speedRef.current = speed }, [speed])

  // Check Polish voice availability (async in some browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    function check() {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setNoPolishVoice(!voices.some(v => v.lang.startsWith('pl')))
      }
    }
    check()
    window.speechSynthesis.onvoiceschanged = check
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  // Named function so it can reference itself recursively without stale closure issues.
  // All mutable values are read from refs.
  const speakFrom = useCallback(function speakFn(idx: number) {
    const sents = sentencesRef.current
    const rate = speedRef.current
    if (idx >= sents.length || idx < 0) { setPlaying(false); return }

    window.speechSynthesis.cancel()

    const utt = new SpeechSynthesisUtterance(sents[idx])
    utt.lang = 'pl-PL'
    utt.rate = rate

    const voices = window.speechSynthesis.getVoices()
    const plVoice = voices.find(v => v.lang.startsWith('pl'))
    if (plVoice) utt.voice = plVoice

    utt.onend = () => {
      const nextIdx = idx + 1
      if (autoAdvanceRef.current && nextIdx < sentencesRef.current.length) {
        setCurrent(nextIdx)
        speakFn(nextIdx)
      } else {
        setPlaying(false)
      }
    }
    utt.onerror = (e) => {
      // 'interrupted' fires when we cancel() before starting next — not a real error
      if ((e as SpeechSynthesisErrorEvent).error !== 'interrupted') setPlaying(false)
    }

    utteranceRef.current = utt
    window.speechSynthesis.speak(utt)
    setPlaying(true)
    setCurrent(idx)
  }, []) // empty deps — reads everything from refs

  function playAll() {
    autoAdvanceRef.current = true
    speakFrom(current)
  }

  function repeatOne() {
    autoAdvanceRef.current = false
    speakFrom(current)
  }

  function prev() {
    autoAdvanceRef.current = false
    const idx = Math.max(0, current - 1)
    speakFrom(idx)
  }

  function next() {
    autoAdvanceRef.current = false
    const idx = Math.min(sentencesRef.current.length - 1, current + 1)
    speakFrom(idx)
  }

  function pause() {
    window.speechSynthesis.pause()
    setPlaying(false)
  }

  function resume() {
    window.speechSynthesis.resume()
    setPlaying(true)
  }

  function handlePlayPause() {
    if (playing) {
      pause()
    } else if (window.speechSynthesis.paused) {
      resume()
    } else {
      playAll()
    }
  }

  function changeSpeed(s: number) {
    setSpeed(s)
    speedRef.current = s
    if (playing) {
      autoAdvanceRef.current = true
      speakFrom(current)
    }
  }

  if (supported === null) return null

  if (!supported) {
    return (
      <p className="text-xs text-gray-600 dark:text-gray-500 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3">
        Twoja przeglądarka nie obsługuje czytania tekstu.
      </p>
    )
  }

  return (
    <div className="bg-purple-50 dark:bg-purple-500/8 border border-purple-200 dark:border-purple-500/20 rounded-2xl px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Lektor</p>
        <p className="text-xs text-gray-500">{current + 1} / {sentences.length || 1}</p>
      </div>

      {noPolishVoice && (
        <p className="text-[10px] text-amber-600 dark:text-amber-500">
          Polski głos niedostępny w tej przeglądarce.
        </p>
      )}

      {/* Main controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { prev(); e.currentTarget.blur() }}
          disabled={current === 0}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200/60 dark:bg-white/5 hover:bg-gray-300/60 dark:hover:bg-white/10 disabled:opacity-30 text-gray-600 dark:text-gray-300 transition text-sm"
          title="Poprzednie zdanie"
        >
          ⏮
        </button>
        <button
          onClick={(e) => { repeatOne(); e.currentTarget.blur() }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200/60 dark:bg-white/5 hover:bg-gray-300/60 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition text-sm"
          title="Powtórz zdanie"
        >
          🔁
        </button>
        <button
          onClick={(e) => { handlePlayPause(); e.currentTarget.blur() }}
          className={`flex-1 h-8 flex items-center justify-center rounded-lg text-white transition text-sm font-medium gap-1.5 ${
            playing
              ? 'bg-purple-500 dark:bg-purple-600/60 hover:bg-purple-600 dark:hover:bg-purple-600/80'
              : 'bg-purple-600 hover:bg-purple-500'
          }`}
        >
          {playing ? '⏸ Pauza' : '▶ Odtwórz'}
        </button>
        <button
          onClick={(e) => { next(); e.currentTarget.blur() }}
          disabled={current >= sentences.length - 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200/60 dark:bg-white/5 hover:bg-gray-300/60 dark:hover:bg-white/10 disabled:opacity-30 text-gray-600 dark:text-gray-300 transition text-sm"
          title="Następne zdanie"
        >
          ⏭
        </button>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 dark:text-gray-600 mr-1">Prędkość:</span>
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={(e) => { changeSpeed(s); e.currentTarget.blur() }}
            className={`text-[10px] px-2 py-1 rounded-lg transition font-medium ${
              speed === s
                ? 'bg-purple-100 dark:bg-purple-600/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Current sentence preview */}
      {sentences[current] && (
        <p className="text-xs text-gray-500 dark:text-gray-500 italic leading-relaxed line-clamp-2">
          „{sentences[current]}&rdquo;
        </p>
      )}
    </div>
  )
}

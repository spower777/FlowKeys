'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import AudioControls from './AudioControls'
import TextViewToggle from './TextViewToggle'
import VirtualKeyboard from './VirtualKeyboard'
import { playKeySound } from '@/lib/keyboardSounds'
import { normalizeDashes } from '@/lib/analyzeTyping'
import type { TypingMode, TextViewMode, ReplayEvent } from '@/lib/types'
import type { SoundProfile } from '@/lib/settings'

interface Props {
  trainingText: string
  typingMode: TypingMode
  textViewMode: TextViewMode
  onTextViewModeChange: (mode: TextViewMode) => void
  onFinish: (typed: string, startTime: number, endTime: number, backspaceCount: number, replayData: ReplayEvent[]) => void
  showKeyboard?: boolean
  showFingers?: boolean
  soundProfile?: SoundProfile
  blockPaste?: boolean
  calmMode?: boolean
  blindHint?: boolean
  voiceRate?: number
  voiceMode?: 'all' | 'sentence'
}

// ── sentence helper ──────────────────────────────────────────────────────────
// Returns the char range [start, end) of the sentence containing `pos`,
// plus progress counters. Trailing spaces are included so the cursor
// transitions naturally into the next sentence.

function sentenceAt(text: string, pos: number) {
  const sents: Array<{ start: number; end: number }> = []
  let start = 0
  for (let i = 0; i < text.length; i++) {
    if ('.!?…'.includes(text[i])) {
      let next = i + 1
      while (next < text.length && text[next] === ' ') next++
      sents.push({ start, end: next })
      start = next
      i = next - 1
    }
  }
  if (start < text.length) sents.push({ start, end: text.length })
  if (sents.length === 0) return { range: { start: 0, end: text.length }, num: 1, total: 1 }

  for (let i = 0; i < sents.length; i++) {
    if (pos < sents[i].end) return { range: sents[i], num: i + 1, total: sents.length }
  }
  const last = sents[sents.length - 1]
  return { range: last, num: sents.length, total: sents.length }
}

// ── word helper ──────────────────────────────────────────────────────────────
// Returns the char range [start, end) of the word the cursor sits in/before,
// a sliding context window, and word progress counters.

function wordAt(text: string, pos: number) {
  // Word boundaries around cursor
  let wStart = pos
  while (wStart > 0 && text[wStart - 1] !== ' ' && text[wStart - 1] !== '\n') wStart--
  let wEnd = pos
  while (wEnd < text.length && text[wEnd] !== ' ' && text[wEnd] !== '\n') wEnd++

  // Slide window: 2 words before + current + 4 words after
  let viewStart = wStart
  let back = 0
  let i = wStart - 1
  while (i >= 0 && back < 2) {
    while (i >= 0 && text[i] === ' ') i--
    if (i < 0) break
    while (i > 0 && text[i - 1] !== ' ') i--
    viewStart = i
    back++
    i--
  }

  let viewEnd = wEnd
  let fwd = 0
  let j = wEnd
  while (j < text.length && fwd < 4) {
    while (j < text.length && text[j] === ' ') j++
    if (j >= text.length) break
    while (j < text.length && text[j] !== ' ') j++
    fwd++
    viewEnd = j
  }

  // Word progress
  const totalWords = text.trim().split(/\s+/).filter(Boolean).length
  const before = text.slice(0, pos).trim()
  const wordNum = before === '' ? 1 : Math.min(before.split(/\s+/).filter(Boolean).length, totalWords)

  return {
    range: { start: wStart, end: wEnd },
    view: { start: viewStart, end: viewEnd },
    wordNum,
    totalWords,
    wordText: text.slice(wStart, wEnd),
  }
}

// ── component ────────────────────────────────────────────────────────────────

export default function TypingSession({
  trainingText: trainingText_raw, typingMode, textViewMode, onTextViewModeChange, onFinish,
  showKeyboard = false, showFingers = false, soundProfile = 'off',
  blockPaste = true, calmMode = false, blindHint = true,
  voiceRate = 1, voiceMode = 'all',
}: Props) {
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [textHidden, setTextHidden] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pasteBlocked, setPasteBlocked] = useState(false)
  const [dropBlocked, setDropBlocked] = useState(false)
  const [backspaceCount, setBackspaceCount] = useState(0)

  const [cursorHidden, setCursorHidden] = useState(false)

  const captureRef = useRef<HTMLDivElement>(null)
  const cursorSpanRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pasteToastRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropToastRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const replayRef = useRef<ReplayEvent[]>([])

  const isBlind = typingMode === 'blind'
  const isNoBackspace = typingMode === 'no_backspace'
  const cursorPos = typed.length
  const trainingText = normalizeDashes(trainingText_raw)

  useEffect(() => {
    captureRef.current?.focus()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (pasteToastRef.current) clearTimeout(pasteToastRef.current)
      if (dropToastRef.current) clearTimeout(dropToastRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Auto-scroll current character into view in 'full' mode
  useEffect(() => {
    if (textViewMode === 'full') {
      cursorSpanRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [cursorPos, textViewMode])

  useEffect(() => { if (textHidden) captureRef.current?.focus() }, [textHidden])

  // Sync cursor-hidden state to body class
  useEffect(() => {
    if (cursorHidden) {
      document.body.classList.add('fk-hide-cursor')
    } else {
      document.body.classList.remove('fk-hide-cursor')
    }
    return () => { document.body.classList.remove('fk-hide-cursor') }
  }, [cursorHidden])

  // Show cursor on any mouse movement anywhere on the page
  const showCursor = useCallback(() => {
    setCursorHidden(false)
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', showCursor)
    window.addEventListener('mousedown', showCursor)
    return () => {
      window.removeEventListener('mousemove', showCursor)
      window.removeEventListener('mousedown', showCursor)
    }
  }, [showCursor])

  function hideCursor() {
    setCursorHidden(true)
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null }
  }

  function startTimer() {
    const t = Date.now()
    setStartTime(t)
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - t) / 1000)), 1000)
  }

  function showPasteToast() {
    setPasteBlocked(true)
    if (pasteToastRef.current) clearTimeout(pasteToastRef.current)
    pasteToastRef.current = setTimeout(() => setPasteBlocked(false), 2500)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    hideCursor()
    if (blockPaste && (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault(); showPasteToast(); return
    }
    if (e.key === 'Tab') { e.preventDefault(); return }
    if (isNoBackspace && e.key === 'Backspace') { e.preventDefault(); return }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (soundProfile && soundProfile !== 'off') playKeySound('backspace', soundProfile)
      replayRef.current.push({ ts: Date.now(), char: 'Backspace', isBackspace: true })
      setTyped(prev => prev.slice(0, -1)); setBackspaceCount(c => c + 1); return
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      if (!startTime) { startTimer(); if (isBlind) setTextHidden(true) }
      if (soundProfile && soundProfile !== 'off') {
        if (e.key === ' ') playKeySound('space', soundProfile)
        else if (e.key === trainingText[typed.length]) playKeySound('normal', soundProfile)
        else playKeySound('error', soundProfile)
      }
      replayRef.current.push({ ts: Date.now(), char: e.key, isBackspace: false })
      setTyped(prev => prev + e.key)
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    if (blockPaste) { e.preventDefault(); showPasteToast() }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDropBlocked(true)
    if (dropToastRef.current) clearTimeout(dropToastRef.current)
    dropToastRef.current = setTimeout(() => setDropBlocked(false), 2500)
  }

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    window.speechSynthesis?.cancel()
    onFinish(typed, startTime ?? Date.now(), Date.now(), backspaceCount, replayRef.current)
  }, [typed, startTime, backspaceCount, onFinish])

  useEffect(() => {
    if (trainingText.length > 0 && typed.length >= trainingText.length && startTime !== null) {
      handleFinish()
    }
  }, [typed, trainingText, startTime, handleFinish])

  // ── per-character class ────────────────────────────────────────────────────
  // wordRange is only used in word mode to dim/highlight untyped chars.

  const wData = wordAt(trainingText, cursorPos)

  function cls(absIdx: number, char: string): string {
    const isTyped = absIdx < cursorPos
    const isCurrent = absIdx === cursorPos

    if (isCurrent) return 'border-b-2 border-[var(--accent-500)] text-gray-900 dark:text-white'

    if (isTyped) {
      if (typed[absIdx] === char) return 'text-green-600 dark:text-green-400'
      return calmMode
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    }

    // Untyped — word mode adds dimensional emphasis
    if (textViewMode === 'word') {
      const inWord = absIdx >= wData.range.start && absIdx < wData.range.end
      if (inWord) return 'text-gray-800 dark:text-gray-200 bg-[var(--accent-50)] dark:bg-[var(--accent-600)]/10 rounded-sm'
      if (absIdx < wData.range.start) return 'text-gray-500 dark:text-gray-600'
      return 'text-gray-400 dark:text-gray-600'
    }

    return 'text-gray-400 dark:text-gray-500'
  }

  function renderRange(from: number, to: number) {
    return trainingText.slice(from, to).split('').map((char, rel) => {
      const abs = from + rel
      return (
        <span
          key={abs}
          ref={abs === cursorPos ? cursorSpanRef : undefined}
          className={cls(abs, char)}
        >
          {char}
        </span>
      )
    })
  }

  // ── what to show ──────────────────────────────────────────────────────────

  const sData = sentenceAt(trainingText, cursorPos)
  let textContent: React.ReactNode = null
  let badge: string | null = null

  if (!textHidden) {
    if (textViewMode === 'sentence') {
      badge = `${sData.num} / ${sData.total} zdanie`
      textContent = renderRange(sData.range.start, sData.range.end)
    } else if (textViewMode === 'word') {
      badge = `${wData.wordNum} / ${wData.totalWords} słowo`
      textContent = renderRange(wData.view.start, wData.view.end)
    } else {
      textContent = renderRange(0, trainingText.length)
    }
  }

  // Blind mode hint text: word → current word, sentence → first 2 words
  let blindHintText: string | null = null
  if (blindHint && textHidden && cursorPos > 0 && textViewMode !== 'full') {
    if (textViewMode === 'word') {
      blindHintText = wData.wordText
    } else {
      const firstTwo = trainingText
        .slice(sData.range.start, sData.range.end)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(' ')
      blindHintText = firstTwo + '…'
    }
  }

  // ── stats ─────────────────────────────────────────────────────────────────

  const progress = trainingText.length > 0
    ? Math.min(100, Math.round((cursorPos / trainingText.length) * 100))
    : 0
  const wpmLive = startTime && elapsed > 0
    ? Math.round((cursorPos / 5) / (elapsed / 60))
    : 0
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
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
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-2 text-center">
          Wklejanie wyłączone w rundzie treningowej.
        </div>
      )}
      {dropBlocked && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-2 text-center">
          Przeciąganie tekstu jest wyłączone w rundzie treningowej.
        </div>
      )}

      {/* Audio */}
      {isBlind && <AudioControls text={trainingText} initialRate={voiceRate} voiceMode={voiceMode} />}

      {/* View mode toggle + sentence/word progress */}
      {!textHidden && (
        <div className="flex items-center justify-between">
          <TextViewToggle value={textViewMode} onChange={onTextViewModeChange} />
          {badge && (
            <span className="text-[10px] text-gray-400 dark:text-gray-600 tabular-nums">{badge}</span>
          )}
        </div>
      )}

      {/* Typing capture — the only keyboard input path */}
      <div
        ref={captureRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`relative bg-gray-100 dark:bg-[#141414] border rounded-2xl px-5 py-5 outline-none transition-colors ${
          focused ? 'border-[var(--accent-400)] dark:border-[var(--accent-600)]/40' : 'border-gray-200 dark:border-[#242424]'
        }`}
      >
        {textHidden ? (
          /* Blind mode body */
          <div className="flex flex-col items-center justify-center h-20 gap-2">
            <p className="text-sm font-mono text-gray-400 dark:text-gray-600 select-none">
              {cursorPos > 0 ? `${cursorPos} znaków…` : 'Słuchaj i pisz…'}
            </p>
            {blindHintText && (
              <p className="text-xs text-purple-400/70 dark:text-purple-500/60 font-mono select-none tracking-wide">
                → {blindHintText}
              </p>
            )}
          </div>
        ) : (
          /* Source text display — max-height in full mode keeps keyboard on-screen */
          <div className={`text-xl leading-loose font-mono break-words whitespace-pre-wrap select-none ${
            textViewMode === 'full' ? 'max-h-[300px] overflow-y-auto' : ''
          }`}>
            {textContent}
            {cursorPos >= trainingText.length && trainingText.length > 0 && (
              <span className="animate-pulse text-blue-500">▌</span>
            )}
          </div>
        )}

        {/* Click-to-focus overlay — only before first keystroke */}
        {!focused && cursorPos === 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-50/80 dark:bg-black/50">
            <p className="text-xs text-gray-400 dark:text-gray-600 select-none">Kliknij, żeby pisać</p>
          </div>
        )}
      </div>

      {/* Virtual keyboard */}
      {showKeyboard && !isBlind && (
        <VirtualKeyboard
          nextChar={trainingText[cursorPos] ?? ''}
          showFingers={showFingers}
        />
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="tabular-nums">{fmtTime(elapsed)}</span>
        <div className="flex-1 bg-gray-200 dark:bg-[#1a1a1a] rounded-full h-1">
          <div className="bg-[var(--accent-600)] h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
        {wpmLive > 0 && (
          <span className={`tabular-nums ${calmMode ? 'text-gray-400 dark:text-gray-600' : ''}`}>
            {wpmLive} wpm
          </span>
        )}
      </div>

      <button
        onClick={handleFinish}
        disabled={cursorPos === 0}
        className="w-full py-3 bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#282828] disabled:opacity-30 border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
      >
        Zakończ rundę
      </button>
    </div>
  )
}

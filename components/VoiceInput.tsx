'use client'

import { useState, useRef } from 'react'

type State = 'idle' | 'recording' | 'transcribing' | 'done' | 'error'

interface Props {
  onTranscript: (text: string) => void
}

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function VoiceInput({ onTranscript }: Props) {
  const [state, setState] = useState<State>('idle')
  const [transcript, setTranscript] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  async function startRecording() {
    setErrorMsg(null)
    setTranscript('')
    setElapsed(0)

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      const name = err instanceof Error ? err.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMsg('Brak dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki i macOS.')
      } else if (name === 'NotFoundError') {
        setErrorMsg('Mikrofon niedostępny. Sprawdź czy jest podłączony.')
      } else {
        setErrorMsg('Nie udało się uzyskać dostępu do mikrofonu.')
      }
      setState('error')
      return
    }

    streamRef.current = stream
    chunksRef.current = []

    const mimeType = ['audio/webm', 'audio/ogg', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t)) ?? ''
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    recorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
      await transcribeBlob(blob, recorder.mimeType)
    }

    recorder.start(1000)
    setState('recording')
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }

  function stopRecording() {
    stopTimer()
    recorderRef.current?.stop()
    setState('transcribing')
  }

  async function transcribeBlob(blob: Blob, mimeType: string) {
    const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm'
    const file = new File([blob], `recording.${ext}`, { type: mimeType || 'audio/webm' })

    const fd = new FormData()
    fd.append('audio', file)

    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Błąd transkrypcji.')
        setState('error')
        return
      }
      setTranscript(data.text ?? '')
      setState('done')
    } catch {
      setErrorMsg('Nie udało się połączyć z serwerem transkrypcji.')
      setState('error')
    }
  }

  function useTranscript() {
    const t = transcript.trim()
    if (t) onTranscript(t)
  }

  const canStart = state === 'idle' || state === 'error' || state === 'done'

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        {canStart && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#242424] border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {state === 'done' ? 'Nagraj ponownie' : 'Start nagrywania'}
          </button>
        )}

        {state === 'recording' && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Stop · {fmtTime(elapsed)}
          </button>
        )}

        {state === 'transcribing' && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2e2e2e] text-gray-500 dark:text-gray-500 text-sm rounded-xl">
            <span className="inline-block animate-spin">⟳</span>
            Transkrybuję…
          </div>
        )}

        {state === 'done' && transcript.trim() && (
          <button
            onClick={useTranscript}
            className="px-4 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-400)] text-white text-sm font-medium rounded-xl transition"
          >
            Użyj transkrypcji
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {transcript && (
        <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2e2e2e] rounded-2xl px-5 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[80px]">
          {transcript}
        </div>
      )}
    </div>
  )
}

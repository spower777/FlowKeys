'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    setSupported(!!(w['SpeechRecognition'] ?? w['webkitSpeechRecognition']))
  }, [])

  function startRecording() {
    setErrorMsg(null)
    setTranscript('')

    const w = window as unknown as Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (w['SpeechRecognition'] ?? w['webkitSpeechRecognition']) as any
    if (!SR) return

    // Null out old handlers before aborting — prevents stale onend from
    // firing setRecording(false) after the new session's setRecording(true).
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null
      recognitionRef.current.onerror = null
      recognitionRef.current.onend = null
      recognitionRef.current.abort()
    }

    const recognition = new SR()
    recognition.lang = 'pl-PL'
    recognition.continuous = true
    recognition.interimResults = true

    let full = ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          full += e.results[i][0].transcript + ' '
        } else {
          interim = e.results[i][0].transcript
        }
      }
      setTranscript(full + interim)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error === 'aborted') return
      setRecording(false)
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        setErrorMsg('Brak dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki i macOS.')
      } else if (e.error === 'audio-capture') {
        setErrorMsg('Mikrofon niedostępny. Sprawdź czy jest podłączony.')
      } else if (e.error === 'no-speech') {
        if (!full.trim()) setErrorMsg('Nie udało się rozpoznać mowy. Spróbuj jeszcze raz albo wklej tekst ręcznie.')
      } else if (e.error === 'network') {
        setErrorMsg('Błąd sieci. Rozpoznawanie mowy wymaga połączenia z internetem.')
      } else {
        setErrorMsg(`Błąd nagrywania (${e.error}). Spróbuj odświeżyć stronę.`)
      }
    }

    recognition.onend = () => { setRecording(false) }

    // Set ref before start() so stopRecording() can reach the new instance
    // even if start() fires onend synchronously on some browsers.
    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setErrorMsg('Nie udało się uruchomić nagrywania. Odśwież stronę i spróbuj ponownie.')
      return
    }

    setRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  function useTranscript() {
    const t = transcript.trim()
    if (!t) return
    onTranscript(t)
  }

  if (supported === null) return null

  if (!supported) {
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2e2e2e] rounded-2xl px-5 py-4">
        Rozpoznawanie mowy nie jest dostępne w tej przeglądarce. Najlepiej użyj Chrome albo wklej tekst ręcznie.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#242424] border border-gray-200 dark:border-[#2e2e2e] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Start nagrywania
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Stop
          </button>
        )}
        {transcript.trim() && !recording && (
          <button
            onClick={useTranscript}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition"
          >
            Użyj transkrypcji
          </button>
        )}
      </div>

      {/* Error as UI message, never as transcript text */}
      {errorMsg && (
        <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* Live transcript preview */}
      {transcript && (
        <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2e2e2e] rounded-2xl px-5 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[80px]">
          {transcript}
          {recording && <span className="animate-pulse ml-1 text-gray-400 dark:text-gray-500">|</span>}
        </div>
      )}
    </div>
  )
}

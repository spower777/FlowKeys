'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    setSupported(!!(w['SpeechRecognition'] ?? w['webkitSpeechRecognition']))
  }, [])

  function startRecording() {
    const w = window as unknown as Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (w['SpeechRecognition'] ?? w['webkitSpeechRecognition']) as any
    if (!SR) return

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

    recognition.onerror = () => setRecording(false)
    recognition.onend = () => setRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
    setTranscript('')
    full = ''
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  function useTranscript() {
    onTranscript(transcript)
  }

  if (supported === null) return null

  if (!supported) {
    return (
      <p className="text-sm text-gray-500 bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-5 py-4">
        Twoja przeglądarka nie obsługuje rozpoznawania mowy. Wklej tekst ręcznie.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#242424] border border-[#2e2e2e] text-gray-300 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Start nagrywania
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Stop
          </button>
        )}
        {transcript && !recording && (
          <button
            onClick={useTranscript}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition"
          >
            Użyj transkrypcji
          </button>
        )}
      </div>
      {transcript && (
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl px-5 py-4 text-sm text-gray-300 leading-relaxed min-h-[80px]">
          {transcript}
          {recording && <span className="animate-pulse ml-1 text-gray-500">|</span>}
        </div>
      )}
    </div>
  )
}

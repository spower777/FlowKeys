import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Brak klucza OpenAI API. Transkrypcja niedostępna.' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane formularza.' }, { status: 400 })
  }

  const audioFile = formData.get('audio') as File | null
  if (!audioFile || audioFile.size === 0) {
    return NextResponse.json({ error: 'Brak pliku audio.' }, { status: 400 })
  }

  try {
    const openai = new OpenAI({ apiKey })
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pl',
    })
    return NextResponse.json({ text: transcription.text })
  } catch (err) {
    console.error('Whisper transcription error:', err)
    return NextResponse.json({ error: 'Transkrypcja nie powiodła się. Spróbuj ponownie.' }, { status: 500 })
  }
}

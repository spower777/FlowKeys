import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SYSTEM_PROMPT, getUserPrompt } from '@/lib/transformPrompt'
import type { TransformMode } from '@/lib/types'

const MOCK_RESPONSES: Record<TransformMode, string> = {
  '1to1': '',
  clean: '[MOCK] Poprawiony tekst — brak klucza OPENAI_API_KEY. Skonfiguruj zmienną środowiskową aby używać AI.',
  story: '[MOCK] Pewnego dnia użytkownik nie skonfigurował klucza API. Siedział przed ekranem i zastanawiał się, co poszło nie tak. W końcu otworzył plik .env.local i dodał OPENAI_API_KEY. Wszystko zaczęło działać.',
  exercise: '[MOCK] Klucz API nie jest skonfigurowany. Dodaj plik .env.local z wartością OPENAI_API_KEY. Możesz wkleić własny tekst i ćwiczyć w trybie jeden do jednego. Tryb AI będzie dostępny po konfiguracji klucza.',
  polish_chars: '[MOCK] Łatwy tekst ćwiczebny. Użytkownik wpisuje słowa: ąkacja, źródło, łąka, ćwiczenie, gęś, żółw, śnieg. Każde słowo zawiera polskie znaki diakrytyczne.',
}

export async function POST(request: Request) {
  const { text, mode } = (await request.json()) as { text: string; mode: TransformMode }

  if (!text?.trim()) return NextResponse.json({ error: 'Brak tekstu' }, { status: 400 })
  if (mode === '1to1') return NextResponse.json({ result: text })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ result: MOCK_RESPONSES[mode] ?? text })
  }

  try {
    const openai = new OpenAI({ apiKey })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: getUserPrompt(text, mode) },
      ],
      max_tokens: 600,
      temperature: 0.7,
    })
    const result = completion.choices[0]?.message?.content?.trim() ?? text
    return NextResponse.json({ result })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Błąd transformacji AI. Spróbuj ponownie.' }, { status: 500 })
  }
}

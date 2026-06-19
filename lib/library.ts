import type { TypingStats, TypingMode } from './types'

const LIBRARY_KEY = 'flowkeys_library'

export const CHUNK_THRESHOLD = 500  // texts longer than this get split
export const CHUNK_TARGET    = 400  // target chunk character size

export function splitIntoChunks(text: string, targetSize = CHUNK_TARGET): string[] {
  const trimmed = text.trim()
  if (trimmed.length <= CHUNK_THRESHOLD) return [trimmed]

  const chunks: string[] = []
  let start = 0

  while (start < trimmed.length) {
    const remaining = trimmed.length - start
    // If what's left fits within 1.5x target, take it all
    if (remaining <= targetSize * 1.5) {
      const tail = trimmed.slice(start).trim()
      if (tail) chunks.push(tail)
      break
    }

    const end = start + targetSize

    // Search backward from `end` for a sentence boundary
    let splitAt = -1
    for (let i = Math.min(end, trimmed.length - 1); i > start + targetSize * 0.4; i--) {
      if ('.!?…'.includes(trimmed[i])) {
        let j = i + 1
        while (j < trimmed.length && trimmed[j] === ' ') j++
        splitAt = j
        break
      }
    }

    // Fall back to word boundary
    if (splitAt === -1) {
      for (let i = end; i > start; i--) {
        if (trimmed[i] === ' ') { splitAt = i + 1; break }
      }
    }

    if (splitAt === -1) splitAt = end

    const chunk = trimmed.slice(start, splitAt).trim()
    if (chunk) chunks.push(chunk)
    start = splitAt
    while (start < trimmed.length && trimmed[start] === ' ') start++
  }

  return chunks.filter(c => c.length > 0)
}

export interface CustomTextSession {
  id: string
  date: string
  wpm: number
  typingAccuracy: number
  finalAccuracy: number
  calmIndex: number
  errors: number
  backspaces: number
  mode: TypingMode
}

export interface CustomText {
  id: string
  title: string
  text: string
  tags: string[]
  mood: string
  createdAt: string
  updatedAt: string
  lastPracticedAt?: string
  practiceCount: number
  bestWpm?: number
  bestAccuracy?: number
  bestCalm?: number
  lastWpm?: number
  lastAccuracy?: number
  lastCalm?: number
  lastChunkIndex?: number
  sessions: CustomTextSession[]
}

export function getLibrary(): CustomText[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY)
    return raw ? (JSON.parse(raw) as CustomText[]) : []
  } catch { return [] }
}

function writeLibrary(lib: CustomText[]): void {
  try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib)) } catch {}
}

export function getCustomText(id: string): CustomText | null {
  return getLibrary().find(t => t.id === id) ?? null
}

export function saveCustomText(data: {
  title: string
  text: string
  tags: string[]
  mood: string
}): CustomText {
  const lib = getLibrary()
  const entry: CustomText = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    practiceCount: 0,
    sessions: [],
  }
  lib.unshift(entry)
  writeLibrary(lib)
  return entry
}

export function updateCustomText(
  id: string,
  updates: Partial<Pick<CustomText, 'title' | 'text' | 'tags' | 'mood'>>
): void {
  const lib = getLibrary()
  const idx = lib.findIndex(t => t.id === id)
  if (idx === -1) return
  lib[idx] = { ...lib[idx], ...updates, updatedAt: new Date().toISOString() }
  writeLibrary(lib)
}

export function deleteCustomText(id: string): void {
  writeLibrary(getLibrary().filter(t => t.id !== id))
}

export function recordLibrarySession(
  id: string,
  stats: TypingStats,
  typingMode: TypingMode,
  firstHitAccuracy?: number,
  chunkIndex?: number
): void {
  const lib = getLibrary()
  const idx = lib.findIndex(t => t.id === id)
  if (idx === -1) return

  const entry = lib[idx]
  const calm = stats.calmScore ?? stats.accuracy
  const session: CustomTextSession = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    wpm: stats.wpm,
    typingAccuracy: firstHitAccuracy ?? stats.accuracy,
    finalAccuracy: stats.accuracy,
    calmIndex: calm,
    errors: stats.mistakesCount,
    backspaces: stats.backspaceCount ?? 0,
    mode: typingMode,
  }

  lib[idx] = {
    ...entry,
    practiceCount: entry.practiceCount + 1,
    lastPracticedAt: session.date,
    lastWpm: stats.wpm,
    lastAccuracy: stats.accuracy,
    lastCalm: calm,
    bestWpm: Math.max(entry.bestWpm ?? 0, stats.wpm),
    bestAccuracy: Math.max(entry.bestAccuracy ?? 0, stats.accuracy),
    bestCalm: Math.max(entry.bestCalm ?? 0, calm),
    updatedAt: session.date,
    lastChunkIndex: chunkIndex !== undefined ? chunkIndex : entry.lastChunkIndex,
    sessions: [session, ...entry.sessions].slice(0, 50),
  }
  writeLibrary(lib)
}

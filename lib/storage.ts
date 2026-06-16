import type { TypingSessionRecord } from './types'

const KEY = 'flowkeys_sessions'

export function saveSession(session: TypingSessionRecord): void {
  try {
    const existing = getSessions()
    existing.unshift(session)
    localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 100)))
  } catch {
    // localStorage may be unavailable
  }
}

export function getSessions(): TypingSessionRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as TypingSessionRecord[]
  } catch {
    return []
  }
}

export function getSession(id: string): TypingSessionRecord | null {
  return getSessions().find(s => s.id === id) ?? null
}

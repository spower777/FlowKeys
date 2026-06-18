import type { TypingSessionRecord, ReplayEvent } from './types'

const SESSIONS_KEY = 'flowkeys_sessions'
const REPLAYS_KEY = 'flowkeys_replays'

function readSessions(): TypingSessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    return raw ? (JSON.parse(raw) as TypingSessionRecord[]) : []
  } catch { return [] }
}

function readReplays(): Record<string, ReplayEvent[]> {
  try {
    const raw = localStorage.getItem(REPLAYS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, ReplayEvent[]>) : {}
  } catch { return {} }
}

export function saveSession(session: TypingSessionRecord): void {
  // Strip replayData from session core — saved separately so it never blocks session writes
  const { replayData, ...core } = session

  try {
    const all = readSessions()
    all.unshift(core)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(all.slice(0, 100)))
  } catch { return }

  // Save replay separately — best-effort, trimmed to last 15 sessions
  if (replayData?.length) {
    try {
      const replays = readReplays()
      replays[session.id] = replayData
      // Keep only replays for the 15 most recent sessions
      const recentIds = new Set(readSessions().slice(0, 15).map(s => s.id))
      const trimmed: Record<string, ReplayEvent[]> = {}
      for (const id of recentIds) {
        if (replays[id]) trimmed[id] = replays[id]
      }
      localStorage.setItem(REPLAYS_KEY, JSON.stringify(trimmed))
    } catch { /* replay storage is best-effort */ }
  }
}

export function getSessions(): TypingSessionRecord[] {
  const sessions = readSessions()
  const replays = readReplays()
  return sessions.map(s => ({
    ...s,
    // prefer separate replay store; fall back to embedded value (old-format sessions)
    replayData: replays[s.id] ?? s.replayData,
  }))
}

export function getSession(id: string): TypingSessionRecord | null {
  return getSessions().find(s => s.id === id) ?? null
}

export function clearSessions(): void {
  try { localStorage.removeItem(SESSIONS_KEY) } catch {}
  try { localStorage.removeItem(REPLAYS_KEY) } catch {}
}

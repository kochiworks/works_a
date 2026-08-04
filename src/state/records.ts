export type MatchResult = 'win' | 'loss' | 'draw'

export type BotRecord = {
  wins: number
  losses: number
  draws: number
}

export type RecordsState = Record<number, BotRecord>

const STORAGE_KEY = 'chess.aiRecords.v1'

function loadInitial(): RecordsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as RecordsState
  } catch {
    // ignore malformed/unavailable storage
  }
  return {}
}

let state: RecordsState = loadInitial()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore write failures (e.g. private browsing quota)
  }
}

function emit() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): RecordsState {
  return state
}

export function recordResult(level: number, result: MatchResult) {
  const current = state[level] ?? { wins: 0, losses: 0, draws: 0 }
  const next: BotRecord = { ...current }
  if (result === 'win') next.wins += 1
  else if (result === 'loss') next.losses += 1
  else next.draws += 1
  state = { ...state, [level]: next }
  persist()
  emit()
}

export type LocalPairRecord = {
  names: [string, string]
  wins: Record<string, number>
  draws: number
}

export type LocalRecordsState = Record<string, LocalPairRecord>

const STORAGE_KEY = 'chess.localRecords.v1'
const SEPARATOR = ' '

function pairKey(nameA: string, nameB: string): string {
  return [nameA, nameB].sort().join(SEPARATOR)
}

function loadInitial(): LocalRecordsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LocalRecordsState
  } catch {
    // ignore malformed/unavailable storage
  }
  return {}
}

let state: LocalRecordsState = loadInitial()
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

export function getSnapshot(): LocalRecordsState {
  return state
}

export function getLocalRecord(nameA: string, nameB: string): LocalPairRecord | undefined {
  return state[pairKey(nameA, nameB)]
}

/** winnerName must equal nameA or nameB, or be null for a draw. */
export function recordLocalResult(nameA: string, nameB: string, winnerName: string | null) {
  const key = pairKey(nameA, nameB)
  const current = state[key] ?? { names: [nameA, nameB] as [string, string], wins: {}, draws: 0 }
  const next: LocalPairRecord = { ...current, wins: { ...current.wins } }
  if (winnerName) {
    next.wins[winnerName] = (next.wins[winnerName] ?? 0) + 1
  } else {
    next.draws += 1
  }
  state = { ...state, [key]: next }
  persist()
  emit()
}

export function resetLocalRecord(nameA: string, nameB: string) {
  const key = pairKey(nameA, nameB)
  if (!state[key]) return
  const next = { ...state }
  delete next[key]
  state = next
  persist()
  emit()
}

export function resetPlayerLocalRecords(playerName: string) {
  const next: LocalRecordsState = {}
  let changed = false
  for (const [key, pair] of Object.entries(state)) {
    if (pair.names.includes(playerName)) {
      changed = true
      continue
    }
    next[key] = pair
  }
  if (!changed) return
  state = next
  persist()
  emit()
}

export function resetAllLocalRecords() {
  state = {}
  persist()
  emit()
}

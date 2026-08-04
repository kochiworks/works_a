export type MatchResult = 'win' | 'loss' | 'draw'

export type BotRecord = {
  wins: number
  losses: number
  draws: number
}

export type PlayerAiRecords = Record<number, BotRecord>
export type AiRecordsState = Record<string, PlayerAiRecords>

const STORAGE_KEY = 'chess.aiRecords.v2'
const DEFAULT_PLAYER_NAME = '플레이어'

function normalizeName(name: string): string {
  return name.trim() || DEFAULT_PLAYER_NAME
}

function loadInitial(): AiRecordsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AiRecordsState
  } catch {
    // ignore malformed/unavailable storage
  }
  return {}
}

let state: AiRecordsState = loadInitial()
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

export function getSnapshot(): AiRecordsState {
  return state
}

export function getPlayerAiRecords(playerName: string): PlayerAiRecords {
  return state[normalizeName(playerName)] ?? {}
}

export function recordResult(playerName: string, level: number, result: MatchResult) {
  const key = normalizeName(playerName)
  const playerRecords = state[key] ?? {}
  const current = playerRecords[level] ?? { wins: 0, losses: 0, draws: 0 }
  const next: BotRecord = { ...current }
  if (result === 'win') next.wins += 1
  else if (result === 'loss') next.losses += 1
  else next.draws += 1
  state = { ...state, [key]: { ...playerRecords, [level]: next } }
  persist()
  emit()
}

export function resetAiRecord(playerName: string, level: number) {
  const key = normalizeName(playerName)
  if (!state[key]) return
  const playerRecords = { ...state[key] }
  delete playerRecords[level]
  state = { ...state, [key]: playerRecords }
  persist()
  emit()
}

export function resetAllAiRecords() {
  state = {}
  persist()
  emit()
}

import { AI_LEVELS } from './engine'

export type BotProfile = {
  level: number
  name: string
  avatar: string
  label: string
}

const BOT_IDENTITY: Record<number, { name: string; avatar: string }> = {
  1: { name: '삐약이', avatar: '🐣' },
  2: { name: '새싹이', avatar: '🌱' },
  3: { name: '코알라', avatar: '🐨' },
  4: { name: '너구리', avatar: '🦝' },
  5: { name: '여우', avatar: '🦊' },
  6: { name: '부엉이', avatar: '🦉' },
  7: { name: '호랑이', avatar: '🐯' },
  8: { name: '매', avatar: '🦅' },
  9: { name: '드래곤', avatar: '🐉' },
  10: { name: '그랜드마스터', avatar: '👑' },
}

export const BOT_PROFILES: BotProfile[] = AI_LEVELS.map((config) => ({
  level: config.level,
  name: BOT_IDENTITY[config.level].name,
  avatar: BOT_IDENTITY[config.level].avatar,
  label: config.label,
}))

export function getBotProfile(level: number): BotProfile {
  const clamped = Math.min(10, Math.max(1, Math.round(level)))
  return BOT_PROFILES[clamped - 1]
}

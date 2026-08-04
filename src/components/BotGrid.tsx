import { BOT_PROFILES } from '../chess/botProfiles'
import type { RecordsState } from '../state/records'

type BotGridProps = {
  selectedLevel: number
  onSelect: (level: number) => void
  records: RecordsState
}

export function BotGrid({ selectedLevel, onSelect, records }: BotGridProps) {
  return (
    <div className="bot-grid" role="group" aria-label="AI 상대 선택">
      {BOT_PROFILES.map((bot) => {
        const record = records[bot.level]
        const hasRecord = record && record.wins + record.losses + record.draws > 0
        return (
          <button
            key={bot.level}
            type="button"
            className={`bot-tile ${selectedLevel === bot.level ? 'active' : ''}`}
            onClick={() => onSelect(bot.level)}
          >
            <span className="bot-avatar" aria-hidden="true">
              {bot.avatar}
            </span>
            <span className="bot-name">{bot.name}</span>
            <span className="bot-level">
              Lv.{bot.level} · {bot.label}
            </span>
            <span className="bot-record">
              {hasRecord ? `${record.wins}승 ${record.losses}패 ${record.draws}무` : '전적 없음'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

import { BOT_PROFILES } from '../chess/botProfiles'
import type { PlayerAiRecords } from '../state/records'

type BotGridProps = {
  selectedLevel: number
  onSelect: (level: number) => void
  records: PlayerAiRecords
  onResetBotRecord: (level: number) => void
}

export function BotGrid({ selectedLevel, onSelect, records, onResetBotRecord }: BotGridProps) {
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
            {hasRecord && (
              <span
                className="bot-tile-reset"
                role="button"
                tabIndex={0}
                aria-label={`${bot.name} 전적 초기화`}
                title="이 상대와의 전적 초기화"
                onClick={(e) => {
                  e.stopPropagation()
                  onResetBotRecord(bot.level)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    e.preventDefault()
                    onResetBotRecord(bot.level)
                  }
                }}
              >
                ×
              </span>
            )}
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

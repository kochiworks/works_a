import type { Color } from 'chess.js'
import { AI_SPEED_PRESETS } from '../chess/engine'
import { getBotProfile } from '../chess/botProfiles'
import { BotGrid } from './BotGrid'
import type { RecordsState } from '../state/records'

export type GameMode = 'local' | 'ai'

type AiSettingsProps = {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  aiLevel: number
  onLevelChange: (level: number) => void
  playerColor: Color
  onPlayerColorChange: (color: Color) => void
  aiMoveDelay: number
  onAiMoveDelayChange: (delayMs: number) => void
  faceToFace: boolean
  onFaceToFaceChange: (faceToFace: boolean) => void
  playerName: string
  onPlayerNameChange: (name: string) => void
  records: RecordsState
}

export function AiSettings({
  mode,
  onModeChange,
  aiLevel,
  onLevelChange,
  playerColor,
  onPlayerColorChange,
  aiMoveDelay,
  onAiMoveDelayChange,
  faceToFace,
  onFaceToFaceChange,
  playerName,
  onPlayerNameChange,
  records,
}: AiSettingsProps) {
  const bot = getBotProfile(aiLevel)

  return (
    <div className="ai-settings">
      <label className="player-name-field">
        <span>내 이름</span>
        <input
          type="text"
          value={playerName}
          maxLength={20}
          placeholder="플레이어"
          onChange={(e) => onPlayerNameChange(e.target.value)}
        />
      </label>

      <div className="mode-toggle" role="group" aria-label="게임 모드">
        <button
          type="button"
          className={mode === 'local' ? 'active' : ''}
          onClick={() => onModeChange('local')}
        >
          2인 플레이
        </button>
        <button
          type="button"
          className={mode === 'ai' ? 'active' : ''}
          onClick={() => onModeChange('ai')}
        >
          AI와 대전
        </button>
      </div>

      {mode === 'ai' && (
        <div className="ai-options">
          <div className="matchup-line">
            <strong>{playerName || '플레이어'}</strong>
            <span className="matchup-vs">vs</span>
            <span className="matchup-bot">
              {bot.avatar} {bot.name}
            </span>
          </div>

          <BotGrid selectedLevel={aiLevel} onSelect={onLevelChange} records={records} />

          <div className="color-choice" role="group" aria-label="내 기물 색상">
            <span>내 기물</span>
            <button
              type="button"
              className={playerColor === 'w' ? 'active' : ''}
              onClick={() => onPlayerColorChange('w')}
            >
              백
            </button>
            <button
              type="button"
              className={playerColor === 'b' ? 'active' : ''}
              onClick={() => onPlayerColorChange('b')}
            >
              흑
            </button>
          </div>

          <div className="speed-choice" role="group" aria-label="AI 착수 속도">
            <span>AI 속도</span>
            {AI_SPEED_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={aiMoveDelay === preset.delayMs ? 'active' : ''}
                onClick={() => onAiMoveDelayChange(preset.delayMs)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'local' && (
        <div className="local-options">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={faceToFace}
              onChange={(e) => onFaceToFaceChange(e.target.checked)}
            />
            <span>
              마주보기 모드
              <small>태블릿을 사이에 두고 마주 앉을 때 상대 기물을 180° 회전합니다</small>
            </span>
          </label>
        </div>
      )}
    </div>
  )
}

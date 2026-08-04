import type { Color } from 'chess.js'
import { AI_LEVELS } from '../chess/engine'

export type GameMode = 'local' | 'ai'

type AiSettingsProps = {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  aiLevel: number
  onLevelChange: (level: number) => void
  playerColor: Color
  onPlayerColorChange: (color: Color) => void
}

export function AiSettings({
  mode,
  onModeChange,
  aiLevel,
  onLevelChange,
  playerColor,
  onPlayerColorChange,
}: AiSettingsProps) {
  const levelConfig = AI_LEVELS[aiLevel - 1]

  return (
    <div className="ai-settings">
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
          <label className="level-picker">
            <span>
              난이도 {aiLevel} · {levelConfig.label}
            </span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={aiLevel}
              onChange={(e) => onLevelChange(Number(e.target.value))}
            />
          </label>

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
        </div>
      )}
    </div>
  )
}

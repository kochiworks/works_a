import type { Color } from 'chess.js'
import { AI_LEVELS, AI_SPEED_PRESETS } from '../chess/engine'

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

import type { Color } from 'chess.js'
import { AI_SPEED_PRESETS } from '../chess/engine'
import { getBotProfile } from '../chess/botProfiles'
import { BotGrid } from './BotGrid'
import { PlayerList, type PlayerSummary } from './PlayerList'
import type { PlayerAiRecords } from '../state/records'
import type { LocalPairRecord } from '../state/localRecords'

export type GameMode = 'local' | 'ai'
export type LocalField = 'p1' | 'p2'

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
  records: PlayerAiRecords
  onResetBotRecord: (level: number) => void
  localPlayer1Name: string
  onLocalPlayer1NameChange: (name: string) => void
  localPlayer2Name: string
  onLocalPlayer2NameChange: (name: string) => void
  localPairRecord: LocalPairRecord | undefined
  onResetLocalPairRecord: () => void
  onResetAllRecords: () => void
  savedPlayers: PlayerSummary[]
  onSelectSavedPlayer: (name: string) => void
  onLocalFieldFocus: (field: LocalField) => void
  onResetPlayer: (name: string) => void
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
  onResetBotRecord,
  localPlayer1Name,
  onLocalPlayer1NameChange,
  localPlayer2Name,
  onLocalPlayer2NameChange,
  localPairRecord,
  onResetLocalPairRecord,
  onResetAllRecords,
  savedPlayers,
  onSelectSavedPlayer,
  onLocalFieldFocus,
  onResetPlayer,
}: AiSettingsProps) {
  const bot = getBotProfile(aiLevel)
  const hasLocalRecord = localPairRecord
    ? Object.values(localPairRecord.wins).reduce((a, b) => a + b, 0) + localPairRecord.draws > 0
    : false

  return (
    <div className="ai-settings">
      <PlayerList
        players={savedPlayers}
        onSelect={onSelectSavedPlayer}
        activeName={mode === 'ai' ? playerName : undefined}
        onResetPlayer={onResetPlayer}
      />

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

          <div className="matchup-line">
            <strong>{playerName || '플레이어'}</strong>
            <span className="matchup-vs">vs</span>
            <span className="matchup-bot">
              {bot.avatar} {bot.name}
            </span>
          </div>

          <BotGrid
            selectedLevel={aiLevel}
            onSelect={onLevelChange}
            records={records}
            onResetBotRecord={onResetBotRecord}
          />

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
          <div className="local-players">
            <label className="player-name-field">
              <span>플레이어 1 (백)</span>
              <input
                type="text"
                value={localPlayer1Name}
                maxLength={20}
                placeholder="플레이어1"
                onChange={(e) => onLocalPlayer1NameChange(e.target.value)}
                onFocus={() => onLocalFieldFocus('p1')}
              />
            </label>
            <label className="player-name-field">
              <span>플레이어 2 (흑)</span>
              <input
                type="text"
                value={localPlayer2Name}
                maxLength={20}
                placeholder="플레이어2"
                onChange={(e) => onLocalPlayer2NameChange(e.target.value)}
                onFocus={() => onLocalFieldFocus('p2')}
              />
            </label>
          </div>

          {hasLocalRecord && localPairRecord && (
            <div className="local-record-row">
              <span>
                {localPairRecord.names[0]}: {localPairRecord.wins[localPairRecord.names[0]] ?? 0}승{' '}
                {localPairRecord.wins[localPairRecord.names[1]] ?? 0}패 {localPairRecord.draws}무 ·{' '}
                {localPairRecord.names[1]}: {localPairRecord.wins[localPairRecord.names[1]] ?? 0}승{' '}
                {localPairRecord.wins[localPairRecord.names[0]] ?? 0}패 {localPairRecord.draws}무
              </span>
              <button type="button" className="record-reset-btn" onClick={onResetLocalPairRecord}>
                초기화
              </button>
            </div>
          )}

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

      <button type="button" className="reset-all-btn" onClick={onResetAllRecords}>
        전체 전적 초기화
      </button>
    </div>
  )
}

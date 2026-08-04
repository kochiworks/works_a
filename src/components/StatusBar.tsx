import type { Color } from 'chess.js'
import type { GameStatus } from '../chess/useChessGame'

const COLOR_KO: Record<Color, string> = { w: '백', b: '흑' }

function statusText(status: GameStatus, turn: Color): string {
  switch (status) {
    case 'checkmate':
      return `체크메이트! ${COLOR_KO[turn === 'w' ? 'b' : 'w']} 승리`
    case 'stalemate':
      return '스테일메이트 - 무승부'
    case 'draw':
      return '무승부'
    case 'check':
      return `${COLOR_KO[turn]} 차례 - 체크!`
    default:
      return `${COLOR_KO[turn]} 차례`
  }
}

type StatusBarProps = {
  status: GameStatus
  turn: Color
  aiThinking?: boolean
}

export function StatusBar({ status, turn, aiThinking }: StatusBarProps) {
  const isAlert = status === 'checkmate' || status === 'check'
  return (
    <div className={`status-bar ${isAlert ? 'alert' : ''}`}>
      <span
        className={`turn-dot ${turn === 'w' ? 'turn-white' : 'turn-black'}`}
        aria-hidden="true"
      />
      {statusText(status, turn)}
      {aiThinking && <span className="ai-thinking"> · AI 생각 중...</span>}
    </div>
  )
}

import type { CapturedPiece } from '../chess/useChessGame'
import { PIECE_UNICODE } from '../chess/pieces'

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

type CapturedPiecesProps = {
  captured: CapturedPiece[]
}

export function CapturedPieces({ captured }: CapturedPiecesProps) {
  const white = captured.filter((c) => c.color === 'w')
  const black = captured.filter((c) => c.color === 'b')
  const score = (pieces: CapturedPiece[]) =>
    pieces.reduce((sum, p) => sum + VALUE[p.type], 0)

  const advantage = score(black) - score(white)

  const row = (pieces: CapturedPiece[], label: string, adv: number) => (
    <div className="captured-row">
      <span className="captured-label">{label}이 잡은 기물</span>
      <span className="captured-pieces">
        {pieces.length === 0 && <span className="captured-empty">-</span>}
        {pieces.map((p, i) => (
          <span key={i} className={p.color === 'w' ? 'piece-white' : 'piece-black'}>
            {PIECE_UNICODE[p.color][p.type]}
          </span>
        ))}
        {adv > 0 && <span className="captured-advantage">+{adv}</span>}
      </span>
    </div>
  )

  return (
    <div className="captured-panel">
      {row(white, '흑', advantage < 0 ? -advantage : 0)}
      {row(black, '백', advantage > 0 ? advantage : 0)}
    </div>
  )
}

import type { Color, PieceSymbol } from 'chess.js'
import { PIECE_UNICODE } from '../chess/pieces'
import './PromotionDialog.css'

const CHOICES: PieceSymbol[] = ['q', 'r', 'b', 'n']

type PromotionDialogProps = {
  color: Color
  onChoose: (piece: PieceSymbol) => void
  onCancel: () => void
}

export function PromotionDialog({ color, onChoose, onCancel }: PromotionDialogProps) {
  return (
    <div className="promotion-overlay" onClick={onCancel}>
      <div
        className="promotion-dialog"
        role="dialog"
        aria-label="승급할 기물 선택"
        onClick={(e) => e.stopPropagation()}
      >
        <p>승급할 기물을 선택하세요</p>
        <div className="promotion-choices">
          {CHOICES.map((piece) => (
            <button
              key={piece}
              type="button"
              className="promotion-choice"
              onClick={() => onChoose(piece)}
            >
              <span className={color === 'w' ? 'piece-white' : 'piece-black'}>
                {PIECE_UNICODE[color][piece]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

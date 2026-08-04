import type { Color, PieceSymbol, Square as SquareType } from 'chess.js'
import { FILES, PIECE_UNICODE, RANKS } from '../chess/pieces'
import './Board.css'

type BoardPiece = { square: SquareType; type: PieceSymbol; color: Color } | null

type BoardProps = {
  board: BoardPiece[][]
  orientation: Color
  selected: SquareType | null
  legalTargets: SquareType[]
  lastMove: { from: SquareType; to: SquareType } | null
  inCheckSquare: SquareType | null
  onSquareClick: (square: SquareType) => void
}

export function Board({
  board,
  orientation,
  selected,
  legalTargets,
  lastMove,
  inCheckSquare,
  onSquareClick,
}: BoardProps) {
  const files = orientation === 'w' ? FILES : [...FILES].reverse()
  const ranks = orientation === 'w' ? [...RANKS].reverse() : RANKS

  const squareAt = (file: string, rank: string): BoardPiece => {
    const rankIndex = 8 - Number(rank)
    const fileIndex = FILES.indexOf(file as (typeof FILES)[number])
    return board[rankIndex][fileIndex]
  }

  const legalSet = new Set(legalTargets)

  return (
    <div className="board" role="grid" aria-label="체스판">
      {ranks.map((rank) =>
        files.map((file) => {
          const square = `${file}${rank}` as SquareType
          const piece = squareAt(file, rank)
          const isDark = (FILES.indexOf(file) + Number(rank)) % 2 === 0
          const isSelected = selected === square
          const isLegal = legalSet.has(square)
          const isLastMove = lastMove?.from === square || lastMove?.to === square
          const isCheck = inCheckSquare === square

          return (
            <button
              key={square}
              type="button"
              role="gridcell"
              aria-label={`${file}${rank}${piece ? ` ${piece.color === 'w' ? '백' : '흑'} ${piece.type}` : ''}`}
              className={[
                'square',
                isDark ? 'dark' : 'light',
                isSelected ? 'selected' : '',
                isLastMove ? 'last-move' : '',
                isCheck ? 'in-check' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSquareClick(square)}
            >
              {file === files[0] && (
                <span className="coord rank-coord">{rank}</span>
              )}
              {rank === ranks[ranks.length - 1] && (
                <span className="coord file-coord">{file}</span>
              )}
              {piece && (
                <span
                  className={`piece ${piece.color === 'w' ? 'piece-white' : 'piece-black'}`}
                >
                  {PIECE_UNICODE[piece.color][piece.type]}
                </span>
              )}
              {isLegal && (
                <span className={`move-hint ${piece ? 'capture-hint' : ''}`} />
              )}
            </button>
          )
        }),
      )}
    </div>
  )
}

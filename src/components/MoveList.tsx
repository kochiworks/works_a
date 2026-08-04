import { useEffect, useRef } from 'react'
import type { Move } from 'chess.js'
import { PIECE_UNICODE } from '../chess/pieces'

type MoveListProps = {
  moves: Move[]
}

function formatMove(move: Move) {
  const isCastle = move.san.startsWith('O-O')
  const isCheckmate = move.san.endsWith('#')
  const isCheck = !isCheckmate && move.san.endsWith('+')
  const icon = isCastle ? PIECE_UNICODE[move.color].k : PIECE_UNICODE[move.color][move.piece]

  let text = move.san
  if (!isCastle && /^[NBRQK]/.test(text)) {
    text = text.slice(1)
  }

  return {
    icon,
    text,
    isCapture: Boolean(move.captured),
    isCheck,
    isCheckmate,
  }
}

function MoveCell({ move }: { move?: Move }) {
  if (!move) return <span className="move-cell move-cell-empty" />
  const { icon, text, isCapture, isCheck, isCheckmate } = formatMove(move)
  const classes = [
    'move-cell',
    move.color === 'w' ? 'move-cell-white' : 'move-cell-black',
    isCapture ? 'move-cell-capture' : '',
    isCheckmate ? 'move-cell-checkmate' : isCheck ? 'move-cell-check' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      <span className="move-piece-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="move-san">{text}</span>
    </span>
  )
}

export function MoveList({ moves }: MoveListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [moves.length])

  const pairs: [Move, Move | undefined][] = []
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]])
  }

  return (
    <div className="move-list">
      <h2>기보</h2>
      {pairs.length === 0 ? (
        <p className="move-list-empty">아직 이동이 없습니다</p>
      ) : (
        <div className="move-list-scroll" ref={scrollRef}>
          <table className="move-table">
            <tbody>
              {pairs.map(([white, black], i) => (
                <tr key={i} className={i === pairs.length - 1 ? 'move-row-latest' : ''}>
                  <td className="move-number">{i + 1}</td>
                  <td>
                    <MoveCell move={white} />
                  </td>
                  <td>
                    <MoveCell move={black} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

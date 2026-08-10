import { useMemo } from 'react'
import { Chess, type Color } from 'chess.js'
import { Board } from './Board'

type DemoBoardProps = {
  fen: string
  orientation?: Color
}

/** Read-only board for tutorial/rules illustrations. Renders a position, no interaction. */
export function DemoBoard({ fen, orientation = 'w' }: DemoBoardProps) {
  const board = useMemo(() => {
    try {
      return new Chess(fen).board()
    } catch {
      return new Chess().board()
    }
  }, [fen])

  return (
    <div className="demo-board">
      <Board
        board={board}
        orientation={orientation}
        selected={null}
        legalTargets={[]}
        lastMove={null}
        inCheckSquare={null}
        onSquareClick={() => {}}
      />
    </div>
  )
}

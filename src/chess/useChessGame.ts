import { useCallback, useMemo, useRef, useState } from 'react'
import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js'

export type PendingPromotion = {
  from: Square
  to: Square
  color: Color
}

export type CapturedPiece = {
  type: PieceSymbol
  color: Color
}

export type GameStatus =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw'

export function useChessGame() {
  const gameRef = useRef(new Chess())
  const [version, setVersion] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null)
  const [orientation, setOrientation] = useState<Color>('w')

  const game = gameRef.current
  const rerender = useCallback(() => setVersion((n) => n + 1), [])

  const legalTargets = useMemo(() => {
    if (!selected) return []
    return game.moves({ square: selected, verbose: true }).map((m) => m.to as Square)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, game, version])

  const status: GameStatus = useMemo(() => {
    if (game.isCheckmate()) return 'checkmate'
    if (game.isStalemate()) return 'stalemate'
    if (game.isDraw()) return 'draw'
    if (game.isCheck()) return 'check'
    return 'playing'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, version])

  const checkSquare: Square | null = useMemo(() => {
    if (!game.isCheck()) return null
    for (const row of game.board()) {
      for (const cell of row) {
        if (cell && cell.type === 'k' && cell.color === game.turn()) {
          return cell.square
        }
      }
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, version])

  const capturedPieces: CapturedPiece[] = useMemo(() => {
    const history = game.history({ verbose: true })
    const captured: CapturedPiece[] = []
    for (const move of history) {
      if (move.captured) {
        captured.push({
          type: move.captured,
          color: move.color === 'w' ? 'b' : 'w',
        })
      }
    }
    return captured
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, version])

  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      const result = game.move({ from, to, promotion })
      if (result) {
        setLastMove({ from, to })
        setSelected(null)
        setPendingPromotion(null)
        rerender()
      }
      return result
    },
    [game, rerender],
  )

  const trySelectOrMove = useCallback(
    (square: Square) => {
      if (pendingPromotion) return

      if (selected) {
        if (square === selected) {
          setSelected(null)
          return
        }

        const move = game
          .moves({ square: selected, verbose: true })
          .find((m) => m.to === square)

        if (move) {
          const piece = game.get(selected)
          const isPromotion =
            piece?.type === 'p' && (square[1] === '8' || square[1] === '1')

          if (isPromotion) {
            setPendingPromotion({ from: selected, to: square, color: piece.color })
            return
          }

          makeMove(selected, square)
          return
        }
      }

      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        setSelected(square)
      } else {
        setSelected(null)
      }
    },
    [game, selected, pendingPromotion, makeMove],
  )

  const resolvePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return
      makeMove(pendingPromotion.from, pendingPromotion.to, piece)
    },
    [pendingPromotion, makeMove],
  )

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null)
    setSelected(null)
  }, [])

  const undo = useCallback(() => {
    game.undo()
    setSelected(null)
    setPendingPromotion(null)
    const history = game.history({ verbose: true })
    const last = history[history.length - 1]
    setLastMove(last ? { from: last.from as Square, to: last.to as Square } : null)
    rerender()
  }, [game, rerender])

  const reset = useCallback(() => {
    game.reset()
    setSelected(null)
    setLastMove(null)
    setPendingPromotion(null)
    rerender()
  }, [game, rerender])

  const flipBoard = useCallback(() => {
    setOrientation((o) => (o === 'w' ? 'b' : 'w'))
  }, [])

  return {
    board: game.board(),
    fen: game.fen(),
    turn: game.turn(),
    selected,
    legalTargets,
    lastMove,
    status,
    checkSquare,
    capturedPieces,
    pendingPromotion,
    orientation,
    moveHistory: game.history({ verbose: true }),
    canUndo: game.history().length > 0,
    isGameOver: game.isGameOver(),
    trySelectOrMove,
    makeMove,
    resolvePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
    setOrientation,
  }
}

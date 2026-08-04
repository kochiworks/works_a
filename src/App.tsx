import { useEffect, useState } from 'react'
import type { Color } from 'chess.js'
import { Board } from './components/Board'
import { PromotionDialog } from './components/PromotionDialog'
import { StatusBar } from './components/StatusBar'
import { CapturedPieces } from './components/CapturedPieces'
import { MoveList } from './components/MoveList'
import { Controls } from './components/Controls'
import { AiSettings, type GameMode } from './components/AiSettings'
import { useChessGame } from './chess/useChessGame'
import { useAiWorker } from './chess/useAiWorker'
import { AI_SPEED_PRESETS } from './chess/engine'
import './App.css'

function App() {
  const {
    board,
    fen,
    turn,
    selected,
    legalTargets,
    lastMove,
    status,
    checkSquare,
    capturedPieces,
    pendingPromotion,
    orientation,
    moveHistory,
    canUndo,
    isGameOver,
    trySelectOrMove,
    makeMove,
    resolvePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
    setOrientation,
  } = useChessGame()

  const { requestMove } = useAiWorker()

  const [mode, setMode] = useState<GameMode>('local')
  const [aiLevel, setAiLevel] = useState(5)
  const [playerColor, setPlayerColor] = useState<Color>('w')
  const [aiThinking, setAiThinking] = useState(false)
  const [aiMoveDelay, setAiMoveDelay] = useState<number>(AI_SPEED_PRESETS[1].delayMs)
  const aiColor: Color = playerColor === 'w' ? 'b' : 'w'

  useEffect(() => {
    setOrientation(mode === 'ai' ? playerColor : 'w')
  }, [mode, playerColor, setOrientation])

  useEffect(() => {
    if (mode !== 'ai' || turn !== aiColor || isGameOver || pendingPromotion) {
      return
    }
    let cancelled = false
    setAiThinking(true)
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, aiMoveDelay))
    Promise.all([requestMove(fen, aiLevel), minDelay]).then(([move]) => {
      if (cancelled) return
      setAiThinking(false)
      if (move) {
        makeMove(move.from, move.to, move.promotion)
      }
    })
    return () => {
      cancelled = true
    }
  }, [
    mode,
    turn,
    aiColor,
    fen,
    aiLevel,
    aiMoveDelay,
    isGameOver,
    pendingPromotion,
    requestMove,
    makeMove,
  ])

  const boardLocked = mode === 'ai' && (turn === aiColor || aiThinking)

  const handleSquareClick = (square: Parameters<typeof trySelectOrMove>[0]) => {
    if (boardLocked) return
    trySelectOrMove(square)
  }

  const handleModeChange = (nextMode: GameMode) => {
    setMode(nextMode)
    reset()
  }

  const handlePlayerColorChange = (color: Color) => {
    setPlayerColor(color)
    reset()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>♞ 체스</h1>
      </header>

      <main className="app-main">
        <div className="board-column">
          <AiSettings
            mode={mode}
            onModeChange={handleModeChange}
            aiLevel={aiLevel}
            onLevelChange={setAiLevel}
            playerColor={playerColor}
            onPlayerColorChange={handlePlayerColorChange}
            aiMoveDelay={aiMoveDelay}
            onAiMoveDelayChange={setAiMoveDelay}
          />
          <StatusBar status={status} turn={turn} aiThinking={aiThinking} />
          <Board
            board={board}
            orientation={orientation}
            selected={selected}
            legalTargets={legalTargets}
            lastMove={lastMove}
            inCheckSquare={checkSquare}
            onSquareClick={handleSquareClick}
          />
          <Controls
            onNewGame={reset}
            onUndo={undo}
            onFlip={flipBoard}
            canUndo={canUndo}
            disabled={aiThinking}
          />
        </div>

        <aside className="side-panel">
          <CapturedPieces captured={capturedPieces} />
          <MoveList moves={moveHistory} />
        </aside>
      </main>

      {pendingPromotion && (
        <PromotionDialog
          color={pendingPromotion.color}
          onChoose={resolvePromotion}
          onCancel={cancelPromotion}
        />
      )}
    </div>
  )
}

export default App

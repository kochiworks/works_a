import { useCallback, useEffect, useState } from 'react'
import type { Color, Move } from 'chess.js'
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
import {
  playCaptureSound,
  playCheckSound,
  playCheckmateSound,
  playMoveSound,
  setSoundEnabled,
} from './audio/sound'
import './App.css'

function App() {
  const [soundOn, setSoundOn] = useState(true)

  const handleMove = useCallback((move: Move) => {
    if (move.san.endsWith('#')) {
      playCheckmateSound()
    } else if (move.san.endsWith('+')) {
      playCheckSound()
    } else if (move.captured) {
      playCaptureSound()
    } else {
      playMoveSound()
    }
  }, [])

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
  } = useChessGame(handleMove)

  const { requestMove } = useAiWorker()

  const [mode, setMode] = useState<GameMode>('local')
  const [aiLevel, setAiLevel] = useState(5)
  const [playerColor, setPlayerColor] = useState<Color>('w')
  const [aiThinking, setAiThinking] = useState(false)
  const [aiMoveDelay, setAiMoveDelay] = useState<number>(AI_SPEED_PRESETS[1].delayMs)
  const [faceToFace, setFaceToFace] = useState(false)
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

  const handleToggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev
      setSoundEnabled(next)
      return next
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header-spacer" aria-hidden="true" />
        <h1>♞ 체스</h1>
        <button
          type="button"
          className="sound-toggle"
          onClick={handleToggleSound}
          aria-label={soundOn ? '효과음 끄기' : '효과음 켜기'}
          title={soundOn ? '효과음 끄기' : '효과음 켜기'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
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
            faceToFace={faceToFace}
            onFaceToFaceChange={setFaceToFace}
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
            faceToFace={mode === 'local' && faceToFace}
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

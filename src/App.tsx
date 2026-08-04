import { Board } from './components/Board'
import { PromotionDialog } from './components/PromotionDialog'
import { StatusBar } from './components/StatusBar'
import { CapturedPieces } from './components/CapturedPieces'
import { MoveList } from './components/MoveList'
import { Controls } from './components/Controls'
import { useChessGame } from './chess/useChessGame'
import './App.css'

function App() {
  const {
    board,
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
    trySelectOrMove,
    resolvePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
  } = useChessGame()

  return (
    <div className="app">
      <header className="app-header">
        <h1>♞ 체스</h1>
      </header>

      <main className="app-main">
        <div className="board-column">
          <StatusBar status={status} turn={turn} />
          <Board
            board={board}
            orientation={orientation}
            selected={selected}
            legalTargets={legalTargets}
            lastMove={lastMove}
            inCheckSquare={checkSquare}
            onSquareClick={trySelectOrMove}
          />
          <Controls
            onNewGame={reset}
            onUndo={undo}
            onFlip={flipBoard}
            canUndo={canUndo}
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

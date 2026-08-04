type ControlsProps = {
  onNewGame: () => void
  onUndo: () => void
  onFlip: () => void
  canUndo: boolean
}

export function Controls({ onNewGame, onUndo, onFlip, canUndo }: ControlsProps) {
  return (
    <div className="controls">
      <button type="button" className="control-btn primary" onClick={onNewGame}>
        새 게임
      </button>
      <button
        type="button"
        className="control-btn"
        onClick={onUndo}
        disabled={!canUndo}
      >
        무르기
      </button>
      <button type="button" className="control-btn" onClick={onFlip}>
        보드 뒤집기
      </button>
    </div>
  )
}

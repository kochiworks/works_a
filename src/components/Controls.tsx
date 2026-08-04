type ControlsProps = {
  onNewGame: () => void
  onUndo: () => void
  onFlip: () => void
  canUndo: boolean
  disabled?: boolean
}

export function Controls({ onNewGame, onUndo, onFlip, canUndo, disabled }: ControlsProps) {
  return (
    <div className="controls">
      <button type="button" className="control-btn primary" onClick={onNewGame}>
        새 게임
      </button>
      <button
        type="button"
        className="control-btn"
        onClick={onUndo}
        disabled={!canUndo || disabled}
      >
        무르기
      </button>
      <button
        type="button"
        className="control-btn"
        onClick={onFlip}
        disabled={disabled}
      >
        보드 뒤집기
      </button>
    </div>
  )
}

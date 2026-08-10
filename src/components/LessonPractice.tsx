import { useCallback, useEffect, useState } from 'react'
import type { Move, PieceSymbol } from 'chess.js'
import { Board } from './Board'
import { PromotionDialog } from './PromotionDialog'
import { useChessGame } from '../chess/useChessGame'
import type { TutorialLesson } from '../curriculum/tutorialData'
import {
  playCaptureSound,
  playCheckSound,
  playCheckmateSound,
  playMoveSound,
  playSuccessSound,
  playWrongSound,
} from '../audio/sound'

type Feedback = { type: 'success' | 'wrong'; message: string }

function matchesAccepted(task: TutorialLesson['task'], move: Move): boolean {
  if (task.kind === 'freeform') return true
  if (task.kind !== 'move') return false
  return (task.accepted ?? []).some(
    (a) =>
      a.from === move.from &&
      (a.to === undefined || a.to === move.to) &&
      (a.promotion === undefined || a.promotion === (move.promotion as PieceSymbol | undefined)),
  )
}

type LessonPracticeProps = {
  lesson: TutorialLesson
}

/** Interactive mini-game board for a single tutorial lesson. Remount (via `key`) on lesson change. */
export function LessonPractice({ lesson }: LessonPracticeProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [solved, setSolved] = useState(false)
  const [wrongTick, setWrongTick] = useState(0)
  const task = lesson.task

  const handleMove = useCallback(
    (move: Move) => {
      if (move.san.endsWith('#')) playCheckmateSound()
      else if (move.san.endsWith('+')) playCheckSound()
      else if (move.captured) playCaptureSound()
      else playMoveSound()

      if (solved) return

      if (matchesAccepted(task, move)) {
        setSolved(true)
        setFeedback({ type: 'success', message: task.successMessage })
        setTimeout(() => playSuccessSound(), 220)
      } else if (task.kind === 'move') {
        setFeedback({
          type: 'wrong',
          message: task.wrongMessage ?? '아직 목표를 달성하지 못했습니다. 다시 시도해보세요.',
        })
        playWrongSound()
        setWrongTick((t) => t + 1)
      }
    },
    [task, solved],
  )

  const {
    board,
    orientation,
    selected,
    legalTargets,
    lastMove,
    checkSquare,
    pendingPromotion,
    trySelectOrMove,
    resolvePromotion,
    cancelPromotion,
    reset,
  } = useChessGame(handleMove, lesson.fen)

  // Revert an incorrect (but legal) move so the player can retry from the lesson's start.
  useEffect(() => {
    if (wrongTick === 0) return
    const timer = setTimeout(() => reset(), 700)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrongTick])

  // 'select' task: succeeds when the player selects the target square.
  useEffect(() => {
    if (task.kind !== 'select' || solved) return
    if (selected && task.targetSquares?.includes(selected)) {
      setSolved(true)
      setFeedback({ type: 'success', message: task.successMessage })
      playSuccessSound()
    }
  }, [selected, task, solved])

  const handleRetry = () => {
    reset()
    setSolved(false)
    setFeedback(null)
    setWrongTick(0)
  }

  return (
    <div className="lesson-practice">
      <p className="lesson-task-instruction">{task.instruction}</p>
      <Board
        board={board}
        orientation={orientation}
        selected={selected}
        legalTargets={legalTargets}
        lastMove={lastMove}
        inCheckSquare={checkSquare}
        onSquareClick={trySelectOrMove}
      />
      <div className="lesson-practice-footer">
        {feedback ? (
          <p className={`lesson-feedback lesson-feedback-${feedback.type}`}>
            {feedback.type === 'success' ? '✅' : '❌'} {feedback.message}
          </p>
        ) : (
          <span className="lesson-feedback-placeholder" />
        )}
        <button type="button" className="lesson-retry-btn" onClick={handleRetry}>
          ↺ 다시 시도
        </button>
      </div>

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

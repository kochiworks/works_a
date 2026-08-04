import { Chess, type Move, type Square } from 'chess.js'
import { PIECE_VALUES, evaluatePerspective } from './evaluation'

export type AiLevelConfig = {
  level: number
  label: string
  maxDepth: number
  timeBudgetMs: number
  randomMoveChance: number
  noise: number
}

export const AI_LEVELS: AiLevelConfig[] = [
  { level: 1, label: '왕초보', maxDepth: 1, timeBudgetMs: 100, randomMoveChance: 0.7, noise: 200 },
  { level: 2, label: '초보', maxDepth: 1, timeBudgetMs: 120, randomMoveChance: 0.55, noise: 160 },
  { level: 3, label: '초급', maxDepth: 1, timeBudgetMs: 150, randomMoveChance: 0.35, noise: 120 },
  { level: 4, label: '초중급', maxDepth: 2, timeBudgetMs: 200, randomMoveChance: 0.2, noise: 90 },
  { level: 5, label: '중급', maxDepth: 2, timeBudgetMs: 300, randomMoveChance: 0.1, noise: 60 },
  { level: 6, label: '중상급', maxDepth: 3, timeBudgetMs: 450, randomMoveChance: 0.04, noise: 40 },
  { level: 7, label: '상급', maxDepth: 3, timeBudgetMs: 700, randomMoveChance: 0.02, noise: 25 },
  { level: 8, label: '준고수', maxDepth: 4, timeBudgetMs: 1000, randomMoveChance: 0, noise: 12 },
  { level: 9, label: '고수', maxDepth: 4, timeBudgetMs: 1400, randomMoveChance: 0, noise: 4 },
  { level: 10, label: '마스터', maxDepth: 5, timeBudgetMs: 2000, randomMoveChance: 0, noise: 0 },
]

export function getLevelConfig(level: number): AiLevelConfig {
  const clamped = Math.min(10, Math.max(1, Math.round(level)))
  return AI_LEVELS[clamped - 1]
}

export const AI_SPEED_PRESETS = [
  { label: '빠름', delayMs: 300 },
  { label: '보통', delayMs: 1000 },
  { label: '느림', delayMs: 2000 },
  { label: '매우 느림', delayMs: 3500 },
] as const

const CHECKMATE_SCORE = 100000

class SearchAborted extends Error {}

function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    const scoreOf = (m: Move) => {
      if (!m.captured) return 0
      return PIECE_VALUES[m.captured] - PIECE_VALUES[m.piece] / 100
    }
    return scoreOf(b) - scoreOf(a)
  })
}

function negamax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  deadline: number,
): number {
  if (Date.now() > deadline) throw new SearchAborted()

  if (chess.isCheckmate()) {
    return -CHECKMATE_SCORE - depth
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return 0
  }
  if (depth === 0) {
    return evaluatePerspective(chess, chess.turn())
  }

  const moves = orderMoves(chess.moves({ verbose: true }))
  let best = -Infinity
  for (const move of moves) {
    chess.move({ from: move.from, to: move.to, promotion: move.promotion })
    let score: number
    try {
      score = -negamax(chess, depth - 1, -beta, -alpha, deadline)
    } finally {
      chess.undo()
    }
    if (score > best) best = score
    if (best > alpha) alpha = best
    if (alpha >= beta) break
  }
  return best
}

function searchRootAtDepth(
  chess: Chess,
  rootMoves: Move[],
  depth: number,
  deadline: number,
  noise: number,
): Move {
  let bestMove = rootMoves[0]
  let bestScore = -Infinity

  for (const move of rootMoves) {
    chess.move({ from: move.from, to: move.to, promotion: move.promotion })
    let score: number
    try {
      score = -negamax(chess, depth - 1, -Infinity, Infinity, deadline)
    } finally {
      chess.undo()
    }
    score += (Math.random() * 2 - 1) * noise
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export type AiMove = {
  from: Square
  to: Square
  promotion?: 'q' | 'r' | 'b' | 'n'
}

export function findBestMove(fen: string, level: number): AiMove | null {
  const config = getLevelConfig(level)
  const chess = new Chess(fen)
  const legalMoves = chess.moves({ verbose: true })
  if (legalMoves.length === 0) return null

  if (Math.random() < config.randomMoveChance) {
    const pick = legalMoves[Math.floor(Math.random() * legalMoves.length)]
    return {
      from: pick.from as Square,
      to: pick.to as Square,
      promotion: pick.promotion as AiMove['promotion'],
    }
  }

  const ordered = orderMoves(legalMoves)
  const deadline = Date.now() + config.timeBudgetMs
  let bestMove = ordered[0]

  for (let depth = 1; depth <= config.maxDepth; depth++) {
    try {
      bestMove = searchRootAtDepth(chess, ordered, depth, deadline, config.noise)
    } catch (error) {
      if (error instanceof SearchAborted) break
      throw error
    }
    if (Date.now() > deadline) break
  }

  return {
    from: bestMove.from as Square,
    to: bestMove.to as Square,
    promotion: bestMove.promotion as AiMove['promotion'],
  }
}

import { findBestMove } from './engine'

export type AiWorkerRequest = {
  id: number
  fen: string
  level: number
}

export type AiWorkerResponse = {
  id: number
  move: ReturnType<typeof findBestMove>
}

self.onmessage = (event: MessageEvent<AiWorkerRequest>) => {
  const { id, fen, level } = event.data
  const move = findBestMove(fen, level)
  const response: AiWorkerResponse = { id, move }
  ;(self as unknown as Worker).postMessage(response)
}

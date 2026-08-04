import { useCallback, useEffect, useRef } from 'react'
import type { AiMove } from './engine'
import type { AiWorkerRequest, AiWorkerResponse } from './ai.worker'

export function useAiWorker() {
  const workerRef = useRef<Worker | null>(null)
  const requestIdRef = useRef(0)
  const pendingRef = useRef(new Map<number, (move: AiMove | null) => void>())

  useEffect(() => {
    const worker = new Worker(new URL('./ai.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (event: MessageEvent<AiWorkerResponse>) => {
      const resolve = pendingRef.current.get(event.data.id)
      if (resolve) {
        pendingRef.current.delete(event.data.id)
        resolve(event.data.move)
      }
    }
    workerRef.current = worker
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const requestMove = useCallback((fen: string, level: number) => {
    return new Promise<AiMove | null>((resolve) => {
      const worker = workerRef.current
      if (!worker) {
        resolve(null)
        return
      }
      const id = ++requestIdRef.current
      pendingRef.current.set(id, resolve)
      const request: AiWorkerRequest = { id, fen, level }
      worker.postMessage(request)
    })
  }, [])

  return { requestMove }
}

import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './records'

export function useAiRecords() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

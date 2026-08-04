import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './localRecords'

export function useLocalRecords() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

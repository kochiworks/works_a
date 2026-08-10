import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { generateCases } from '../lib/generators'
import { allowsRepetition } from '../lib/types'
import type { ExclusiveGroup, ExplorerOptions, Item, Mode } from '../lib/types'

export const N_MIN = 2
export const N_MAX = 10
export const R_MIN = 1
export const R_MAX = 6

function defaultName(index: number): string {
  // A, B, C, ... Z, then fall back to 항목27, 항목28, ...
  const letter = String.fromCharCode('A'.charCodeAt(0) + index)
  return index < 26 ? letter : `항목${index + 1}`
}

let nextItemSeq = 0
function makeItem(index: number): Item {
  nextItemSeq += 1
  return { id: `item-${nextItemSeq}`, name: defaultName(index) }
}

function initialItems(): Item[] {
  return [makeItem(0), makeItem(1), makeItem(2), makeItem(3)]
}

function maxRFor(mode: Mode, itemCount: number): number {
  const cap = allowsRepetition(mode) ? R_MAX : Math.min(R_MAX, itemCount)
  return Math.max(R_MIN, cap)
}

export function useExplorerState() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [mode, setModeState] = useState<Mode>('permutation')
  const [r, setRState] = useState(2)
  const [options, setOptions] = useState<ExplorerOptions>({
    mustInclude: [],
    mustExclude: [],
    exclusiveGroups: [],
  })

  const maxR = maxRFor(mode, items.length)

  // Keep r within the valid range whenever mode or item count changes.
  useEffect(() => {
    setRState((prev) => Math.min(Math.max(prev, R_MIN), maxR))
  }, [maxR])

  const setMode = useCallback((next: Mode) => {
    setModeState(next)
  }, [])

  const setR = useCallback(
    (next: number) => {
      setRState(Math.min(Math.max(next, R_MIN), maxR))
    },
    [maxR],
  )

  const setItemCount = useCallback((count: number) => {
    const clamped = Math.min(Math.max(count, N_MIN), N_MAX)
    setItems((prev) => {
      if (clamped === prev.length) return prev
      if (clamped < prev.length) {
        const removedIds = new Set(prev.slice(clamped).map((item) => item.id))
        setOptions((prevOptions) => sanitizeOptions(prevOptions, removedIds))
        return prev.slice(0, clamped)
      }
      const additions: Item[] = []
      for (let i = prev.length; i < clamped; i++) additions.push(makeItem(i))
      return [...prev, ...additions]
    })
  }, [])

  const renameItem = useCallback((id: string, name: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)))
  }, [])

  const toggleMustInclude = useCallback((id: string) => {
    setOptions((prev) => {
      const has = prev.mustInclude.includes(id)
      return {
        ...prev,
        mustInclude: has ? prev.mustInclude.filter((x) => x !== id) : [...prev.mustInclude, id],
        mustExclude: prev.mustExclude.filter((x) => x !== id),
      }
    })
  }, [])

  const toggleMustExclude = useCallback((id: string) => {
    setOptions((prev) => {
      const has = prev.mustExclude.includes(id)
      return {
        ...prev,
        mustExclude: has ? prev.mustExclude.filter((x) => x !== id) : [...prev.mustExclude, id],
        mustInclude: prev.mustInclude.filter((x) => x !== id),
      }
    })
  }, [])

  const groupSeqRef = useRef(0)
  const addExclusiveGroup = useCallback((itemIds: string[]) => {
    if (itemIds.length < 2) return
    groupSeqRef.current += 1
    const group: ExclusiveGroup = { id: `group-${groupSeqRef.current}`, itemIds }
    setOptions((prev) => ({ ...prev, exclusiveGroups: [...prev.exclusiveGroups, group] }))
  }, [])

  const removeExclusiveGroup = useCallback((id: string) => {
    setOptions((prev) => ({
      ...prev,
      exclusiveGroups: prev.exclusiveGroups.filter((g) => g.id !== id),
    }))
  }, [])

  const resetOptions = useCallback(() => {
    setOptions({ mustInclude: [], mustExclude: [], exclusiveGroups: [] })
  }, [])

  const result = useMemo(
    () => generateCases(items, r, mode, options),
    [items, r, mode, options],
  )

  return {
    items,
    mode,
    r,
    maxR,
    options,
    result,
    setMode,
    setR,
    setItemCount,
    renameItem,
    toggleMustInclude,
    toggleMustExclude,
    addExclusiveGroup,
    removeExclusiveGroup,
    resetOptions,
  }
}

function sanitizeOptions(options: ExplorerOptions, removedIds: Set<string>): ExplorerOptions {
  return {
    mustInclude: options.mustInclude.filter((id) => !removedIds.has(id)),
    mustExclude: options.mustExclude.filter((id) => !removedIds.has(id)),
    exclusiveGroups: options.exclusiveGroups
      .map((group) => ({ ...group, itemIds: group.itemIds.filter((id) => !removedIds.has(id)) }))
      .filter((group) => group.itemIds.length >= 2),
  }
}

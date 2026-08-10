import { countForMode } from './formulas'
import type { ExplorerOptions, Item, Mode, ResultCase } from './types'

/**
 * Above this many raw cases we refuse to enumerate (performance guard).
 * The pool size that would be generated is checked with `countForMode`
 * *before* recursing, so we never start a blow-up in the first place.
 */
export const ENUMERATE_LIMIT = 2000

function permutations(pool: Item[], r: number): ResultCase[] {
  const results: ResultCase[] = []
  const used = new Array(pool.length).fill(false)
  const current: Item[] = []
  function backtrack() {
    if (current.length === r) {
      results.push([...current])
      return
    }
    for (let i = 0; i < pool.length; i++) {
      if (used[i]) continue
      used[i] = true
      current.push(pool[i])
      backtrack()
      current.pop()
      used[i] = false
    }
  }
  backtrack()
  return results
}

function combinations(pool: Item[], r: number): ResultCase[] {
  const results: ResultCase[] = []
  const current: Item[] = []
  function backtrack(start: number) {
    if (current.length === r) {
      results.push([...current])
      return
    }
    for (let i = start; i < pool.length; i++) {
      current.push(pool[i])
      backtrack(i + 1)
      current.pop()
    }
  }
  backtrack(0)
  return results
}

function permutationsWithRepetition(pool: Item[], r: number): ResultCase[] {
  const results: ResultCase[] = []
  const current: Item[] = []
  function backtrack() {
    if (current.length === r) {
      results.push([...current])
      return
    }
    for (let i = 0; i < pool.length; i++) {
      current.push(pool[i])
      backtrack()
      current.pop()
    }
  }
  backtrack()
  return results
}

function combinationsWithRepetition(pool: Item[], r: number): ResultCase[] {
  const results: ResultCase[] = []
  const current: Item[] = []
  function backtrack(start: number) {
    if (current.length === r) {
      results.push([...current])
      return
    }
    for (let i = start; i < pool.length; i++) {
      current.push(pool[i])
      backtrack(i)
      current.pop()
    }
  }
  backtrack(0)
  return results
}

function rawGenerate(pool: Item[], r: number, mode: Mode): ResultCase[] {
  if (r <= 0) return [[]]
  switch (mode) {
    case 'permutation':
      return permutations(pool, r)
    case 'combination':
      return combinations(pool, r)
    case 'permutationWithRepetition':
      return permutationsWithRepetition(pool, r)
    case 'combinationWithRepetition':
      return combinationsWithRepetition(pool, r)
  }
}

function caseMatchesOptions(kase: ResultCase, options: ExplorerOptions): boolean {
  const idsInCase = new Set(kase.map((item) => item.id))

  for (const requiredId of options.mustInclude) {
    if (!idsInCase.has(requiredId)) return false
  }

  for (const group of options.exclusiveGroups) {
    let count = 0
    for (const id of group.itemIds) {
      if (idsInCase.has(id)) count++
    }
    if (count > 1) return false
  }

  return true
}

export interface GenerateResult {
  /** Total cases with no options applied at all (pure nPr/nCr/... of the full item set). */
  baseTotal: number
  /** Upper bound on enumeration cost after removing must-exclude items from the pool. */
  poolTotal: number
  /** Whether poolTotal was small enough to actually enumerate. */
  enumerated: boolean
  /** Enumerated + option-filtered cases. Empty when `enumerated` is false. */
  cases: ResultCase[]
  /** Count of cases before mustInclude/exclusiveGroups filtering (== poolTotal when enumerated). */
  poolCaseCount: number
}

export function generateCases(
  items: Item[],
  r: number,
  mode: Mode,
  options: ExplorerOptions,
): GenerateResult {
  const baseTotal = countForMode(mode, items.length, r)

  const excludeSet = new Set(options.mustExclude)
  const pool = items.filter((item) => !excludeSet.has(item.id))
  const poolTotal = countForMode(mode, pool.length, r)

  if (poolTotal > ENUMERATE_LIMIT || poolTotal < 0) {
    return { baseTotal, poolTotal, enumerated: false, cases: [], poolCaseCount: poolTotal }
  }

  const rawCases = rawGenerate(pool, r, mode)
  const cases = rawCases.filter((kase) => caseMatchesOptions(kase, options))

  return { baseTotal, poolTotal, enumerated: true, cases, poolCaseCount: rawCases.length }
}

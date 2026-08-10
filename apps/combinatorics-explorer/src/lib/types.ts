export type Mode = 'permutation' | 'combination' | 'permutationWithRepetition' | 'combinationWithRepetition'

export interface Item {
  id: string
  name: string
}

export interface ExclusiveGroup {
  id: string
  itemIds: string[]
}

export interface ExplorerOptions {
  /** item ids that must all appear in a valid case */
  mustInclude: string[]
  /** item ids that must never appear in a valid case */
  mustExclude: string[]
  /** within each group, at most one member item may appear together */
  exclusiveGroups: ExclusiveGroup[]
}

/** One enumerated case: r items, in generation order. */
export type ResultCase = Item[]

export const MODE_LABELS: Record<Mode, string> = {
  permutation: '순열',
  combination: '조합',
  permutationWithRepetition: '중복순열',
  combinationWithRepetition: '중복조합',
}

export const MODE_DESCRIPTIONS: Record<Mode, string> = {
  permutation: '서로 다른 n개 중 r개를 뽑아 순서대로 배열합니다.',
  combination: '서로 다른 n개 중 r개를 순서 없이 선택합니다.',
  permutationWithRepetition: '같은 대상을 중복해서 골라 r개를 순서대로 배열합니다.',
  combinationWithRepetition: '같은 대상을 중복해서 골라 r개를 순서 없이 선택합니다.',
}

/** Modes where order matters (permutation-family). */
export function isOrdered(mode: Mode): boolean {
  return mode === 'permutation' || mode === 'permutationWithRepetition'
}

/** Modes where the same item may be chosen more than once. */
export function allowsRepetition(mode: Mode): boolean {
  return mode === 'permutationWithRepetition' || mode === 'combinationWithRepetition'
}

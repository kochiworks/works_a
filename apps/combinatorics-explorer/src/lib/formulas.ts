import type { Mode } from './types'

/** n! — safe for the small n this app allows (n ≤ 20 or so). */
export function factorial(n: number): number {
  if (n < 0) return 0
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

/** nPr = n! / (n-r)! — permutations of r out of n distinct items. */
export function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  let result = 1
  for (let i = 0; i < r; i++) result *= n - i
  return result
}

/** nCr = n! / (r!(n-r)!) — combinations of r out of n distinct items. */
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0
  const rr = Math.min(r, n - r)
  let result = 1
  for (let i = 0; i < rr; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}

/** n^r — permutations with repetition allowed. */
export function nPrRepetition(n: number, r: number): number {
  if (n <= 0) return r === 0 ? 1 : 0
  return Math.pow(n, r)
}

/** (n+r-1)Cr — combinations with repetition allowed. */
export function nCrRepetition(n: number, r: number): number {
  if (n <= 0) return r === 0 ? 1 : 0
  return nCr(n + r - 1, r)
}

/** Total case count for the given mode, ignoring any include/exclude/group options. */
export function countForMode(mode: Mode, n: number, r: number): number {
  switch (mode) {
    case 'permutation':
      return nPr(n, r)
    case 'combination':
      return nCr(n, r)
    case 'permutationWithRepetition':
      return nPrRepetition(n, r)
    case 'combinationWithRepetition':
      return nCrRepetition(n, r)
  }
}

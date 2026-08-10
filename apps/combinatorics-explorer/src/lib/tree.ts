import type { ResultCase } from './types'

export interface TreeNode {
  key: string
  label: string
  isLeaf: boolean
  children: TreeNode[]
}

/** Builds a prefix tree (trie) from the enumerated cases, merging shared prefixes. */
export function buildTree(cases: ResultCase[]): TreeNode {
  const root: TreeNode = { key: 'root', label: '', isLeaf: cases.length === 0, children: [] }
  const childMaps = new WeakMap<TreeNode, Map<string, TreeNode>>()

  const childMapOf = (node: TreeNode): Map<string, TreeNode> => {
    let map = childMaps.get(node)
    if (!map) {
      map = new Map()
      childMaps.set(node, map)
    }
    return map
  }

  for (const kase of cases) {
    let current = root
    for (let depth = 0; depth < kase.length; depth++) {
      const item = kase[depth]
      const mapKey = `${item.id}#${depth}`
      const map = childMapOf(current)
      let child = map.get(mapKey)
      if (!child) {
        child = { key: `${current.key}>${mapKey}`, label: item.name, isLeaf: false, children: [] }
        map.set(mapKey, child)
        current.children.push(child)
      }
      current = child
    }
    current.isLeaf = true
  }

  return root
}

export interface PositionedNode extends TreeNode {
  x: number
  y: number
  children: PositionedNode[]
}

export interface TreeLayout {
  root: PositionedNode
  width: number
  height: number
  leafCount: number
}

/** Simple leaf-counting layout: each leaf gets an equal x-slot, parents center over children. */
export function layoutTree(root: TreeNode, levelHeight = 64, leafSlot = 72): TreeLayout {
  let leafIndex = 0
  let maxDepth = 0

  function assign(node: TreeNode, depth: number): PositionedNode {
    maxDepth = Math.max(maxDepth, depth)
    if (node.children.length === 0) {
      const x = leafIndex * leafSlot + leafSlot / 2
      leafIndex += 1
      return { ...node, x, y: depth * levelHeight, children: [] }
    }
    const children = node.children.map((child) => assign(child, depth + 1))
    const x = children.reduce((sum, child) => sum + child.x, 0) / children.length
    return { ...node, x, y: depth * levelHeight, children }
  }

  const positionedRoot = assign(root, 0)
  const leafCount = Math.max(leafIndex, 1)

  return {
    root: positionedRoot,
    width: leafCount * leafSlot,
    height: (maxDepth + 1) * levelHeight,
    leafCount,
  }
}

export interface TreeEdge {
  key: string
  from: PositionedNode
  to: PositionedNode
}

/** Flattens the positioned tree into a node list and parent→child edge list for SVG rendering. */
export function flattenTree(root: PositionedNode): { nodes: PositionedNode[]; edges: TreeEdge[] } {
  const nodes: PositionedNode[] = []
  const edges: TreeEdge[] = []

  function walk(node: PositionedNode) {
    nodes.push(node)
    for (const child of node.children) {
      edges.push({ key: `${node.key}->${child.key}`, from: node, to: child })
      walk(child)
    }
  }

  walk(root)
  return { nodes, edges }
}

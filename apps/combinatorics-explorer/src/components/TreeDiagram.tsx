import { useMemo } from 'react'
import { buildTree, flattenTree, layoutTree } from '../lib/tree'
import type { ResultCase } from '../lib/types'

/** Above this many leaves the tree gets too wide/slow to be useful — suggest the table view instead. */
const TREE_LEAF_LIMIT = 300

const NODE_RADIUS = 16
const PADDING = 24

interface Props {
  cases: ResultCase[]
}

export function TreeDiagram({ cases }: Props) {
  const tree = useMemo(() => buildTree(cases), [cases])
  const layout = useMemo(() => layoutTree(tree), [tree])
  const { nodes, edges } = useMemo(() => flattenTree(layout.root), [layout])

  if (cases.length === 0) {
    return <p className="hint">조건을 만족하는 경우가 없습니다.</p>
  }

  if (layout.leafCount > TREE_LEAF_LIMIT) {
    return (
      <p className="warning">
        경우의 수가 {cases.length.toLocaleString('ko-KR')}가지로 많아 수형도가 너무 커집니다. 표 보기를
        이용하거나 n·r을 줄여주세요.
      </p>
    )
  }

  const width = layout.width + PADDING * 2
  const height = layout.height + PADDING * 2

  return (
    <div className="table-scroll">
      <svg width={width} height={height} role="img" aria-label="경우의 수 수형도">
        <g transform={`translate(${PADDING}, ${PADDING})`}>
          {edges.map((edge) => (
            <line
              key={edge.key}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="#c3ccdc"
              strokeWidth={1.5}
            />
          ))}
          {nodes.map((node) => (
            <g key={node.key} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={NODE_RADIUS}
                fill={node.key === 'root' ? '#dfe6f5' : node.isLeaf ? '#2f6fed' : '#ffffff'}
                stroke="#2f6fed"
                strokeWidth={1.5}
              />
              {node.label && (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fill={node.isLeaf ? '#ffffff' : '#1a2233'}
                >
                  {node.label}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

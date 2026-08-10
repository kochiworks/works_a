import type { ResultCase } from '../lib/types'

interface Props {
  cases: ResultCase[]
  r: number
}

export function ResultTable({ cases, r }: Props) {
  if (cases.length === 0) {
    return <p className="hint">조건을 만족하는 경우가 없습니다.</p>
  }

  const columns = Array.from({ length: r }, (_, i) => `${i + 1}번째`)

  return (
    <div className="table-scroll">
      <table className="result-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map((kase, index) => (
            <tr key={index}>
              <td className="row-index">{index + 1}</td>
              {kase.map((item, position) => (
                <td key={`${item.id}-${position}`}>{item.name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

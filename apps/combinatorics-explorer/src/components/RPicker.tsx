import { R_MIN } from '../hooks/useExplorerState'

interface Props {
  r: number
  maxR: number
  onChange: (r: number) => void
}

export function RPicker({ r, maxR, onChange }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>선택 개수 (r = {r})</h2>
      </div>
      <input
        type="range"
        min={R_MIN}
        max={maxR}
        value={r}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="hint">
        r은 {R_MIN}~{maxR} 사이에서 고를 수 있습니다.
      </p>
    </section>
  )
}

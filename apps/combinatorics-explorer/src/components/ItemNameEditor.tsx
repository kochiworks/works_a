import type { Item } from '../lib/types'
import { N_MAX, N_MIN } from '../hooks/useExplorerState'

interface Props {
  items: Item[]
  onCountChange: (count: number) => void
  onRename: (id: string, name: string) => void
}

export function ItemNameEditor({ items, onCountChange, onRename }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>대상 (n = {items.length}개)</h2>
        <div className="stepper">
          <button
            type="button"
            onClick={() => onCountChange(items.length - 1)}
            disabled={items.length <= N_MIN}
            aria-label="대상 개수 줄이기"
          >
            −
          </button>
          <span>{items.length}</span>
          <button
            type="button"
            onClick={() => onCountChange(items.length + 1)}
            disabled={items.length >= N_MAX}
            aria-label="대상 개수 늘리기"
          >
            +
          </button>
        </div>
      </div>
      <div className="item-chip-grid">
        {items.map((item) => (
          <input
            key={item.id}
            className="item-chip-input"
            type="text"
            value={item.name}
            maxLength={12}
            onChange={(event) => onRename(item.id, event.target.value)}
            aria-label={`대상 이름 (${item.id})`}
          />
        ))}
      </div>
      <p className="hint">이름을 직접 입력해 바꿀 수 있습니다. (n은 {N_MIN}~{N_MAX}개)</p>
    </section>
  )
}

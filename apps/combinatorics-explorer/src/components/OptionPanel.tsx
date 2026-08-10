import { useState } from 'react'
import type { ExplorerOptions, Item } from '../lib/types'

interface Props {
  items: Item[]
  options: ExplorerOptions
  onToggleInclude: (id: string) => void
  onToggleExclude: (id: string) => void
  onAddGroup: (itemIds: string[]) => void
  onRemoveGroup: (id: string) => void
  onReset: () => void
}

function nameFor(items: Item[], id: string): string {
  return items.find((item) => item.id === id)?.name ?? id
}

export function OptionPanel({
  items,
  options,
  onToggleInclude,
  onToggleExclude,
  onAddGroup,
  onRemoveGroup,
  onReset,
}: Props) {
  const [pendingGroup, setPendingGroup] = useState<string[]>([])

  const togglePending = (id: string) => {
    setPendingGroup((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const submitGroup = () => {
    if (pendingGroup.length < 2) return
    onAddGroup(pendingGroup)
    setPendingGroup([])
  }

  const hasAnyOption =
    options.mustInclude.length > 0 || options.mustExclude.length > 0 || options.exclusiveGroups.length > 0

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>시뮬레이션 옵션</h2>
        {hasAnyOption && (
          <button type="button" className="link-btn" onClick={onReset}>
            옵션 초기화
          </button>
        )}
      </div>

      <div className="option-block">
        <h3>반드시 포함</h3>
        <div className="checkbox-grid">
          {items.map((item) => (
            <label key={item.id} className="checkbox-chip">
              <input
                type="checkbox"
                checked={options.mustInclude.includes(item.id)}
                onChange={() => onToggleInclude(item.id)}
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>

      <div className="option-block">
        <h3>반드시 제외</h3>
        <div className="checkbox-grid">
          {items.map((item) => (
            <label key={item.id} className="checkbox-chip">
              <input
                type="checkbox"
                checked={options.mustExclude.includes(item.id)}
                onChange={() => onToggleExclude(item.id)}
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>

      <div className="option-block">
        <h3>동시 포함 금지 그룹</h3>
        <p className="hint">체크한 대상들 중 최대 1개만 함께 등장할 수 있습니다.</p>
        <div className="checkbox-grid">
          {items.map((item) => (
            <label key={item.id} className="checkbox-chip">
              <input
                type="checkbox"
                checked={pendingGroup.includes(item.id)}
                onChange={() => togglePending(item.id)}
              />
              {item.name}
            </label>
          ))}
        </div>
        <button type="button" className="secondary-btn" onClick={submitGroup} disabled={pendingGroup.length < 2}>
          이 대상들로 그룹 추가
        </button>

        {options.exclusiveGroups.length > 0 && (
          <ul className="group-list">
            {options.exclusiveGroups.map((group) => (
              <li key={group.id}>
                <span>{group.itemIds.map((id) => nameFor(items, id)).join(' / ')}</span>
                <button type="button" className="link-btn" onClick={() => onRemoveGroup(group.id)}>
                  제거
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

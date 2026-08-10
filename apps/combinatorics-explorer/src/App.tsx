import { useState } from 'react'
import { ItemNameEditor } from './components/ItemNameEditor'
import { ModeSelector } from './components/ModeSelector'
import { RPicker } from './components/RPicker'
import { OptionPanel } from './components/OptionPanel'
import { ResultSummary } from './components/ResultSummary'
import { ResultTable } from './components/ResultTable'
import { TreeDiagram } from './components/TreeDiagram'
import { useExplorerState } from './hooks/useExplorerState'
import './App.css'

type ResultView = 'table' | 'tree'

function App() {
  const {
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
  } = useExplorerState()

  const [view, setView] = useState<ResultView>('table')

  const hasOptions =
    options.mustInclude.length > 0 || options.mustExclude.length > 0 || options.exclusiveGroups.length > 0

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎲 경우의 수 탐색기</h1>
        <p className="subtitle">순열 · 조합 · 중복순열 · 중복조합의 모든 경우를 직접 확인해보세요.</p>
      </header>

      <main className="app-main">
        <div className="settings-column">
          <ItemNameEditor items={items} onCountChange={setItemCount} onRename={renameItem} />
          <ModeSelector mode={mode} onChange={setMode} />
          <RPicker r={r} maxR={maxR} onChange={setR} />
          <OptionPanel
            items={items}
            options={options}
            onToggleInclude={toggleMustInclude}
            onToggleExclude={toggleMustExclude}
            onAddGroup={addExclusiveGroup}
            onRemoveGroup={removeExclusiveGroup}
            onReset={resetOptions}
          />
        </div>

        <div className="result-column">
          <ResultSummary result={result} hasOptions={hasOptions} />

          <section className="panel">
            <div className="view-tabs">
              <button
                type="button"
                className={view === 'table' ? 'view-tab active' : 'view-tab'}
                onClick={() => setView('table')}
              >
                표 보기
              </button>
              <button
                type="button"
                className={view === 'tree' ? 'view-tab active' : 'view-tab'}
                onClick={() => setView('tree')}
              >
                수형도 보기
              </button>
            </div>

            {result.enumerated ? (
              view === 'table' ? (
                <ResultTable cases={result.cases} r={r} />
              ) : (
                <TreeDiagram cases={result.cases} />
              )
            ) : (
              <p className="hint">위 안내대로 n 또는 r을 줄이면 표·수형도를 볼 수 있습니다.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App

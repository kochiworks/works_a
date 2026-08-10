import { MODE_DESCRIPTIONS, MODE_LABELS } from '../lib/types'
import type { Mode } from '../lib/types'

const MODES: Mode[] = ['permutation', 'combination', 'permutationWithRepetition', 'combinationWithRepetition']

interface Props {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <section className="panel">
      <h2>상황 선택</h2>
      <div className="mode-tabs">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            className={m === mode ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <p className="hint">{MODE_DESCRIPTIONS[mode]}</p>
    </section>
  )
}

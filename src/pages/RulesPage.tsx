import { DemoBoard } from '../components/DemoBoard'

type RulesPageProps = {
  onBack: () => void
  onStartGame: () => void
  onStartTutorial: () => void
}

const PIECE_MOVES: { icon: string; name: string; desc: string }[] = [
  { icon: '♙', name: '폰', desc: '앞으로 한 칸(처음엔 두 칸), 잡을 때는 대각선 앞 한 칸.' },
  { icon: '♘', name: '나이트', desc: '"L"자 모양으로 이동하며, 유일하게 기물을 뛰어넘습니다.' },
  { icon: '♗', name: '비숍', desc: '대각선으로 원하는 만큼. 한 색 칸에만 머뭅니다.' },
  { icon: '♖', name: '룩', desc: '가로·세로로 원하는 만큼 이동합니다.' },
  { icon: '♕', name: '퀸', desc: '룩과 비숍의 움직임을 합친 가장 강력한 기물입니다.' },
  { icon: '♔', name: '킹', desc: '어느 방향으로든 한 칸. 공격받는 칸으로는 갈 수 없습니다.' },
]

export function RulesPage({ onBack, onStartGame, onStartTutorial }: RulesPageProps) {
  return (
    <div className="page rules-page">
      <div className="page-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← 홈으로
        </button>
        <h1>📖 체스 규칙 요약</h1>
      </div>

      <section className="rules-section">
        <h2>기물의 이동</h2>
        <div className="piece-move-grid">
          {PIECE_MOVES.map((p) => (
            <div key={p.name} className="piece-move-card">
              <span className="piece-move-icon" aria-hidden="true">
                {p.icon}
              </span>
              <div>
                <strong>{p.name}</strong>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-section">
        <h2>특수 규칙</h2>
        <ul className="rules-list">
          <li>
            <strong>캐슬링</strong> — 킹과 룩이 한 번도 움직이지 않았고 그 사이가 비어있으며, 킹이
            체크 상태가 아니고 이동 경로가 공격받지 않을 때 킹과 룩이 동시에 움직이는 특수 수입니다.
          </li>
          <li>
            <strong>앙파상</strong> — 상대 폰이 두 칸 전진해 내 폰과 나란히 서면, 바로 다음 한
            수에서만 마치 한 칸 이동한 것처럼 대각선으로 잡을 수 있습니다.
          </li>
          <li>
            <strong>폰 승급</strong> — 폰이 마지막 랭크에 도달하면 퀸/룩/비숍/나이트 중 하나로
            반드시 승급합니다.
          </li>
        </ul>
      </section>

      <section className="rules-section">
        <h2>체크 · 체크메이트 · 무승부</h2>
        <div className="rules-with-board">
          <ul className="rules-list">
            <li>킹이 공격받는 상태를 <strong>체크</strong>라 하며, 반드시 그 턴에 해소해야 합니다.</li>
            <li>
              킹 이동, 공격 기물 포획, 사이 막기 중 어느 것도 불가능하면{' '}
              <strong>체크메이트</strong>로 게임이 즉시 끝납니다.
            </li>
            <li>
              체크 상태가 아닌데 둘 수 있는 수가 하나도 없으면 <strong>스테일메이트(무승부)</strong>
              입니다.
            </li>
            <li>
              이외에도 기물 부족, 3회 동일 반복, 50수 규칙 등으로 <strong>무승부</strong>가 될 수
              있습니다.
            </li>
          </ul>
          <div className="rules-board-demo">
            <DemoBoard fen="6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1" />
            <p className="demo-caption">
              Ra8을 두면 체크메이트! 흑 킹은 자신의 폰에 막혀 도망갈 곳이 없습니다.
            </p>
          </div>
        </div>
      </section>

      <div className="rules-cta">
        <button type="button" className="cta-btn" onClick={onStartTutorial}>
          🎓 튜토리얼로 차근차근 배우기
        </button>
        <button type="button" className="cta-btn cta-primary" onClick={onStartGame}>
          ♟️ 바로 게임 플레이하기
        </button>
      </div>
    </div>
  )
}

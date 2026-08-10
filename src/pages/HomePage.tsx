type HomePageProps = {
  onNavigateRules: () => void
  onNavigateTutorial: () => void
  onNavigatePlay: () => void
}

export function HomePage({ onNavigateRules, onNavigateTutorial, onNavigatePlay }: HomePageProps) {
  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1>♞ 체스</h1>
        <p>규칙을 배우고, 튜토리얼로 연습하고, 친구나 AI와 대결해보세요.</p>
      </div>

      <div className="home-nav-grid">
        <button type="button" className="home-nav-card" onClick={onNavigateRules}>
          <span className="home-nav-icon" aria-hidden="true">
            📖
          </span>
          <span className="home-nav-title">게임 룰 설명</span>
          <span className="home-nav-desc">기물 이동과 체크메이트 등 규칙을 요약해서 확인합니다.</span>
        </button>

        <button type="button" className="home-nav-card" onClick={onNavigateTutorial}>
          <span className="home-nav-icon" aria-hidden="true">
            🎓
          </span>
          <span className="home-nav-title">튜토리얼</span>
          <span className="home-nav-desc">
            초급(1~5) · 중급(1~10) · 고급(1~15) 단계로 체계적으로 학습합니다.
          </span>
        </button>

        <button type="button" className="home-nav-card" onClick={onNavigatePlay}>
          <span className="home-nav-icon" aria-hidden="true">
            ♟️
          </span>
          <span className="home-nav-title">게임 플레이</span>
          <span className="home-nav-desc">2인 대결이나 AI 봇과 실전 대국을 즐깁니다.</span>
        </button>
      </div>
    </div>
  )
}

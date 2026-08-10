import { useState } from 'react'
import { LessonPractice } from '../components/LessonPractice'
import {
  TIER_LABELS,
  TUTORIAL_TIERS,
  type TutorialTier,
} from '../curriculum/tutorialData'

type TutorialPageProps = {
  onBack: () => void
  onStartGame: () => void
}

export function TutorialPage({ onBack, onStartGame }: TutorialPageProps) {
  const [tier, setTier] = useState<TutorialTier | null>(null)
  const [level, setLevel] = useState<number | null>(null)

  const tierData = tier ? TUTORIAL_TIERS.find((t) => t.tier === tier) : undefined
  const lesson = tierData && level ? tierData.lessons.find((l) => l.level === level) : undefined

  // Tier selection screen
  if (!tierData) {
    return (
      <div className="page tutorial-page">
        <div className="page-header">
          <button type="button" className="back-btn" onClick={onBack}>
            ← 홈으로
          </button>
          <h1>🎓 체스 튜토리얼</h1>
        </div>
        <p className="page-lead">
          초급부터 고급까지 단계별로 체스를 체계적으로 배워보세요. 각 단계는 이전 단계의 개념을
          바탕으로 이어집니다.
        </p>
        <div className="tier-grid">
          {TUTORIAL_TIERS.map((t) => (
            <button
              key={t.tier}
              type="button"
              className="tier-card"
              onClick={() => {
                setTier(t.tier)
                setLevel(null)
              }}
            >
              <span className="tier-card-label">{t.label}</span>
              <span className="tier-card-desc">{t.description}</span>
              <span className="tier-card-count">{t.lessons.length}개 레슨</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Lesson detail screen
  if (lesson) {
    const idx = tierData.lessons.findIndex((l) => l.level === lesson.level)
    const prev = tierData.lessons[idx - 1]
    const next = tierData.lessons[idx + 1]

    return (
      <div className="page tutorial-page">
        <div className="page-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => setLevel(null)}
          >
            ← {tierData.label} 목록
          </button>
          <h1>
            {TIER_LABELS[tierData.tier]} {lesson.level}단계
          </h1>
        </div>

        <div className="lesson-detail">
          <div className="lesson-text">
            <h2>{lesson.title}</h2>
            <p className="lesson-summary">{lesson.summary}</p>
            <ul className="rules-list">
              {lesson.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="lesson-board-panel">
            <p className="demo-caption">{lesson.caption}</p>
            <LessonPractice key={`${tierData.tier}-${lesson.level}`} lesson={lesson} />
          </div>
        </div>

        <div className="lesson-nav">
          <button
            type="button"
            className="lesson-nav-btn"
            disabled={!prev}
            onClick={() => prev && setLevel(prev.level)}
          >
            ← 이전 레슨
          </button>
          <button type="button" className="cta-btn cta-primary" onClick={onStartGame}>
            ♟️ 게임에서 연습하기
          </button>
          <button
            type="button"
            className="lesson-nav-btn"
            disabled={!next}
            onClick={() => next && setLevel(next.level)}
          >
            다음 레슨 →
          </button>
        </div>
      </div>
    )
  }

  // Level list screen for the chosen tier
  return (
    <div className="page tutorial-page">
      <div className="page-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => setTier(null)}
        >
          ← 단계 선택
        </button>
        <h1>{tierData.label}</h1>
      </div>
      <p className="page-lead">{tierData.description}</p>
      <div className="lesson-grid">
        {tierData.lessons.map((l) => (
          <button
            key={l.level}
            type="button"
            className="lesson-tile"
            onClick={() => setLevel(l.level)}
          >
            <span className="lesson-tile-level">{l.level}</span>
            <span className="lesson-tile-title">{l.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

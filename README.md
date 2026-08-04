# 체스 게임

노트북과 태블릿의 웹브라우저에서 바로 즐길 수 있는 체스 웹앱입니다. 같은 기기에서 두 사람이 번갈아 두는 로컬 대전과, 자체 제작 체스 엔진과 겨루는 AI 대전을 모두 지원하며, 서버나 로그인 없이 정적 파일만으로 동작합니다.

## 주요 기능

- `chess.js` 기반의 완전한 체스 규칙 검증 (합법수, 캐슬링, 앙파상, 프로모션, 체크/체크메이트/스테일메이트/무승부 판정)
- 마우스 클릭과 터치를 모두 지원하는 탭-투-무브 방식 (드래그 불필요, 태블릿 친화적)
- 선택한 기물의 이동 가능 칸, 마지막 이동, 체크 상태 하이라이트
- 승급 기물 선택 다이얼로그, 기보(이동 기록), 잡은 기물 표시
- 새 게임, 무르기(undo), 보드 뒤집기 컨트롤
- 노트북 가로 화면과 태블릿/모바일 세로 화면 모두에 대응하는 반응형 레이아웃
- **AI 대전**: 왕초보(1)부터 마스터(10)까지 10단계 난이도로 자체 제작 체스 엔진과 대전. 백/흑 색상 선택 가능, AI 계산은 Web Worker에서 실행되어 UI가 멈추지 않음

## AI 엔진

- Material + Piece-Square Table 평가 함수와 alpha-beta 가지치기가 적용된 negamax 탐색(`src/chess/engine.ts`)
- 난이도가 낮을수록 탐색 깊이가 얕고, 무작위 수를 둘 확률과 평가 노이즈가 커져 약하게 플레이함
- 난이도가 높을수록 반복 심화 탐색(iterative deepening)으로 시간 예산(최대 2초) 안에서 더 깊이 탐색
- 계산은 `src/chess/ai.worker.ts` 워커 스레드에서 수행되어 메인 UI 스레드를 막지 않음

## 개발

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run lint     # oxlint 검사
```

`npm run build`로 생성되는 `dist/` 폴더는 정적 파일이므로 Vercel, Netlify, GitHub Pages 등 어떤 정적 호스팅에도 그대로 배포할 수 있습니다.

## 구조

```
src/
  chess/
    useChessGame.ts   # chess.js를 감싼 게임 상태/로직 훅
    pieces.ts          # 기물 유니코드, 좌표 상수
    evaluation.ts       # 기물 가치 + Piece-Square Table 평가 함수
    engine.ts           # negamax + alpha-beta 탐색, 난이도 1~10 설정
    ai.worker.ts         # AI 계산용 Web Worker 엔트리
    useAiWorker.ts        # 워커와 통신하는 Promise 기반 훅
  components/
    Board.tsx          # 8x8 체스판 렌더링과 클릭 이동 처리
    PromotionDialog.tsx
    StatusBar.tsx
    CapturedPieces.tsx
    MoveList.tsx
    Controls.tsx
    AiSettings.tsx      # 모드/난이도/색상 선택 UI
  App.tsx
```

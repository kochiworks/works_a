# 체스 게임

노트북과 태블릿의 웹브라우저에서 바로 즐길 수 있는 체스 웹앱입니다. 같은 기기에서 두 사람이 번갈아 두는 로컬 대전 방식이며, 서버나 로그인 없이 정적 파일만으로 동작합니다.

## 주요 기능

- `chess.js` 기반의 완전한 체스 규칙 검증 (합법수, 캐슬링, 앙파상, 프로모션, 체크/체크메이트/스테일메이트/무승부 판정)
- 마우스 클릭과 터치를 모두 지원하는 탭-투-무브 방식 (드래그 불필요, 태블릿 친화적)
- 선택한 기물의 이동 가능 칸, 마지막 이동, 체크 상태 하이라이트
- 승급 기물 선택 다이얼로그, 기보(이동 기록), 잡은 기물 표시
- 새 게임, 무르기(undo), 보드 뒤집기 컨트롤
- 노트북 가로 화면과 태블릿/모바일 세로 화면 모두에 대응하는 반응형 레이아웃

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
  components/
    Board.tsx          # 8x8 체스판 렌더링과 클릭 이동 처리
    PromotionDialog.tsx
    StatusBar.tsx
    CapturedPieces.tsx
    MoveList.tsx
    Controls.tsx
  App.tsx
```

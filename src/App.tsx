import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Color, Move } from 'chess.js'
import { Board } from './components/Board'
import { PromotionDialog } from './components/PromotionDialog'
import { StatusBar } from './components/StatusBar'
import { CapturedPieces } from './components/CapturedPieces'
import { MoveList } from './components/MoveList'
import { Controls } from './components/Controls'
import { AiSettings, type GameMode, type LocalField } from './components/AiSettings'
import type { PlayerSummary } from './components/PlayerList'
import { HomePage } from './pages/HomePage'
import { RulesPage } from './pages/RulesPage'
import { TutorialPage } from './pages/TutorialPage'
import { useChessGame } from './chess/useChessGame'
import { useAiWorker } from './chess/useAiWorker'
import { AI_SPEED_PRESETS } from './chess/engine'
import {
  playCaptureSound,
  playCheckSound,
  playCheckmateSound,
  playMoveSound,
  setSoundEnabled,
} from './audio/sound'
import {
  recordResult,
  resetAiRecord,
  resetPlayerAiRecords,
  resetAllAiRecords,
  getPlayerAiRecords,
} from './state/records'
import { useAiRecords } from './state/useAiRecords'
import {
  recordLocalResult,
  resetLocalRecord,
  resetPlayerLocalRecords,
  resetAllLocalRecords,
  getLocalRecord,
} from './state/localRecords'
import { useLocalRecords } from './state/useLocalRecords'
import './App.css'

function loadStoredName(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function persistName(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore write failures (e.g. private browsing quota)
  }
}

const PLAYER_NAME_KEY = 'chess.playerName'
const LOCAL_PLAYER1_KEY = 'chess.localPlayer1Name'
const LOCAL_PLAYER2_KEY = 'chess.localPlayer2Name'

type View = 'home' | 'rules' | 'tutorial' | 'play'

function App() {
  const [view, setView] = useState<View>('home')
  const [soundOn, setSoundOn] = useState(true)

  const handleMove = useCallback((move: Move) => {
    if (move.san.endsWith('#')) {
      playCheckmateSound()
    } else if (move.san.endsWith('+')) {
      playCheckSound()
    } else if (move.captured) {
      playCaptureSound()
    } else {
      playMoveSound()
    }
  }, [])

  const {
    board,
    fen,
    turn,
    selected,
    legalTargets,
    lastMove,
    status,
    checkSquare,
    capturedPieces,
    pendingPromotion,
    orientation,
    moveHistory,
    canUndo,
    isGameOver,
    trySelectOrMove,
    makeMove,
    resolvePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
    setOrientation,
  } = useChessGame(handleMove)

  const { requestMove } = useAiWorker()

  const [mode, setMode] = useState<GameMode>('local')
  const [aiLevel, setAiLevel] = useState(5)
  const [playerColor, setPlayerColor] = useState<Color>('w')
  const [aiThinking, setAiThinking] = useState(false)
  const [aiMoveDelay, setAiMoveDelay] = useState<number>(AI_SPEED_PRESETS[1].delayMs)
  const [faceToFace, setFaceToFace] = useState(false)
  const [playerName, setPlayerName] = useState<string>(() =>
    loadStoredName(PLAYER_NAME_KEY, '플레이어'),
  )
  const [localPlayer1Name, setLocalPlayer1Name] = useState<string>(() =>
    loadStoredName(LOCAL_PLAYER1_KEY, '플레이어1'),
  )
  const [localPlayer2Name, setLocalPlayer2Name] = useState<string>(() =>
    loadStoredName(LOCAL_PLAYER2_KEY, '플레이어2'),
  )
  const [activeLocalField, setActiveLocalField] = useState<LocalField>('p1')
  const aiRecordsState = useAiRecords()
  const localRecordsState = useLocalRecords()
  const aiColor: Color = playerColor === 'w' ? 'b' : 'w'

  const playerAiRecords = getPlayerAiRecords(playerName)
  const localPairRecord = getLocalRecord(localPlayer1Name || '플레이어1', localPlayer2Name || '플레이어2')

  const savedPlayers = useMemo<PlayerSummary[]>(() => {
    const summaries = new Map<string, PlayerSummary>()
    const ensure = (name: string) => {
      let entry = summaries.get(name)
      if (!entry) {
        entry = {
          name,
          ai: { wins: 0, losses: 0, draws: 0 },
          local: { wins: 0, losses: 0, draws: 0 },
        }
        summaries.set(name, entry)
      }
      return entry
    }

    // AI-mode and local 2-player records are tracked independently per player;
    // they are never summed together, only shown side by side.
    for (const [name, botRecords] of Object.entries(aiRecordsState)) {
      const entry = ensure(name)
      for (const record of Object.values(botRecords)) {
        entry.ai.wins += record.wins
        entry.ai.losses += record.losses
        entry.ai.draws += record.draws
      }
    }

    for (const pair of Object.values(localRecordsState)) {
      const [nameA, nameB] = pair.names
      const entryA = ensure(nameA)
      const entryB = ensure(nameB)
      entryA.local.wins += pair.wins[nameA] ?? 0
      entryA.local.losses += pair.wins[nameB] ?? 0
      entryA.local.draws += pair.draws
      entryB.local.wins += pair.wins[nameB] ?? 0
      entryB.local.losses += pair.wins[nameA] ?? 0
      entryB.local.draws += pair.draws
    }

    const totalGames = (p: PlayerSummary) =>
      p.ai.wins + p.ai.losses + p.ai.draws + p.local.wins + p.local.losses + p.local.draws

    return Array.from(summaries.values()).sort((a, b) => {
      const gamesA = totalGames(a)
      const gamesB = totalGames(b)
      if (gamesB !== gamesA) return gamesB - gamesA
      return a.name.localeCompare(b.name, 'ko')
    })
  }, [aiRecordsState, localRecordsState])

  useEffect(() => {
    persistName(PLAYER_NAME_KEY, playerName)
  }, [playerName])

  useEffect(() => {
    persistName(LOCAL_PLAYER1_KEY, localPlayer1Name)
  }, [localPlayer1Name])

  useEffect(() => {
    persistName(LOCAL_PLAYER2_KEY, localPlayer2Name)
  }, [localPlayer2Name])

  useEffect(() => {
    setOrientation(mode === 'ai' ? playerColor : 'w')
  }, [mode, playerColor, setOrientation])

  const resultRecordedRef = useRef(false)
  useEffect(() => {
    const isTerminal = status === 'checkmate' || status === 'stalemate' || status === 'draw'
    if (!isTerminal) {
      resultRecordedRef.current = false
      return
    }
    if (resultRecordedRef.current) return
    resultRecordedRef.current = true

    if (mode === 'ai') {
      const result = status === 'checkmate' ? (turn === playerColor ? 'loss' : 'win') : 'draw'
      recordResult(playerName, aiLevel, result)
    } else {
      const p1 = localPlayer1Name || '플레이어1'
      const p2 = localPlayer2Name || '플레이어2'
      let winnerName: string | null = null
      if (status === 'checkmate') {
        const winnerColor = turn === 'w' ? 'b' : 'w'
        winnerName = winnerColor === 'w' ? p1 : p2
      }
      recordLocalResult(p1, p2, winnerName)
    }
  }, [status, mode, turn, playerColor, aiLevel, playerName, localPlayer1Name, localPlayer2Name])

  useEffect(() => {
    if (mode !== 'ai' || turn !== aiColor || isGameOver || pendingPromotion) {
      return
    }
    let cancelled = false
    setAiThinking(true)
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, aiMoveDelay))
    Promise.all([requestMove(fen, aiLevel), minDelay]).then(([move]) => {
      if (cancelled) return
      setAiThinking(false)
      if (move) {
        makeMove(move.from, move.to, move.promotion)
      }
    })
    return () => {
      cancelled = true
    }
  }, [
    mode,
    turn,
    aiColor,
    fen,
    aiLevel,
    aiMoveDelay,
    isGameOver,
    pendingPromotion,
    requestMove,
    makeMove,
  ])

  const boardLocked = mode === 'ai' && (turn === aiColor || aiThinking)

  const handleSquareClick = (square: Parameters<typeof trySelectOrMove>[0]) => {
    if (boardLocked) return
    trySelectOrMove(square)
  }

  const handleModeChange = (nextMode: GameMode) => {
    setMode(nextMode)
    reset()
  }

  const handlePlayerColorChange = (color: Color) => {
    setPlayerColor(color)
    reset()
  }

  const handleResetBotRecord = (level: number) => {
    resetAiRecord(playerName, level)
  }

  const handleResetLocalPairRecord = () => {
    resetLocalRecord(localPlayer1Name || '플레이어1', localPlayer2Name || '플레이어2')
  }

  const handleResetAllRecords = () => {
    if (!window.confirm('모든 승패 기록을 초기화할까요? 이 작업은 되돌릴 수 없습니다.')) return
    resetAllAiRecords()
    resetAllLocalRecords()
  }

  const handleResetPlayer = (name: string) => {
    if (!window.confirm(`'${name}'님의 모든 기록을 초기화할까요? 이 작업은 되돌릴 수 없습니다.`)) return
    resetPlayerAiRecords(name)
    resetPlayerLocalRecords(name)
  }

  const handleSelectSavedPlayer = (name: string) => {
    if (mode === 'ai') {
      setPlayerName(name)
    } else if (activeLocalField === 'p2') {
      setLocalPlayer2Name(name)
    } else {
      setLocalPlayer1Name(name)
    }
  }

  const handleToggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev
      setSoundEnabled(next)
      return next
    })
  }

  if (view === 'home') {
    return (
      <div className="app">
        <HomePage
          onNavigateRules={() => setView('rules')}
          onNavigateTutorial={() => setView('tutorial')}
          onNavigatePlay={() => setView('play')}
        />
      </div>
    )
  }

  if (view === 'rules') {
    return (
      <div className="app">
        <RulesPage
          onBack={() => setView('home')}
          onStartGame={() => setView('play')}
          onStartTutorial={() => setView('tutorial')}
        />
      </div>
    )
  }

  if (view === 'tutorial') {
    return (
      <div className="app">
        <TutorialPage onBack={() => setView('home')} onStartGame={() => setView('play')} />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <button type="button" className="back-btn header-back-btn" onClick={() => setView('home')}>
          ← 홈
        </button>
        <h1>♞ 체스</h1>
        <button
          type="button"
          className="sound-toggle"
          onClick={handleToggleSound}
          aria-label={soundOn ? '효과음 끄기' : '효과음 켜기'}
          title={soundOn ? '효과음 끄기' : '효과음 켜기'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </header>

      <main className="app-main">
        <div className="board-column">
          <AiSettings
            mode={mode}
            onModeChange={handleModeChange}
            aiLevel={aiLevel}
            onLevelChange={setAiLevel}
            playerColor={playerColor}
            onPlayerColorChange={handlePlayerColorChange}
            aiMoveDelay={aiMoveDelay}
            onAiMoveDelayChange={setAiMoveDelay}
            faceToFace={faceToFace}
            onFaceToFaceChange={setFaceToFace}
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            records={playerAiRecords}
            onResetBotRecord={handleResetBotRecord}
            localPlayer1Name={localPlayer1Name}
            onLocalPlayer1NameChange={setLocalPlayer1Name}
            localPlayer2Name={localPlayer2Name}
            onLocalPlayer2NameChange={setLocalPlayer2Name}
            localPairRecord={localPairRecord}
            onResetLocalPairRecord={handleResetLocalPairRecord}
            onResetAllRecords={handleResetAllRecords}
            savedPlayers={savedPlayers}
            onSelectSavedPlayer={handleSelectSavedPlayer}
            onLocalFieldFocus={setActiveLocalField}
            onResetPlayer={handleResetPlayer}
          />
          <StatusBar status={status} turn={turn} aiThinking={aiThinking} />
          <Board
            board={board}
            orientation={orientation}
            selected={selected}
            legalTargets={legalTargets}
            lastMove={lastMove}
            inCheckSquare={checkSquare}
            onSquareClick={handleSquareClick}
            faceToFace={mode === 'local' && faceToFace}
          />
          <Controls
            onNewGame={reset}
            onUndo={undo}
            onFlip={flipBoard}
            canUndo={canUndo}
            disabled={aiThinking}
          />
        </div>

        <aside className="side-panel">
          <CapturedPieces captured={capturedPieces} />
          <MoveList moves={moveHistory} />
        </aside>
      </main>

      {pendingPromotion && (
        <PromotionDialog
          color={pendingPromotion.color}
          onChoose={resolvePromotion}
          onCancel={cancelPromotion}
        />
      )}
    </div>
  )
}

export default App

export type RecordTotals = {
  wins: number
  losses: number
  draws: number
}

export type PlayerSummary = {
  name: string
  ai: RecordTotals
  local: RecordTotals
}

type PlayerListProps = {
  players: PlayerSummary[]
  onSelect: (name: string) => void
  activeName?: string
}

function hasGames(totals: RecordTotals): boolean {
  return totals.wins + totals.losses + totals.draws > 0
}

export function PlayerList({ players, onSelect, activeName }: PlayerListProps) {
  if (players.length === 0) return null

  return (
    <div className="player-list">
      <h2>저장된 플레이어</h2>
      <ul>
        {players.map((player) => (
          <li key={player.name}>
            <button
              type="button"
              className={player.name === activeName ? 'active' : ''}
              onClick={() => onSelect(player.name)}
            >
              <span className="player-list-name">{player.name}</span>
              {hasGames(player.ai) && (
                <span className="player-list-stat">
                  AI {player.ai.wins}승 {player.ai.losses}패 {player.ai.draws}무
                </span>
              )}
              {hasGames(player.local) && (
                <span className="player-list-stat">
                  2인 {player.local.wins}승 {player.local.losses}패 {player.local.draws}무
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

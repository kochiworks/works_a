export type PlayerSummary = {
  name: string
  wins: number
  losses: number
  draws: number
}

type PlayerListProps = {
  players: PlayerSummary[]
  onSelect: (name: string) => void
  activeName?: string
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
              <span className="player-list-stat">
                {player.wins}승 {player.losses}패 {player.draws}무
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

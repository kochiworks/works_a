type MoveListProps = {
  moves: string[]
}

export function MoveList({ moves }: MoveListProps) {
  const pairs: [string, string | undefined][] = []
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]])
  }

  return (
    <div className="move-list">
      <h2>기보</h2>
      {pairs.length === 0 ? (
        <p className="move-list-empty">아직 이동이 없습니다</p>
      ) : (
        <ol>
          {pairs.map(([white, black], i) => (
            <li key={i}>
              <span className="move-number">{i + 1}.</span>
              <span className="move-white">{white}</span>
              <span className="move-black">{black ?? ''}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

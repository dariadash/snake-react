import { useGameStore } from '../store'

export const Stats = () => {
  const level = useGameStore((s) => s.level)
  const score = useGameStore((s) => s.score)
  const minScore = useGameStore((s) => s.minScore)
  const timerMs = useGameStore((s) => s.timerMs)

  return (
    <div className='stats'>
      <div>Level: {level}</div>
      <div>Score: {score}</div>
      <div>Target: {minScore}</div>
      <div>Time: {(timerMs / 1000).toFixed(1)}s</div>
    </div>
  )
}

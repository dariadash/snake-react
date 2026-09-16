import { create } from 'zustand'
import { LEVELS } from '../const'
import { useSnakeStore } from './snakeStore'

type GameStore = {
  score: number
  timerMs: number
  foodSpawnMs: number
  level: number
  minScore: number
  isLevelActive: boolean
  gameWin: boolean
  addScore: (delta: number) => void
  tickTimer: () => void
  resetLevel: () => void
  resetGame: () => void
  levelSwitch: () => void
}

const FIRST_LEVEL = LEVELS[0]

export const useGameStore = create<GameStore>()((set, get) => ({
  score: 0,
  timerMs: FIRST_LEVEL.time,
  foodSpawnMs: FIRST_LEVEL.foodSpawn,
  level: FIRST_LEVEL.level,
  minScore: FIRST_LEVEL.minScore,
  isLevelActive: true,
  gameWin: false,

  addScore: (delta) =>
    set((state) => ({ score: state.score + delta })),

  tickTimer: () =>
    set((state) => ({
      timerMs: state.timerMs >= 100 ? state.timerMs - 100 : 0,
    })),

  resetLevel: () => {
    set({ isLevelActive: true, score: 0 })
    useSnakeStore.getState().clearLevelEntities()
  },

  resetGame: () => {
    useSnakeStore.getState().resetSnake()
    get().resetLevel()
    set({
      level: FIRST_LEVEL.level,
      minScore: FIRST_LEVEL.minScore,
      timerMs: FIRST_LEVEL.time,
      foodSpawnMs: FIRST_LEVEL.foodSpawn,
      gameWin: false,
    })
  },

  levelSwitch: () => {
    const { level, minScore, score, resetGame, resetLevel } = get()

    if (level < 5 && minScore <= score) {
      const conf = confirm(`Level ${level} completed! Score: ${score}\n\n\nContinue to next level?`)
      if (conf) {
        const nextLevelIndex = level
        const nextLevel = LEVELS[nextLevelIndex]

        set({
          level: nextLevel.level,
          minScore: nextLevel.minScore,
          timerMs: nextLevel.time,
          foodSpawnMs: nextLevel.foodSpawn,
        })
        resetLevel()
      } else {
        alert(`GAME OVER - You reached level ${level} with score ${score}`)
        resetGame()
      }
    } else if (level === 5 && minScore <= score) {
      set({ gameWin: true })
      alert(`WIN \nYou completed all levels with score: ${score}`)
      resetGame()
    } else {
      alert('GAME OVER')
      resetGame()
    }
  },
}))

import { create } from 'zustand'
import { INIT_SNAKE_STATE } from '../const'
import { changeCoord, growSnake, randomCoord, selfEatSnake } from '../helpers'
import { useGameStore } from './gameStore'

type SnakeStore = {
  snakeState: number[][]
  foodCoords: number[][]
  direction: string
  selfEatCoord: number[]
  setDirection: (direction: string) => void
  snakeMoving: (newDirection?: string) => void
  handleKeyDown: (event: KeyboardEvent) => void
  foodSpawn: () => void
  resetSnake: () => void
  clearLevelEntities: () => void
}

const freshSnakeState = () => INIT_SNAKE_STATE.map((row) => [...row])

export const useSnakeStore = create<SnakeStore>()((set, get) => ({
  snakeState: freshSnakeState(),
  foodCoords: [],
  direction: '',
  selfEatCoord: [],

  setDirection: (direction) => set({ direction }),

  snakeMoving: (newDirection) => {
    if (newDirection) {
      set({ direction: newDirection })
    }

    const direction = newDirection ?? get().direction
    if (!direction) return

    const { snakeState, foodCoords } = get()
    const newSnake = changeCoord(snakeState, direction)

    const head = newSnake[newSnake.length - 1]
    const foodEatenIndex = foodCoords.findIndex(food =>
      food[0] === head[0] && food[1] === head[1]
    )

    const selfEatenIndex = newSnake.findIndex(body =>
      body[0] === head[0] && body[1] === head[1]
    )

    if (foodEatenIndex !== -1) {
      const newFood = [...foodCoords]
      newFood.splice(foodEatenIndex, 1)
      set({ foodCoords: newFood, snakeState: growSnake(newSnake) })
      useGameStore.getState().addScore(100)
    } else if (selfEatenIndex !== -1 && selfEatenIndex !== newSnake.length - 1) {
      const afterSelfEatSnake = selfEatSnake(newSnake)
      const cuttedSnakeLength = newSnake.length - afterSelfEatSnake.length
      set({ snakeState: afterSelfEatSnake, selfEatCoord: newSnake[selfEatenIndex] })
      useGameStore.getState().addScore(-100 * cuttedSnakeLength)
    } else {
      set({ snakeState: newSnake })
    }
  },

  handleKeyDown: (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        get().snakeMoving('up')
        break
      case 'KeyA':
      case 'ArrowLeft':
        get().snakeMoving('left')
        break
      case 'KeyS':
      case 'ArrowDown':
        get().snakeMoving('down')
        break
      case 'KeyD':
      case 'ArrowRight':
        get().snakeMoving('right')
        break
      default:
        return
    }
  },

  foodSpawn: () => {
    const { foodCoords } = get()

    let newX = randomCoord()
    let newY = randomCoord()

    if (foodCoords.find((food) => food[0] === newX && food[1] === newY)) {
      newX = randomCoord()
      newY = randomCoord()
    }

    set({ foodCoords: [...foodCoords, [newX, newY]] })
  },

  resetSnake: () => set({ snakeState: freshSnakeState() }),

  clearLevelEntities: () => set({ foodCoords: [], selfEatCoord: [] }),
}))

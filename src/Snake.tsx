import { useEffect } from 'react'

import './Snake.css'

import { useSnakeStore, useGameStore } from './store'
import { GameBoard, Stats, VictoryScreen } from './components'


export const Snake = () => {
    const snakeMoving = useSnakeStore((s) => s.snakeMoving)
    const handleKeyDown = useSnakeStore((s) => s.handleKeyDown)
    const foodSpawn = useSnakeStore((s) => s.foodSpawn)

    const timerMs = useGameStore((s) => s.timerMs)
    const foodSpawnMs = useGameStore((s) => s.foodSpawnMs)
    const isLevelActive = useGameStore((s) => s.isLevelActive)
    const tickTimer = useGameStore((s) => s.tickTimer)
    const levelSwitch = useGameStore((s) => s.levelSwitch)

    useEffect(() => {
        if (!isLevelActive || timerMs <= 0) return

        const timeSkip = setInterval(() => {
            tickTimer()
        }, 100)

        return () => {
            clearInterval(timeSkip)
        }
    }, [isLevelActive, timerMs, tickTimer])

    useEffect(() => {
        if (timerMs === 0 && isLevelActive) {
            const timeoutId = setTimeout(() => {
                levelSwitch()
            }, 0)

            return () => clearTimeout(timeoutId)
        }
    }, [isLevelActive, levelSwitch, timerMs])

    useEffect(() => {
        const autoSnakeMove = setInterval(() => {
            snakeMoving()
        }, 1000)

        return () => clearInterval(autoSnakeMove)
    }, [snakeMoving])

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)

        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        const foodGenerator = setInterval(function () {
            foodSpawn()
        }, foodSpawnMs)

        return () => clearInterval(foodGenerator)
    }, [foodSpawn, foodSpawnMs])

    return (
        <div>
            <Stats />
            <VictoryScreen />
            <GameBoard />
        </div>
    )
}

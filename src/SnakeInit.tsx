/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react'
import { ChromaKeyVideo } from 'chromakey-video-react'
import './SnakeInit.css'
import { GRID_SIZE, INIT_SNAKE_STATE, LEVELS } from './const'
import { changeCoord, growSnake, randomCoord, selfEatSnake } from './helpers'


export const SnakeInit = () => {
    const [snakeState, setSnakeState] = useState<number[][]>(INIT_SNAKE_STATE)
    const [foodCoords, setFoodCoords] = useState<number[][]>([])

    const [direction, setDirection] = useState<string>('')
    const directionRef = useRef(direction)

    const [score, setScore] = useState<number>(0)
    const [timerMs, setTimerMs] = useState<number>(LEVELS[0].time)
    const [foodSpawnMs, setFoodSpawnMs] = useState<number>(LEVELS[0].foodSpawn)

    const [level, setLevel] = useState<number>(LEVELS[0].level)
    const [minScore, setMinScore] = useState<number>(LEVELS[0].minScore)
    const [isLevelActive, setIsLevelActive] = useState<boolean>(true)

    const [gameWin, setGameWin] = useState<boolean>(false)
    const [selfEatCoord, setSelfEatCoord] = useState<number[]>([])

    const snakeMoving = useCallback((newDirection: string) => {
        setDirection(newDirection)

        const newSnake = changeCoord(snakeState, newDirection)

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
            setFoodCoords(newFood)
            setSnakeState(growSnake(newSnake))
            setScore(prevScore => prevScore + 100)
        } else if (selfEatenIndex !== -1 && selfEatenIndex !== newSnake.length - 1) {
            const afterSelfEatSnake = selfEatSnake(newSnake)
            const cuttedSnakeLength = newSnake.length - afterSelfEatSnake.length
            setSnakeState(afterSelfEatSnake)
            setScore(prevScore => prevScore - 100 * cuttedSnakeLength)
            setSelfEatCoord(newSnake[selfEatenIndex])
        } else {
            setSnakeState(newSnake)
        }
    }, [foodCoords, snakeState])

    const handleKeyDown = useCallback((event: any) => {
        const key = event.code
        let newDirection = ''

        switch (key) {
            case 'KeyW':
            case 'ArrowUp':
                newDirection = 'up'
                break
            case 'KeyA':
            case 'ArrowLeft':
                newDirection = 'left'
                break
            case 'KeyS':
            case 'ArrowDown':
                newDirection = 'down'
                break
            case 'KeyD':
            case 'ArrowRight':
                newDirection = 'right'
                break
            default:
                return
        }

        snakeMoving(newDirection)

    }, [snakeMoving])

    const foodSpawn = useCallback(() => {
        let newX = randomCoord()
        let newY = randomCoord()

        if (foodCoords.find((food) => food[0] === newX && food[1] === newY)) {
            newX = randomCoord()
            newY = randomCoord()
        }

        setFoodCoords(prevFood => [...prevFood, [newX, newY]])
    }, [foodCoords])

    const resetLevel = () => {
        setIsLevelActive(true)
        setScore(0)
        setFoodCoords([])
        setSelfEatCoord([])
    }

    const resetGame = useCallback(() => {
        setLevel(LEVELS[0].level)
        setMinScore(LEVELS[0].minScore)
        setTimerMs(LEVELS[0].time)
        setFoodSpawnMs(LEVELS[0].foodSpawn)
        setSnakeState(INIT_SNAKE_STATE)
        resetLevel()
        setGameWin(false)
    }, [])

    const levelSwitch = useCallback(() => {
        if (level < 5 && minScore <= score) {
            const conf = confirm(`Level ${level} completed! Score: ${score}\n\n\nContinue to next level?`)
            if (conf) {
                const nextLevelIndex = level
                const nextLevel = LEVELS[nextLevelIndex]

                setLevel(nextLevel.level)
                setMinScore(nextLevel.minScore)
                setTimerMs(nextLevel.time)
                setFoodSpawnMs(nextLevel.foodSpawn)
                resetLevel()
            } else {
                alert(`GAME OVER - You reached level ${level} with score ${score}`)
                resetGame()
            }
        } else if (level === 5 && minScore <= score) {
            setGameWin(true)
            alert(`WIN \nYou completed all levels with score: ${score}`)
            resetGame()
        } else {
            alert('GAME OVER')
            resetGame()
        }
    }, [level, minScore, resetGame, score])

    useEffect(() => {
        let timeSkip: number

        if (isLevelActive && timerMs > 0) {
            timeSkip = setInterval(() => {
                setTimerMs(prev => {
                    const newTime = prev - 100
                    return newTime >= 0 ? newTime : 0
                })
            }, 100)
        }

        return () => {
            if (timeSkip) clearInterval(timeSkip)
        }
    }, [isLevelActive, timerMs])

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
            if (directionRef.current) {
                snakeMoving(directionRef.current)
            }
        }, 1000)

        return () => clearInterval(autoSnakeMove)
    }, [snakeMoving])

    useEffect(() => {
        directionRef.current = direction
    }, [direction])

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
            <div className='stats'>
                <div>Level: {level}</div>
                <div>Score: {score}</div>
                <div>Target: {minScore}</div>
                <div>Time: {(timerMs / 1000).toFixed(1)}s</div>
            </div>
            {gameWin &&
                <>
                    <ChromaKeyVideo
                        src="src/assets/Happy_Wheels_victory_green_screen.mp4"
                        color="#00ff00"
                        similarity={0.4}
                        despill={true}
                        className='win-video'
                    />
                    <iframe src="src/assets/Happy_Wheels_victory_green_screen.mp3" allow="autoplay" style={{ display: "none" }}></iframe>
                </>
            }
            <div className='grid' onKeyDown={handleKeyDown}>
                {Array.from({ length: GRID_SIZE }, (_, i) => i).map((i) =>
                    Array.from({ length: GRID_SIZE }, (_, j) => j).map((j) =>
                        <div
                            key={`${i}-${j}`}
                            className='cell'
                        >
                            {snakeState.find((st) => st.length === [i, j].length &&
                                st.every((val, idx) => val === [i, j][idx])) &&
                                <div className='snake' />
                            }
                            {selfEatCoord.length === [i, j].length &&
                                selfEatCoord.every((val, idx) => val === [i, j][idx]) &&
                                <>
                                    <ChromaKeyVideo
                                        src="src/assets/deltarune_explosion_greenscreen.mp4"
                                        color="#00ff00"
                                        similarity={0.4}
                                        despill={true}
                                        className='fail-video'
                                        loop={false}
                                    />
                                    <iframe src="src/assets/deltarune_explosion_greenscreen.mp3" allow="autoplay" style={{ display: "none" }}></iframe>
                                </>
                            }
                            {foodCoords.find((st) => st.length === [i, j].length &&
                                st.every((val, idx) => val === [i, j][idx])) &&
                                <div className='food' />
                            }
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
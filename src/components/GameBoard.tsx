import ChromaKeyVideo from "chromakey-video-react"
import { GRID_SIZE } from "../const"
import { useSnakeStore } from "../store"
import explosionVideo from "../assets/deltarune_explosion_greenscreen.mp4"
import explosionAudio from "../assets/deltarune_explosion_greenscreen.mp3"

export const GameBoard = () => {
    const snakeState = useSnakeStore((s) => s.snakeState)
    const foodCoords = useSnakeStore((s) => s.foodCoords)
    const selfEatCoord = useSnakeStore((s) => s.selfEatCoord)

    return (
        <div className='grid'>
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
                                    src={explosionVideo}
                                    color="#00ff00"
                                    similarity={0.4}
                                    despill={true}
                                    className='fail-video'
                                    loop={false}
                                />
                                <iframe src={explosionAudio} allow="autoplay" style={{ display: "none" }}></iframe>
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
    )
}
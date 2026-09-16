import { ChromaKeyVideo } from 'chromakey-video-react'
import { useGameStore } from '../store'

export const VictoryScreen = () => {
  const gameWin = useGameStore((s) => s.gameWin)

  if (!gameWin) return null

  return (
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
  )
}

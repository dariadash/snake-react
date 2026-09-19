import { ChromaKeyVideo } from 'chromakey-video-react'
import { useGameStore } from '../store'
import victoryVideo from '../assets/Happy_Wheels_victory_green_screen.mp4'
import victoryAudio from '../assets/Happy_Wheels_victory_green_screen.mp3'

export const VictoryScreen = () => {
  const gameWin = useGameStore((s) => s.gameWin)

  if (!gameWin) return null

  return (
    <>
      <ChromaKeyVideo
        src={victoryVideo}
        color="#00ff00"
        similarity={0.4}
        despill={true}
        className='win-video'
      />
      <iframe src={victoryAudio} allow="autoplay" style={{ display: "none" }}></iframe>
    </>
  )
}

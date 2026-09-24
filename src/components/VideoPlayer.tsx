import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"

import { config } from "../data/config"
import useVideoPlayer from "../hooks/useVideoPlayer"
import VideoControls from "./VideoControls"

interface VideoPlayerProps {
  videoUrl?: string
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer()

  const handleVideoEnded = () => {
    navigate("/credits")
  }

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing or clicking a standard browser control
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "BUTTON") return

      if (event.code === "Space") {
        event.preventDefault()
        togglePlay()
      }

      if (event.code === "ArrowRight") {
        seek(Math.min(currentTime + 5, duration))
      }

      if (event.code === "ArrowLeft") {
        seek(Math.max(currentTime - 5, 0))
      }

      if (event.key.toLowerCase() === "m") {
        toggleMute()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentTime, duration, seek, toggleMute, togglePlay])

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-sm text-white/50">
              Preparing your story...
            </p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl || config.mainVideo}
        className="h-full w-full object-contain cursor-pointer"
        playsInline
        preload="metadata"
        onCanPlay={() => setIsLoading(false)}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
      />

      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onPlay={togglePlay}
        onSeek={seek}
        onVolumeChange={changeVolume}
        onMute={toggleMute}
        onFullscreen={toggleFullscreen}
      />
    </motion.div>
  )
}

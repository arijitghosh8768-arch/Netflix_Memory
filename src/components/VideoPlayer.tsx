// @ts-nocheck
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import ReactPlayer from "react-player"

import { config } from "../data/config"
import VideoControls from "./VideoControls"

interface VideoPlayerProps {
  videoUrl?: string
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false) // Start false, play on ready
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPlayOverlay, setShowPlayOverlay] = useState(false) // If autoplay is blocked

  const handleVideoEnded = () => {
    navigate("/credits")
  }

  const togglePlay = () => {
    setShowPlayOverlay(false)
    setIsPlaying(!isPlaying)
  }
  
  const seek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, "seconds")
      setCurrentTime(time)
    }
  }

  const changeVolume = (value: number) => {
    setVolume(value)
    if (value > 0) setIsMuted(false)
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Safety timeout in case YouTube API gets blocked by adblockers/privacy shields
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setShowPlayOverlay(true)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [isLoading])

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [currentTime, duration, isPlaying, isMuted])

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-sm text-white/50">
              Preparing your story...
            </p>
          </div>
        </div>
      )}

      {/* Play Overlay if Autoplay fails */}
      {showPlayOverlay && !isLoading && !isPlaying && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition hover:bg-white/30 hover:scale-110">
            <svg className="h-10 w-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-0">
        {/* @ts-ignore - ReactPlayer types are slightly incompatible with React 19 */}
        <ReactPlayer
          ref={playerRef}
          url={videoUrl || config.mainVideo}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          onReady={() => {
            setIsLoading(false)
            setIsPlaying(true)
          }}
          onError={(e) => {
            console.error("YouTube Player Error:", e)
            setIsLoading(false)
            setShowPlayOverlay(true)
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onProgress={(state: any) => setCurrentTime(state.playedSeconds)}
          onDuration={(duration: number) => setDuration(duration)}
          onEnded={handleVideoEnded}
          onPlay={() => {
            setIsPlaying(true)
            setShowPlayOverlay(false)
          }}
          onPause={() => {
            setIsPlaying(false)
            setShowPlayOverlay(true) // Always show big play button when paused for reliability
          }}
          config={({
            youtube: {
              playerVars: { 
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3
              }
            }
          }) as any}
          style={{ pointerEvents: 'auto' }}
        />
      </div>

      {/* Invisible overlay to capture clicks */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

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

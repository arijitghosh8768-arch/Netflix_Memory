import { useCallback, useEffect, useRef, useState } from "react"

// ponytail: Rebuilding standard HTML5 video controls from scratch. 
// A classic case of choosing aesthetic over standard browser features (<video controls>), 
// but since this is a cinematic experience, the custom UI is justified here.

function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      await video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((value: number) => {
    const video = videoRef.current
    if (!video) return

    video.volume = value
    setVolume(value)

    if (value > 0) {
      video.muted = false
      setIsMuted(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      await video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return {
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
  }
}

export default useVideoPlayer

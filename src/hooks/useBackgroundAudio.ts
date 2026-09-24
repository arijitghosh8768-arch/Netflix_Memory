import { useState, useEffect, useCallback } from "react"

// ponytail: A pure singleton outside of React to prevent overlapping audios.
// No Redux, no Context, no third-party audio libraries.
const globalAudio = new Audio()

export default function useBackgroundAudio(src?: string, loop: boolean = true) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("our-story-audio-muted") === "true"
  })
  
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem("our-story-audio-volume")
    return v ? parseFloat(v) : 0.25
  })

  // Core setup and route lifecycle management
  useEffect(() => {
    if (!src) return

    if (globalAudio.getAttribute("src") !== src) {
      globalAudio.setAttribute("src", src)
      globalAudio.load()
    }
    
    globalAudio.loop = loop
    globalAudio.volume = isMuted ? 0 : volume

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    globalAudio.addEventListener("play", handlePlay)
    globalAudio.addEventListener("pause", handlePause)

    return () => {
      globalAudio.removeEventListener("play", handlePlay)
      globalAudio.removeEventListener("pause", handlePause)
      // Pause automatically when navigating away (e.g., to /watch)
      globalAudio.pause()
    }
  }, [src, loop])

  // Sync volume and mute state
  useEffect(() => {
    globalAudio.volume = isMuted ? 0 : volume
    localStorage.setItem("our-story-audio-muted", String(isMuted))
    localStorage.setItem("our-story-audio-volume", String(volume))
  }, [isMuted, volume])

  const togglePlay = useCallback(() => {
    if (globalAudio.paused) {
      globalAudio.play().catch(() => console.log("Autoplay blocked by browser. User interaction required."))
    } else {
      globalAudio.pause()
    }
  }, [])

  const play = useCallback(() => {
    globalAudio.play().catch(() => console.log("Autoplay blocked by browser. User interaction required."))
  }, [])

  const toggleMute = useCallback(() => setIsMuted(m => !m), [])

  return { isPlaying, isMuted, volume, togglePlay, play, toggleMute, setVolume }
}

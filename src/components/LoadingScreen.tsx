import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

interface LoadingScreenProps {
  onComplete?: () => void
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [videoFailed, setVideoFailed] = useState(false)
  const [needsInteraction, setNeedsInteraction] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Fallback timer if video fails to load or isn't provided
  useEffect(() => {
    if (videoFailed && onComplete) {
      const timer = setTimeout(onComplete, 3200)
      return () => clearTimeout(timer)
    }
  }, [videoFailed, onComplete])

  useEffect(() => {
    if (videoRef.current) {
      // FORCE un-mute via DOM node. React sometimes caches the 'muted' state from previous renders!
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Browser blocked unmuted autoplay
          console.warn("Autoplay with sound blocked:", error)
          setNeedsInteraction(true)
        })
      }
    }
  }, [])

  const handleInteract = () => {
    setNeedsInteraction(false)
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => setVideoFailed(true))
    }
  }

  // Try to play the video. If it fails, fallback to the text animation.
  return (
    <motion.main
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808] text-white overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {!videoFailed && (
        <>
          <video
            ref={videoRef}
            src="/videos/intro.mp4"
            playsInline
            className="h-full w-full object-cover"
            onEnded={onComplete}
            onError={() => setVideoFailed(true)}
          />
          
          {needsInteraction && (
            <div 
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 cursor-pointer"
              onClick={handleInteract}
            >
              <div className="flex flex-col items-center animate-pulse transition hover:scale-105">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                  <svg className="h-10 w-10 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="mt-8 text-lg tracking-[0.3em] font-light text-white/70 uppercase">
                  Click to enter
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {videoFailed && (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.3em]">
              OUR STORY
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 text-sm tracking-[0.35em] text-white/40 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            A story worth remembering
          </motion.p>

          <div className="mt-10 w-48 h-[2px] bg-white/10 overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}
    </motion.main>
  )
}

export default LoadingScreen

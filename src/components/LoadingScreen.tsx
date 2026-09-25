import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface LoadingScreenProps {
  onComplete?: () => void
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [videoFailed, setVideoFailed] = useState(false)

  // Fallback timer if video fails to load or isn't provided
  useEffect(() => {
    if (videoFailed && onComplete) {
      const timer = setTimeout(onComplete, 3200)
      return () => clearTimeout(timer)
    }
  }, [videoFailed, onComplete])

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
        <video
          src="/videos/intro.mp4"
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          onEnded={onComplete}
          onError={() => setVideoFailed(true)}
        />
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

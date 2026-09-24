import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Credits from "../components/Credits"
import FinalMessage from "../components/FinalMessage"
import AudioController from "../components/AudioController"
import useBackgroundAudio from "../hooks/useBackgroundAudio"
import { config } from "../data/config"

export default function CreditsPage() {
  const [phase, setPhase] = useState<"quote" | "credits" | "final">("quote")
  
  const { isPlaying, isMuted, volume, togglePlay, play, toggleMute, setVolume } = useBackgroundAudio(config.audio?.ending, false)

  useEffect(() => {
    // Phase 1: Quote is visible for 4s before cross-fading to the credits
    if (phase === "quote") {
      const timer = setTimeout(() => setPhase("credits"), 4000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    // Attempt to automatically play the ending audio if the browser allows it (usually does since user clicked play on the video previously)
    play()
  }, [play])

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "quote" && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.5 }}
            className="text-center px-6 max-w-xl"
          >
            <p className="text-xl md:text-2xl font-serif text-white/80 italic tracking-wide leading-relaxed">
              "Some stories are meant to be remembered."
            </p>
          </motion.div>
        )}

        {phase === "credits" && (
          <Credits onComplete={() => setPhase("final")} />
        )}

        {phase === "final" && (
          <FinalMessage />
        )}
      </AnimatePresence>

      <AudioController
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
      />
    </main>
  )
}

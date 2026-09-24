import { motion } from "framer-motion"
import { config } from "../data/config"
import { useEffect, useState } from "react"

export default function Credits({ onComplete }: { onComplete: () => void }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
  }, [])

  useEffect(() => {
    // Reduced motion = faster transition, no long scroll
    const timer = setTimeout(onComplete, reducedMotion ? 4000 : 9000)
    return () => clearTimeout(timer)
  }, [onComplete, reducedMotion])

  return (
    <motion.div
      key="credits"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 50 }}
      animate={{ opacity: 1, y: reducedMotion ? 0 : -50 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -100 }}
      transition={{ duration: reducedMotion ? 2 : 8, ease: "linear" }}
      className="text-center space-y-16 md:space-y-24 px-4 w-full max-w-3xl"
    >
      <div>
        <h3 className="text-gray-500 tracking-[0.3em] text-xs md:text-sm mb-6 uppercase">Starring</h3>
        <div className="space-y-4">
          <p className="text-2xl md:text-4xl font-serif text-white">{config.people.person1}</p>
          <p className="text-xl md:text-2xl font-serif text-gray-400">&</p>
          <p className="text-2xl md:text-4xl font-serif text-white">{config.people.person2}</p>
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 tracking-[0.3em] text-xs md:text-sm mb-6 uppercase">A Collection of Moments</h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md mx-auto">
          Memories • Adventures • Little Things • Everything In Between
        </p>
      </div>

      <div className="pt-8 md:pt-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.3em] text-white">OUR STORY</h1>
      </div>
    </motion.div>
  )
}

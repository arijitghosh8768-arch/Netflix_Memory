import { motion } from "framer-motion"
import { RotateCcw, Home } from "lucide-react"
import { useNavigate } from "react-router"
import { config } from "../data/config"
import { useEffect, useState } from "react"

export default function FinalMessage() {
  const navigate = useNavigate()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="text-center px-6 max-w-2xl w-full"
    >
      <p className="text-rose-600 tracking-[0.4em] text-xs font-semibold uppercase mb-10">The End</p>

      <h2 className="text-xl md:text-3xl font-serif leading-relaxed text-white mb-12">
        {config.finalMessage}
      </h2>

      <motion.div
        animate={{ scale: reducedMotion ? 1 : [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-rose-600 text-3xl mb-16"
      >
        ❤️
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <button
          onClick={() => navigate("/watch")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-white/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          Replay Story
        </button>
        
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/10 text-white px-8 py-3 rounded-md font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
        >
          <Home className="w-5 h-5" />
          Back Home
        </button>
      </div>
    </motion.div>
  )
}

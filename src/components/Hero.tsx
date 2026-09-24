import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Info } from "lucide-react"
import { useNavigate } from "react-router"
import { config } from "../data/config"
import MoreInfoModal from "./MoreInfoModal"

export default function Hero() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="relative h-[75vh] md:h-[85vh] w-full">
      <div className="absolute inset-0">
        <img src={config.hero.image} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-12 pb-16 md:pb-24 w-full md:w-2/3 lg:w-1/2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg leading-tight"
        >
          {config.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-sm md:text-lg mb-8 drop-shadow-md max-w-lg leading-relaxed"
        >
          {config.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <button
            onClick={() => navigate("/watch")}
            className="flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded md:rounded-md font-semibold hover:bg-white/80 transition-colors cursor-pointer"
          >
            <Play className="w-5 h-5 fill-black" />
            Play Story
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 md:px-8 py-2 md:py-3 rounded md:rounded-md font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm cursor-pointer"
          >
            <Info className="w-5 h-5" />
            More Info
          </button>
        </motion.div>
      </div>

      <MoreInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={config.hero.title}
        description={config.hero.description}
        image={config.hero.image}
      />
    </div>
  )
}

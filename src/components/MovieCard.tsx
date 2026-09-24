import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useNavigate } from "react-router"
import type { Memory } from "../data/memories"

export default function MovieCard({ memory }: { memory: Memory }) {
  const navigate = useNavigate()

  return (
    <motion.div
      onClick={() => navigate("/watch")}
      className="group relative flex-none w-[200px] md:w-[280px] aspect-video rounded-md overflow-hidden bg-[#141414] cursor-pointer snap-start border border-white/5"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <img src={memory.image} alt={memory.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <Play className="w-10 h-10 md:w-12 md:h-12 text-white opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 fill-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-white font-medium text-sm md:text-base truncate md:group-hover:text-rose-100 transition-colors">{memory.title}</p>
        <div className="flex items-center justify-between mt-1 text-[10px] md:text-xs text-gray-400">
          <span className="truncate mr-2">{memory.category}</span>
          {memory.duration && <span className="shrink-0">{memory.duration}</span>}
        </div>
      </div>
    </motion.div>
  )
}

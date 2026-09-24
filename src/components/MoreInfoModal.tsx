import { motion, AnimatePresence } from "framer-motion"
import { X, Play } from "lucide-react"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"

interface MoreInfoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  image: string
  category?: string
  duration?: string
  videoUrl?: string
}

export default function MoreInfoModal({
  isOpen, onClose, title, description, image, category, duration, videoUrl
}: MoreInfoModalProps) {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden" // Prevent background scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleWatchMemory = () => {
    onClose()
    navigate("/watch", { state: { videoUrl } })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="aspect-video w-full relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{title}</h2>
              
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                {category ? (
                  <span className="text-green-500 font-medium">{category}</span>
                ) : (
                  <span className="text-green-500 font-medium">99% Match</span>
                )}
                {duration && <span>{duration}</span>}
                <span className="border border-gray-600 px-1.5 rounded text-xs uppercase">HD</span>
              </div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
                {description}
              </p>

              {videoUrl && (
                <button
                  onClick={handleWatchMemory}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-white/80 transition-colors w-full sm:w-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Play className="w-5 h-5 fill-black" />
                  Watch Memory
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

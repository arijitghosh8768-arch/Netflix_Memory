import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"

interface MoreInfoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  image: string
}

export default function MoreInfoModal({ isOpen, onClose, title, description, image }: MoreInfoModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    if (isOpen) window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl border border-white/10 z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full relative">
              <img src={image} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                <span className="text-green-500 font-medium">99% Match</span>
                <span>Our Story</span>
                <span className="border border-gray-600 px-1.5 rounded text-xs">HD</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

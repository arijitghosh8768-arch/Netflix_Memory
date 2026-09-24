import { motion } from "framer-motion"
import { timeline } from "../data/timeline"
import { useState, useEffect } from "react"

export default function TimelinePreview() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  return (
    <div id="timeline" className="px-4 md:px-12 py-12 md:py-24 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-16 text-center tracking-wide">Our Timeline</h2>
      <div className="relative border-l-2 border-[#181818] ml-4 md:ml-8 space-y-16">
        {timeline.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: reducedMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : i * 0.1 }}
            className="relative pl-8 md:pl-12"
          >
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-rose-600 border-4 border-[#080808]" />
            <p className="text-rose-500 text-sm font-semibold tracking-wider uppercase mb-1">{event.date}</p>
            <h3 className="text-xl md:text-2xl text-white font-bold mb-3">{event.title}</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">{event.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

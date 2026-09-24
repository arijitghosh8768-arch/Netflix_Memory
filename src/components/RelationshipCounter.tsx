import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { config } from "../data/config"

// ponytail: pure JS date math to get years, months, days natively.
function getDiff(startDate: string) {
  const start = new Date(startDate)
  const now = new Date()
  if (isNaN(start.getTime())) return { years: 0, months: 0, days: 0 }

  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  let days = now.getDate() - start.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

export default function RelationshipCounter() {
  const [diff, setDiff] = useState({ years: 0, months: 0, days: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setDiff(getDiff(config.relationshipStart))
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="py-16 md:py-24 text-center px-4 w-full">
      <p className="text-gray-500 font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-12">
        Our Journey
      </p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.2 }}
        className="flex flex-wrap justify-center items-center gap-6 md:gap-16 max-w-4xl mx-auto mb-12"
      >
        {[
          { value: diff.years, label: `Year${diff.years !== 1 ? 's' : ''}` },
          { value: diff.months, label: `Month${diff.months !== 1 ? 's' : ''}` },
          { value: diff.days, label: `Day${diff.days !== 1 ? 's' : ''}` },
        ].map((unit, i) => (
          (unit.value > 0 || unit.label.startsWith("Day")) && (
            <motion.div key={i} variants={variants} className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-serif text-white mb-3 tracking-wide">
                {unit.value}
              </span>
              <span className="text-rose-600 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
                {unit.label}
              </span>
            </motion.div>
          )
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: reducedMotion ? 0 : 0.6, duration: 1 }}
        className="text-gray-500 italic font-serif text-lg md:text-xl"
      >
        and still counting...
      </motion.p>
    </div>
  )
}

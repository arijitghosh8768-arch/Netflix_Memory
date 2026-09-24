import { useEffect, useState } from "react"
import { config } from "../data/config"

// ponytail: raw JS date logic to avoid loading date-fns/moment for a single feature.
function getDiff(startDate: string) {
  const start = new Date(startDate)
  const now = new Date()
  if (isNaN(start.getTime())) return "Forever"

  let y = now.getFullYear() - start.getFullYear()
  let m = now.getMonth() - start.getMonth()
  let d = now.getDate() - start.getDate()

  if (d < 0) {
    m -= 1
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y -= 1
    m += 12
  }

  const parts = []
  if (y > 0) parts.push(`${y} Year${y > 1 ? 's' : ''}`)
  if (m > 0) parts.push(`${m} Month${m > 1 ? 's' : ''}`)
  if (d > 0 || parts.length === 0) parts.push(`${d} Day${d !== 1 ? 's' : ''}`)
  return parts.join(" ")
}

export default function RelationshipCounter() {
  const [time, setTime] = useState("")

  useEffect(() => {
    setTime(getDiff(config.relationshipStart))
    // Could add interval here for live updates, but daily precision is enough.
  }, [])

  return (
    <div className="py-16 md:py-24 text-center px-4">
      <p className="text-rose-600 font-semibold tracking-[0.2em] uppercase text-sm mb-2">{config.siteName}</p>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Together for</h2>
      <div className="inline-block bg-[#141414] border border-white/5 px-8 md:px-12 py-4 md:py-6 rounded-xl shadow-2xl">
        <p className="text-2xl md:text-4xl font-serif text-white tracking-wide">{time}</p>
      </div>
    </div>
  )
}

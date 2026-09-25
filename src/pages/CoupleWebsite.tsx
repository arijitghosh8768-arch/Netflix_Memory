import { useEffect, useState } from "react"
import { useParams, Outlet, Link } from "react-router"
import { coupleService } from "../services/coupleService"
import type { Couple } from "../types/models"
import { CoupleContext } from "../context/CoupleContext"

export default function CoupleWebsite() {
  const { slug } = useParams<{ slug: string }>()
  const [couple, setCouple] = useState<Couple | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      const found = coupleService.getCoupleBySlug(slug)
      setCouple(found || null)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  }

  if (!couple) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">This story could not be found.</p>
        <Link to="/" className="px-6 py-2 bg-white text-black rounded-md font-semibold">Return Home</Link>
      </div>
    )
  }

  if (couple.status === 'ARCHIVED') {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Archived</h1>
        <p className="text-gray-400">This website is no longer available.</p>
      </div>
    )
  }

  if (couple.status === 'DRAFT') {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-gray-400">This website is not published yet.</p>
      </div>
    )
  }

  // If Published, wrap child routes in context
  return (
    <CoupleContext.Provider value={couple}>
      <Outlet />
    </CoupleContext.Provider>
  )
}

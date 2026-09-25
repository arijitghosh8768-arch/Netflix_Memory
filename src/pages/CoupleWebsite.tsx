import { useEffect, useState } from "react"
import { useParams, Outlet, Link } from "react-router"
import { coupleService } from "../services/coupleService"
import type { Couple } from "../types/models"
import { CoupleContext } from "../context/CoupleContext"
import { authService } from "../services/authService"

export default function CoupleWebsite() {
  const { slug } = useParams<{ slug: string }>()
  const [couple, setCouple] = useState<Couple | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true
    if (slug) {
      Promise.all([
        coupleService.getCoupleBySlug(slug),
        authService.getCurrentAdmin()
      ]).then(([found, adminStatus]) => {
        if (active) {
          setCouple(found || null)
          setIsAdmin(adminStatus)
          setLoading(false)
        }
      }).catch(err => {
        console.error(err)
        if (active) setLoading(false)
      })
    } else {
      setLoading(false)
    }
    return () => { active = false }
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

  if (couple.status === 'ARCHIVED' && !isAdmin) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Archived</h1>
        <p className="text-gray-400">This website is no longer available.</p>
      </div>
    )
  }

  if (couple.status === 'DRAFT' && !isAdmin) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-gray-400">This website is not published yet.</p>
      </div>
    )
  }

  return (
    <CoupleContext.Provider value={couple}>
      {isAdmin && couple.status !== 'PUBLISHED' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-xs font-bold py-1 uppercase tracking-widest shadow-md">
          Admin Preview Mode ({couple.status})
        </div>
      )}
      <Outlet />
    </CoupleContext.Provider>
  )
}

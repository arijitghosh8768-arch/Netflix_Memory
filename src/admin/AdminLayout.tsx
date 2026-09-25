import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router"
import { authService } from "../services/authService"
import { useEffect, useState } from "react"
import type { Session } from '@supabase/supabase-js'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    authService.getCurrentSession().then(s => {
      setSession(s)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) {
        navigate("/admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Verifying session...</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = async () => {
    await authService.logoutAdmin()
    navigate("/admin/login")
  }
  
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Couples", path: "/admin/couples" },
    { name: "Templates", path: "/admin/templates" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Settings", path: "/admin/settings" },
  ]

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 flex flex-col border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-widest uppercase">OUR STORY</h1>
          <p className="text-xs text-red-500 mt-1 font-semibold">PRODUCTION PLATFORM</p>
          <button onClick={handleLogout} className="text-xs text-gray-400 mt-3 hover:text-white transition">← Sign Out</button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                (item.path === "/admin" && location.pathname === "/admin") || 
                (item.path !== "/admin" && location.pathname.startsWith(item.path))
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 text-xs text-gray-500 border-t border-gray-800 truncate">
          {session.user?.email}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}

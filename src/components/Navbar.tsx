import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Menu } from "lucide-react"
import useSelectedProfile from "../hooks/useSelectedProfile"
import { config } from "../data/config"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const profile = useSelectedProfile()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-40 transition-colors duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? "bg-[#080808] shadow-md" : "bg-gradient-to-b from-black/70 to-transparent"}`}>
      <div className="flex items-center gap-8 md:gap-12">
        <Link to="/home" className="text-xl md:text-2xl font-bold tracking-widest text-rose-600">{config.siteName}</Link>
        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          <Link to="/home" className="hover:text-white transition-colors">Home</Link>
          <a href="#memories" className="hover:text-white transition-colors">Memories</a>
          <a href="#timeline" className="hover:text-white transition-colors">Timeline</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {profile && (
          <Link to="/profiles" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src={profile.image} alt={profile.name} className="w-8 h-8 rounded-md object-cover border border-white/20" />
          </Link>
        )}
        <button className="md:hidden text-white p-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  )
}

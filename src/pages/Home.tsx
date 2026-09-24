import { useMemo } from "react"
import { memories } from "../data/memories"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import RelationshipCounter from "../components/RelationshipCounter"
import TimelinePreview from "../components/TimelinePreview"
import useSelectedProfile from "../hooks/useSelectedProfile"

function Home() {
  const profile = useSelectedProfile()

  // ponytail: derived state computed directly from the flat array.
  const featuredMemories = useMemo(() => memories.filter(m => m.featured), [])
  const recentMemories = useMemo(() => memories.slice(0, 4), []) // just top 4
  const specialMemories = useMemo(() => memories.filter(m => m.category.includes("Special")), [])

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <Hero />

      {/* overlap the hero slightly on desktop */}
      <div id="memories" className="relative z-10 -mt-12 md:-mt-32 pb-12">
        <MovieRow title="Our Favorite Moments" memories={featuredMemories} />
        <MovieRow title="Recently Created" memories={recentMemories} />
        <MovieRow title="Special Memories" memories={specialMemories} />
      </div>

      <RelationshipCounter />
      <TimelinePreview />

      <footer className="py-12 text-center text-gray-500 text-sm bg-[#0a0a0a]">
        <p>Made with ❤️ for {profile?.name || "you"}</p>
      </footer>
    </main>
  )
}

export default Home

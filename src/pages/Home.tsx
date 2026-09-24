import { useMemo, useState } from "react"
import { memories, type Memory } from "../data/memories"
import { config } from "../data/config"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import RelationshipCounter from "../components/RelationshipCounter"
import TimelinePreview from "../components/TimelinePreview"
import MoreInfoModal from "../components/MoreInfoModal"
import AudioController from "../components/AudioController"
import useSelectedProfile from "../hooks/useSelectedProfile"
import useBackgroundAudio from "../hooks/useBackgroundAudio"

function Home() {
  const profile = useSelectedProfile()
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useBackgroundAudio(config.audio?.background)

  const featuredMemories = useMemo(() => memories.filter(m => m.featured), [])
  const recentMemories = useMemo(() => memories.slice(0, 4), [])
  const specialMemories = useMemo(() => memories.filter(m => m.category.includes("Special")), [])

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <Hero />

      <RelationshipCounter />

      <div id="memories" className="relative z-10 pb-12">
        <MovieRow title="Our Favorite Moments" memories={featuredMemories} onMemoryClick={setSelectedMemory} />
        <MovieRow title="Recently Created" memories={recentMemories} onMemoryClick={setSelectedMemory} />
        <MovieRow title="Special Memories" memories={specialMemories} onMemoryClick={setSelectedMemory} />
      </div>

      <TimelinePreview />

      <footer className="py-12 text-center text-gray-500 text-sm bg-[#0a0a0a]">
        <p>Made with ❤️ for {profile?.name || "you"}</p>
      </footer>

      <MoreInfoModal
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        title={selectedMemory?.title || ""}
        description={selectedMemory?.description || ""}
        image={selectedMemory?.image || ""}
        category={selectedMemory?.category}
        duration={selectedMemory?.duration}
        videoUrl={selectedMemory?.video}
      />

      <AudioController
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
      />
    </main>
  )
}

export default Home

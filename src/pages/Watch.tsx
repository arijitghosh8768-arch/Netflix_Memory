import { useNavigate, useLocation } from "react-router"
import { ArrowLeft } from "lucide-react"

import VideoPlayer from "../components/VideoPlayer"

function Watch() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Conditionally receive video URL if we launched a specific memory instead of the main story
  const videoUrl = location.state?.videoUrl

  return (
    <main className="relative min-h-screen bg-black">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 z-30 flex items-center gap-2 text-white/80 transition-colors hover:text-white md:left-8 md:top-6 cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
        <span className="hidden sm:inline">Back</span>
      </button>

      <VideoPlayer videoUrl={videoUrl} />
    </main>
  )
}

export default Watch

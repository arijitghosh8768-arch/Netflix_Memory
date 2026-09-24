import { Volume2, VolumeX, Music } from "lucide-react"

interface AudioControllerProps {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (v: number) => void
}

export default function AudioController({
  isPlaying, isMuted, volume, onTogglePlay, onToggleMute, onVolumeChange
}: AudioControllerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl transition-all hover:border-white/20">
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className={`cursor-pointer transition-colors focus-visible:outline-white ${isPlaying ? "text-rose-500 hover:text-rose-400" : "text-white/70 hover:text-white"}`}
      >
        <Music className="w-5 h-5" />
      </button>
      
      <div className="w-[1px] h-4 bg-white/20 mx-1" />

      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-white"
      >
        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-16 h-1 accent-rose-500 cursor-pointer hidden sm:block focus-visible:outline-white"
        aria-label="Adjust music volume"
      />
    </div>
  )
}

import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  onPlay: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onMute: () => void
  onFullscreen: () => void
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) return "00:00"

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  onPlay,
  onSeek,
  onVolumeChange,
  onMute,
  onFullscreen,
}: VideoControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent px-4 pb-5 pt-16 md:px-8">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(event) => onSeek(Number(event.target.value))}
        className="mb-4 h-1 w-full cursor-pointer accent-white"
        aria-label="Video progress"
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPlay}
          className="text-white transition-opacity hover:opacity-70 cursor-pointer"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          type="button"
          onClick={onMute}
          className="text-white transition-opacity hover:opacity-70 cursor-pointer"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted || volume === 0 ? <VolumeX size={23} /> : <Volume2 size={23} />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="hidden w-24 cursor-pointer accent-white sm:block"
          aria-label="Volume"
        />

        <span className="text-sm text-white/70">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="ml-auto">
          <button
            type="button"
            onClick={onFullscreen}
            className="text-white transition-opacity hover:opacity-70 cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={23} /> : <Maximize size={23} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoControls

interface AudioControlsProps {
  isPlaying: boolean
  volume: number
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
}

export default function AudioControls({
  isPlaying,
  volume,
  onPlayPause,
  onVolumeChange
}: AudioControlsProps) {
  return (
    <div className="audio-controls mb-8">
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={onPlayPause}
          className="play-btn px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlaying ? '⏸️ Pause Station' : '▶️ Play Station'}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-white">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="volume-slider w-40"
          />
        </div>
      </div>
    </div>
  )
}

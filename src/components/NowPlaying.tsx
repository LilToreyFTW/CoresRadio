import { Track } from '@/lib/tracks'

interface NowPlayingProps {
  track?: Track
  isPlaying: boolean
}

export default function NowPlaying({ track, isPlaying }: NowPlayingProps) {
  return (
    <div className="bg-yellow-200 border border-yellow-300 rounded-xl p-5 mb-6 text-center">
      <h3 className="text-amber-800 mb-3">Now Playing</h3>
      <p className="text-amber-800">
        {track ? `${track.title} - ${track.artist}` : 'Select a track to start playing'}
      </p>
      {isPlaying && (
        <div className="mt-2 flex justify-center space-x-1">
          <div className="w-1 h-4 bg-amber-600 animate-pulse"></div>
          <div className="w-1 h-6 bg-amber-600 animate-pulse delay-75"></div>
          <div className="w-1 h-4 bg-amber-600 animate-pulse delay-150"></div>
          <div className="w-1 h-8 bg-amber-600 animate-pulse delay-225"></div>
          <div className="w-1 h-4 bg-amber-600 animate-pulse delay-300"></div>
        </div>
      )}
    </div>
  )
}

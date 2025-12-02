import { Track } from '@/lib/tracks'

interface PlaylistProps {
  tracks: Track[]
  currentTrackIndex: number
  onTrackSelect: (index: number) => void
}

export default function Playlist({ tracks, currentTrackIndex, onTrackSelect }: PlaylistProps) {
  // Group tracks by album
  const albums = tracks.reduce((acc, track, index) => {
    if (!acc[track.album]) {
      acc[track.album] = []
    }
    acc[track.album].push({ ...track, index })
    return acc
  }, {} as Record<string, (Track & { index: number })[]>)

  return (
    <div className="mb-8">
      <h3 className="text-yellow-400 mb-6 text-center drop-shadow-lg">🎶 Core's Drip Playlist</h3>
      <div className="grid gap-6">
        {Object.entries(albums).map(([albumName, albumTracks]) => (
          <div key={albumName} className="bg-yellow-500 bg-opacity-5 border border-yellow-400 border-opacity-30 rounded-xl p-5 mb-4">
            <div className="text-yellow-400 text-xl font-bold mb-4 text-center border-b border-yellow-400 border-opacity-30 pb-3 drop-shadow-lg">
              🎵 {albumName}
            </div>
            <div className="flex flex-col gap-2">
              {albumTracks.map((track) => (
                <div
                  key={track.index}
                  className={`flex justify-between items-center p-4 border-b border-gray-600 cursor-pointer transition-all duration-300 rounded-lg ${
                    track.index === currentTrackIndex
                      ? 'bg-yellow-400 bg-opacity-20 border-l-4 border-yellow-400 shadow-lg'
                      : 'hover:bg-yellow-400 hover:bg-opacity-10 hover:border-l-4 hover:border-yellow-400'
                  }`}
                  onClick={() => onTrackSelect(track.index)}
                >
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{track.title}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

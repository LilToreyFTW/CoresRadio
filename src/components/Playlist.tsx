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
    <div className="playlist mb-8">
      <h3 className="text-yellow-400 mb-6 text-center drop-shadow-lg">🎶 Core's Drip Playlist</h3>
      <div className="albums-container">
        {Object.entries(albums).map(([albumName, albumTracks]) => (
          <div key={albumName} className="album-section mb-4">
            <div className="album-title">
              🎵 {albumName}
            </div>
            <div className="album-tracklist">
              {albumTracks.map((track) => (
                <div
                  key={track.index}
                  className={`playlist-item ${
                    track.index === currentTrackIndex ? 'active' : ''
                  }`}
                  onClick={() => onTrackSelect(track.index)}
                >
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">{track.artist}</div>
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

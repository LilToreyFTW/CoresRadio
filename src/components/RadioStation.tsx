'use client'

import { useState, useRef, useEffect } from 'react'
import { tracks, Track } from '@/lib/tracks'
import Equalizer from './Equalizer'
import Playlist from './Playlist'
import NowPlaying from './NowPlaying'
import AudioControls from './AudioControls'

export default function RadioStation() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentPreset, setCurrentPreset] = useState('flat')
  const [aiStatus, setAiStatus] = useState('Ready for analysis...')

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Initialize first track
    if (tracks.length > 0) {
      loadTrack(0)
    }
  }, [])

  const loadTrack = async (index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index)
      const track = tracks[index]

      if (audioRef.current) {
        audioRef.current.src = track.url
        audioRef.current.volume = volume

        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Audio play failed:', error)
          setIsPlaying(false)
        }
      }
    }
  }

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Play failed:', error)
      }
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleTrackSelect = (index: number) => {
    loadTrack(index)
  }

  const handlePresetChange = (preset: string) => {
    setCurrentPreset(preset)
    setAiStatus(`Applied ${preset} preset`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-80 border-2 border-yellow-400 rounded-3xl p-8 max-w-2xl w-full backdrop-blur-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center drop-shadow-lg">
          🎵 Core's Radio 999.9FM
        </h1>

        <div className="text-center mb-8">
          <div className="text-lg text-gray-400 mb-2">Frequency: 999.9 FM</div>
          <div className="text-gray-300 leading-relaxed">
            Atlanta's finest - straight from the streets! Premium drip playlist featuring Lil Baby's greatest hits.
            Stream to your car via Bluetooth for that authentic trap experience.
          </div>
        </div>

        <NowPlaying
          track={tracks[currentTrackIndex]}
          isPlaying={isPlaying}
        />

        <AudioControls
          isPlaying={isPlaying}
          volume={volume}
          onPlayPause={togglePlayPause}
          onVolumeChange={handleVolumeChange}
        />

        <Playlist
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
        />

        <div className="mb-8 p-6 bg-yellow-400 bg-opacity-10 border border-yellow-400 rounded-xl text-center">
          <h3 className="text-yellow-400 mb-3">📁 Add Your Music</h3>
          <p className="text-white mb-3">Upload MP3 files to create your custom playlist:</p>
          <input
            type="file"
            accept="audio/*"
            multiple
            className="text-white mb-3"
          />
          <p className="text-sm text-gray-400">Supported formats: MP3, WAV, OGG</p>
        </div>

        <Equalizer
          currentPreset={currentPreset}
          aiStatus={aiStatus}
          onPresetChange={handlePresetChange}
          audioElement={audioRef.current}
        />

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => {
            const nextIndex = (currentTrackIndex + 1) % tracks.length
            loadTrack(nextIndex)
          }}
          onError={() => {
            console.error('Audio loading error')
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

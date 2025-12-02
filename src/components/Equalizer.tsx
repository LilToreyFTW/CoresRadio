'use client'

import { useState, useEffect, useRef } from 'react'

interface EqualizerProps {
  currentPreset: string
  aiStatus: string
  onPresetChange: (preset: string) => void
  audioElement: HTMLAudioElement | null
}

const FREQUENCIES = [
  64, 70, 76, 82, 88, 94, 100, 106, 112, 118, 124, 130, 136, 142,
  150, 158, 167, 176, 186, 196, 208, 220, 233, 246, 260, 275, 291, 308,
  325, 344, 364, 385, 407, 430, 455, 481, 509, 538, 569, 602, 636, 672,
  710, 751, 794, 839, 887, 938, 991, 1047, 1107, 1169, 1235, 1305, 1379, 1457,
  1540, 1627, 1720, 1818, 1921, 2031, 2147, 2269, 2399, 2535, 2679, 2830
]

const AI_PRESETS = {
  flat: { name: 'Flat', baseGains: new Array(64).fill(0), adaptive: false },
  cleanMono: { name: 'Clean Mono', baseGains: new Array(64).fill(-12), adaptive: false },
  bassBoost: {
    name: 'Bass Boost',
    baseGains: [3, 2.5, 2, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [60, 120, 250]
  },
  trebleBoost: {
    name: 'Treble Boost',
    baseGains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0],
    adaptive: true,
    targetFreqs: [5000, 8000, 12000]
  },
  vocalEnhance: {
    name: 'Vocal Enhance',
    baseGains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1.5, 2, 2.5, 3, 2.5, 2, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [300, 1000, 3000, 5000]
  },
  club: {
    name: 'Club',
    baseGains: [2, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [60, 120, 5000, 10000]
  },
  party: {
    name: 'Party',
    baseGains: [1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [60, 120, 250, 4000, 8000]
  },
  rock: {
    name: 'Rock',
    baseGains: [0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [80, 300, 1000, 3000, 6000]
  },
  pop: {
    name: 'Pop',
    baseGains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [200, 1000, 3000, 5000, 8000]
  },
  hiphop: {
    name: 'Hip-Hop',
    baseGains: [2, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    adaptive: true,
    targetFreqs: [60, 80, 120, 4000, 8000]
  }
}

export default function Equalizer({ currentPreset, aiStatus, onPresetChange, audioElement }: EqualizerProps) {
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  const [sliderValues, setSliderValues] = useState<number[]>(new Array(64).fill(0))

  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const filtersRef = useRef<BiquadFilterNode[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const visualizerBarsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (audioElement) {
      setupAudioContext(audioElement)
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [audioElement])

  useEffect(() => {
    const preset = AI_PRESETS[currentPreset as keyof typeof AI_PRESETS]
    if (preset) {
      applyPresetGains(preset.baseGains)
    }
  }, [currentPreset])

  const setupAudioContext = (audioElement: HTMLAudioElement) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const gainNode = audioContext.createGain()
      const source = audioContext.createMediaElementSource(audioElement)

      analyser.fftSize = 256
      const dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>

      // Create filters for each frequency band
      const filters = FREQUENCIES.map(freq => {
        const filter = audioContext.createBiquadFilter()
        filter.type = 'peaking'
        filter.frequency.value = freq
        filter.Q.value = 1
        filter.gain.value = 0
        return filter
      })

      // Connect the audio graph: source -> filters -> gain -> analyser -> destination
      let currentNode: AudioNode = source

      filters.forEach(filter => {
        currentNode.connect(filter)
        currentNode = filter
      })

      currentNode.connect(gainNode)
      gainNode.connect(analyser)
      analyser.connect(audioContext.destination)

      audioContextRef.current = audioContext
      sourceRef.current = source
      analyserRef.current = analyser
      gainNodeRef.current = gainNode
      filtersRef.current = filters
      dataArrayRef.current = dataArray

      updateVisualizer()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  const applyPresetGains = (gains: number[]) => {
    const sliders = document.querySelectorAll('.band-slider')
    sliders.forEach((slider, index) => {
      const gainValue = gains[index] || 0
      const clampedGain = Math.max(-20, Math.min(20, gainValue))
      ;(slider as HTMLInputElement).value = clampedGain.toString()

      if (filtersRef.current[index]) {
        filtersRef.current[index].gain.value = clampedGain
      }
    })

    setSliderValues(gains.map(gain => Math.max(-20, Math.min(20, gain))))
  }

  const updateFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAIAnalyzing) return

    const slider = event.target
    const bandIndex = parseInt(slider.dataset.bandIndex || '0')
    const gainValue = parseFloat(slider.value)

    if (filtersRef.current[bandIndex]) {
      filtersRef.current[bandIndex].gain.value = gainValue
    }

    const newValues = [...sliderValues]
    newValues[bandIndex] = gainValue
    setSliderValues(newValues)
  }

  const updateVisualizer = () => {
    if (!analyserRef.current || !dataArrayRef.current) return

    analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array)

    visualizerBarsRef.current.forEach((bar, index) => {
      if (bar && dataArrayRef.current) {
        const value = dataArrayRef.current[index] || 0
        const percent = (value / 255) * 100
        bar.style.height = percent + '%'
        bar.style.opacity = 0.3 + (percent / 100) * 0.7
      }
    })

    requestAnimationFrame(updateVisualizer)
  }

  return (
    <div className="mb-8 p-6 bg-black bg-opacity-80 border-2 border-yellow-400 rounded-2xl backdrop-blur-lg">
      <h3 className="text-yellow-400 mb-6 text-center drop-shadow-lg">
        🎛️ AI-Controlled Deep Sync 64-16kHz Equalizer
      </h3>

      <div className="flex flex-col gap-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isAIAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-yellow-400">{aiStatus}</span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(AI_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                className={`px-4 py-2 bg-yellow-400 bg-opacity-10 border border-yellow-400 rounded-2xl text-yellow-400 cursor-pointer text-sm transition-all duration-300 hover:bg-yellow-400 hover:bg-opacity-20 hover:scale-105 ${
                  currentPreset === key ? 'bg-yellow-400 text-black shadow-lg' : ''
                }`}
                onClick={() => onPresetChange(key)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-8 gap-1 mb-6">
          {FREQUENCIES.map((freq, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <input
                type="range"
                className="[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-yellow-400 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none appearance-none bg-yellow-400/20 rounded-sm w-2 h-40 cursor-pointer transition-all duration-200 hover:bg-yellow-400/30"
                style={{ writingMode: 'bt-lr', pointerEvents: isAIAnalyzing ? 'none' : 'auto', opacity: isAIAnalyzing ? 0.6 : 1 }}
                min="-20"
                max="20"
                value={sliderValues[index] || 0}
                data-band-index={index}
                onChange={updateFilter}
              />
              <div className="text-xs text-gray-400 transform -rotate-45 whitespace-nowrap mt-2">
                {freq >= 1000 ? `${(freq/1000).toFixed(1)}k` : freq}
              </div>
            </div>
          ))}
        </div>

        <div className="h-24 bg-black bg-opacity-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="flex items-end gap-1 h-full">
            {Array.from({ length: 64 }, (_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) visualizerBarsRef.current[i] = el
                }}
                className="bg-gradient-to-t from-yellow-400 to-orange-500 rounded-sm flex-1 transition-all duration-100"
                style={{ height: '2px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

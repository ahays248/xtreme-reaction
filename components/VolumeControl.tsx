import { motion } from 'framer-motion'
import { useState } from 'react'

interface VolumeControlProps {
  volume: number
  muted: boolean
  musicVolume: number
  musicMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onMusicVolumeChange: (volume: number) => void
  onToggleMusicMute: () => void
}

export default function VolumeControl({ 
  volume, 
  muted, 
  musicVolume,
  musicMuted,
  onVolumeChange, 
  onToggleMute,
  onMusicVolumeChange,
  onToggleMusicMute
}: VolumeControlProps) {
  const [expanded, setExpanded] = useState(false)
  // Check if both are muted
  const allMuted = muted && musicMuted

  // Quick mute/unmute all
  const handleQuickMute = () => {
    if (allMuted) {
      // Unmute both
      if (muted) onToggleMute()
      if (musicMuted) onToggleMusicMute()
    } else {
      // Mute both
      if (!muted) onToggleMute()
      if (!musicMuted) onToggleMusicMute()
    }
  }

  return (
    <motion.div 
      className={`${expanded ? 'flex-col gap-3 min-w-[220px] sm:min-w-[280px]' : 'flex-row gap-2 sm:gap-4'} flex bg-black/90 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-green-500/30`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Mute Button - Affects both music and SFX */}
        <button
          onClick={handleQuickMute}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-green-400 hover:text-green-300 transition-colors"
          aria-label={allMuted ? 'Unmute All' : 'Mute All'}
        >
          {allMuted ? (
            // Muted icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            // Volume icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Expand/Collapse button - now visible on mobile too */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex min-w-[30px] min-h-[30px] items-center justify-center text-green-400 hover:text-green-300 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </button>

        {/* Status indicator - shown when not expanded */}
        {!expanded && (
          <span className="text-green-400 text-xs font-mono uppercase">
            {allMuted ? 'MUTED' : `${Math.round((musicVolume + volume) / 2)}%`}
          </span>
        )}
      </div>

      {/* Expanded controls - Now works on mobile and desktop */}
      {expanded && (
        <div className="flex flex-col gap-2 w-full min-w-[200px] sm:min-w-[250px]">
          {/* Music Volume */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-green-400 text-xs font-mono min-w-[45px] sm:min-w-[50px]">Music:</span>
            <button
              onClick={onToggleMusicMute}
              className="min-w-[24px] min-h-[24px] flex items-center justify-center text-green-400 hover:text-green-300"
            >
              {musicMuted ? '🔇' : '🎵'}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={musicMuted ? 0 : musicVolume}
              onChange={(e) => onMusicVolumeChange(parseInt(e.target.value))}
              disabled={musicMuted}
              className="flex-1 h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-track]:bg-green-900/50
                [&::-webkit-slider-track]:rounded-lg
                [&::-webkit-slider-track]:h-2
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-4 sm:w-3 
                [&::-webkit-slider-thumb]:h-4 sm:h-3 
                [&::-webkit-slider-thumb]:bg-green-400 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-track]:bg-green-900/50
                [&::-moz-range-track]:rounded-lg
                [&::-moz-range-track]:h-2
                [&::-moz-range-thumb]:w-4 sm:w-3
                [&::-moz-range-thumb]:h-4 sm:h-3
                [&::-moz-range-thumb]:bg-green-400
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-green-400 text-xs font-mono min-w-[25px] sm:min-w-[30px] text-right">
              {musicMuted ? '0' : musicVolume}%
            </span>
          </div>

          {/* SFX Volume */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-green-400 text-xs font-mono min-w-[45px] sm:min-w-[50px]">SFX:</span>
            <button
              onClick={onToggleMute}
              className="min-w-[24px] min-h-[24px] flex items-center justify-center text-green-400 hover:text-green-300"
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              disabled={muted}
              className="flex-1 h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-track]:bg-green-900/50
                [&::-webkit-slider-track]:rounded-lg
                [&::-webkit-slider-track]:h-2
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-4 sm:w-3 
                [&::-webkit-slider-thumb]:h-4 sm:h-3 
                [&::-webkit-slider-thumb]:bg-green-400 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-track]:bg-green-900/50
                [&::-moz-range-track]:rounded-lg
                [&::-moz-range-track]:h-2
                [&::-moz-range-thumb]:w-4 sm:w-3
                [&::-moz-range-thumb]:h-4 sm:h-3
                [&::-moz-range-thumb]:bg-green-400
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-green-400 text-xs font-mono min-w-[25px] sm:min-w-[30px] text-right">
              {muted ? '0' : volume}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
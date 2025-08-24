import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="relative">
      <motion.div 
        className="flex flex-row gap-1 sm:gap-4 bg-black/90 sm:backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 border border-green-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1 sm:gap-4">
        {/* Quick Mute Button - Smaller on mobile */}
        <button
          onClick={handleQuickMute}
          className="min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center text-green-400 hover:text-green-300 transition-colors"
          aria-label={allMuted ? 'Unmute All' : 'Mute All'}
        >
          {allMuted ? (
            // Muted icon - smaller on mobile
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            // Volume icon - smaller on mobile
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Expand/Collapse button - smaller on mobile */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex min-w-[24px] min-h-[24px] sm:min-w-[30px] sm:min-h-[30px] items-center justify-center text-green-400 hover:text-green-300 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </motion.div>

      {/* Expanded controls - Dropdown on mobile, inline on desktop */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
          className="absolute top-full mt-1 right-0 sm:static sm:mt-0 bg-black/95 border border-green-500/30 rounded-lg p-2 sm:p-3 z-50 min-w-[160px] sm:min-w-[280px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex flex-col gap-1 sm:gap-2 w-full">
          {/* Music Volume */}
          <div className="flex items-center gap-1 sm:gap-2 w-full">
            <span className="text-green-400 text-[10px] sm:text-xs font-mono min-w-[35px] sm:min-w-[50px]">Music:</span>
            <button
              onClick={onToggleMusicMute}
              className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] flex items-center justify-center text-green-400 hover:text-green-300 text-xs sm:text-base"
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
            <span className="text-green-400 text-[10px] sm:text-xs font-mono min-w-[20px] sm:min-w-[30px] text-right">
              {musicMuted ? '0' : musicVolume}%
            </span>
          </div>

          {/* SFX Volume */}
          <div className="flex items-center gap-1 sm:gap-2 w-full">
            <span className="text-green-400 text-[10px] sm:text-xs font-mono min-w-[35px] sm:min-w-[50px]">SFX:</span>
            <button
              onClick={onToggleMute}
              className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] flex items-center justify-center text-green-400 hover:text-green-300 text-xs sm:text-base"
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
            <span className="text-green-400 text-[10px] sm:text-xs font-mono min-w-[20px] sm:min-w-[30px] text-right">
              {muted ? '0' : volume}%
            </span>
          </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
import { motion } from 'framer-motion'

interface VolumeControlProps {
  volume: number
  muted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
}

export default function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  return (
    <motion.div 
      className="flex items-center gap-2 sm:gap-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-green-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Mute Button - Mobile friendly 44px touch target */}
      <button
        onClick={onToggleMute}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-green-400 hover:text-green-300 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
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

      {/* Volume Slider - Hidden on small mobile, visible on larger screens */}
      <div className="hidden sm:flex items-center gap-2 flex-1">
        <span className="text-green-400 text-xs font-mono min-w-[30px]">
          {muted ? '0' : volume}%
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={muted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          disabled={muted}
          className="flex-1 h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:bg-green-400 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 
            [&::-moz-range-thumb]:h-4 
            [&::-moz-range-thumb]:bg-green-400 
            [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:border-0 
            [&::-moz-range-thumb]:cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Visual indicator for mobile when muted */}
      {muted && (
        <span className="sm:hidden text-red-400 text-xs font-mono uppercase">
          Muted
        </span>
      )}
    </motion.div>
  )
}
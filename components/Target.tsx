'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTargetSizeClass } from '@/lib/difficulty'

interface TargetProps {
  isVisible: boolean
  onTargetClick?: (e: React.PointerEvent) => void
  size?: number
  variant?: 'normal' | 'trap'
  position?: { x: number; y: number } // Position in percentages
}

const Target = memo(function Target({ isVisible, onTargetClick, size = 96, variant = 'normal', position }: TargetProps) {
  // Get appropriate Tailwind class for size
  const sizeClass = getTargetSizeClass(size)
  
  // Determine colors based on variant
  const isTrap = variant === 'trap'
  const bgColor = isTrap ? 'bg-red-500' : 'bg-green-500'
  const glowColor = isTrap ? '#ff0000' : '#00ff00'
  const pulseGlow = isTrap 
    ? ['0 0 20px rgba(255, 0, 0, 0.5)', '0 0 40px rgba(255, 0, 0, 0.8)', '0 0 20px rgba(255, 0, 0, 0.5)']
    : ['0 0 20px rgba(0, 255, 0, 0.5)', '0 0 40px rgba(0, 255, 0, 0.8)', '0 0 20px rgba(0, 255, 0, 0.5)']
  
  // Calculate position styles
  const positionStyle = position ? {
    position: 'fixed' as const,
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)'
  } : {}

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`${sizeClass} ${bgColor} rounded-full cursor-pointer relative`}
          style={positionStyle}
          onPointerDown={onTargetClick}
          onKeyDown={(e) => {
            // Prevent keyboard shortcuts from activating the target
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label={isTrap ? "Trap circle - don't click!" : "Target circle"}
          role="presentation"
          tabIndex={-1}
          // Spawn animation
          initial={{ 
            scale: 0,
            filter: `drop-shadow(0 0 0px ${glowColor})`
          }}
          animate={{ 
            scale: [0, 1.2, 1],
            filter: [
              `drop-shadow(0 0 0px ${glowColor})`,
              `drop-shadow(0 0 30px ${glowColor})`,
              `drop-shadow(0 0 20px ${glowColor})`
            ],
            boxShadow: pulseGlow
          }}
          exit={{ 
            scale: 0,
            filter: `drop-shadow(0 0 40px ${glowColor})`,
            transition: { duration: 0.2 }
          }}
          transition={{
            scale: { duration: 0.3, ease: "backOut" },
            filter: { duration: 0.3 },
            boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{
            scale: 1.05,
            filter: `drop-shadow(0 0 35px ${glowColor})`,
            transition: { duration: 0.1 }
          }}
          whileTap={{
            scale: 0.95,
            filter: `drop-shadow(0 0 50px ${glowColor})`
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-30"
               style={{ backgroundColor: glowColor }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default Target
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePlatformAdjustments } from '@/hooks/usePlatformAdjustments'

interface CueDisplayProps {
  isVisible: boolean
  isFake: boolean
  onCueClick?: () => void  // Add callback for when circle is clicked
}

export function CueDisplay({ isVisible, isFake, onCueClick }: CueDisplayProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const { circleSizeMultiplier } = usePlatformAdjustments()

  useEffect(() => {
    if (isVisible) {
      // Generate random position when cue becomes visible
      // Adjust spawn area based on platform (desktop needs more centered circles)
      let minX = 10, maxX = 90, minY = 20, maxY = 80
      
      // On desktop, keep circles more centered to reduce mouse travel
      if (window.innerWidth > 1024) {
        minX = 25  // 25% to 75% horizontally
        maxX = 75
        minY = 30  // 30% to 70% vertically  
        maxY = 70
      }
      
      const x = minX + Math.random() * (maxX - minX)
      const y = minY + Math.random() * (maxY - minY)
      setPosition({ x, y })
    }
  }, [isVisible])

  const handleCueClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation() // Prevent event from bubbling to game canvas
    e.preventDefault() // Prevent default behavior
    
    // Only process one event type to prevent double-firing
    // On mobile, touchstart fires before click
    if (e.type === 'touchstart') {
      // This is a touch event, handle it
      if (onCueClick) {
        onCueClick()
      }
    } else if (e.type === 'click' && !('ontouchstart' in window)) {
      // This is a click on desktop (no touch support)
      if (onCueClick) {
        onCueClick()
      }
    }
    // Ignore click events on mobile (touchstart already handled it)
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Main cue circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={handleCueClick}
              onTouchStart={handleCueClick}
            >
              <div
                className={`relative ${
                  isFake 
                    ? 'bg-red-500 border-4 border-red-600' 
                    : 'bg-green-500 border-4 border-green-600'
                } rounded-full shadow-2xl`}
                style={{
                  width: `${80 * circleSizeMultiplier}px`,
                  height: `${80 * circleSizeMultiplier}px`,
                  minWidth: `${80 * circleSizeMultiplier}px`,
                  minHeight: `${80 * circleSizeMultiplier}px`,
                  boxShadow: isFake 
                    ? '0 0 40px rgba(239, 68, 68, 0.6)' 
                    : '0 0 40px rgba(34, 197, 94, 0.6)'
                }}
              >
                {/* Inner circle for visual interest */}
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  isFake ? 'bg-red-400' : 'bg-green-400'
                } bg-opacity-30`}>
                  <div 
                    className={`rounded-full ${
                      isFake ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Distraction elements - only show sometimes */}
            {Math.random() > 0.7 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute w-16 h-16 bg-yellow-500 rounded-full blur-xl pointer-events-none"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 60 + 20}%`,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute w-20 h-20 bg-purple-500 rounded-full blur-xl pointer-events-none"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 60 + 20}%`,
                  }}
                />
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
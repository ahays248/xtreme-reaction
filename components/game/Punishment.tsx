'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PunishmentProps {
  consecutiveErrors: number
}

export function Punishment({ consecutiveErrors }: PunishmentProps) {
  const [shakeIntensity, setShakeIntensity] = useState(10)

  useEffect(() => {
    // Increase shake intensity with consecutive errors
    setShakeIntensity(10 + (consecutiveErrors * 5))
  }, [consecutiveErrors])

  const shakeAnimation = {
    x: [0, -shakeIntensity, shakeIntensity, -shakeIntensity, shakeIntensity, 0],
    y: [0, shakeIntensity, -shakeIntensity, shakeIntensity, -shakeIntensity, 0],
    rotate: [0, -5, 5, -5, 5, 0],
  }

  return (
    <>
      {/* Screen shake */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        animate={shakeAnimation}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Red overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 + (consecutiveErrors * 0.1) }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-red-600 pointer-events-none z-40"
      />

      {/* Blur effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: `blur(${2 + consecutiveErrors}px)`,
        }}
      />

      {/* Error message */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="text-6xl font-bold text-red-500 text-center">
          WRONG!
          {consecutiveErrors > 2 && (
            <div className="text-2xl mt-2">
              {consecutiveErrors} errors in a row!
            </div>
          )}
        </div>
      </motion.div>

      {/* Screen flicker for high error count */}
      {consecutiveErrors > 3 && (
        <motion.div
          className="fixed inset-0 bg-black pointer-events-none z-60"
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.1,
            repeat: 3,
            repeatType: "loop",
          }}
        />
      )}
    </>
  )
}
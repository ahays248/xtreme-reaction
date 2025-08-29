'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import MatrixRain from '@/components/MatrixRain'
import Leaderboard from '@/components/Leaderboard'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAuth } from '@/hooks/useAuth'
import { useSound } from '@/hooks/useSound'

export default function LeaderboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { switchMusic, initialized, soundEnabled } = useSound()
  const { 
    leaderboard, 
    loading, 
    error, 
    userRank, 
    type, 
    setType,
    refresh,
    lastUpdated 
  } = useLeaderboard('daily')

  // Play menu music on leaderboard page (only if user enabled sound)
  useEffect(() => {
    if (initialized && soundEnabled) {
      switchMusic('menu')
    }
  }, [initialized, soundEnabled, switchMusic])

  return (
    <main className="min-h-screen bg-black text-neon-green flex flex-col items-center p-2 sm:p-4 relative overflow-x-hidden">
      <MatrixRain />
      
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Header */}
      <motion.div
        className="text-center mb-4 sm:mb-6 md:mb-8 relative z-10 mt-2 sm:mt-4 md:mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-orbitron font-black mb-1 sm:mb-2 text-glow-soft">
          LEADERBOARD
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-mono text-neon-cyan">
          {type === 'daily' ? "Today's Top Players" : "All-Time Champions"}
        </p>
      </motion.div>

      {/* Leaderboard Component */}
      <motion.div
        className="w-full max-w-4xl relative z-10 flex-1 px-2 sm:px-0"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Leaderboard
          entries={leaderboard}
          currentUserId={user?.id}
          userRank={userRank}
          type={type}
          onTypeChange={setType}
          loading={loading}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
        />

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center">
            <p>Failed to load leaderboard</p>
            <button
              onClick={refresh}
              className="mt-2 px-4 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8 relative z-10 pb-safe"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => router.push('/')}
          className="px-3 sm:px-6 py-2 sm:py-3 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-sm sm:text-base rounded-lg hover:bg-neon-green/20 hover:shadow-neon-intense transition-all duration-200"
        >
          BACK TO GAME
        </button>
      </motion.div>

      {/* Info Text */}
      <motion.div
        className="mt-4 sm:mt-6 md:mt-8 mb-4 text-center text-xs sm:text-sm text-gray-500 font-mono relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {user ? (
          <p>Your best score: Check your rank above!</p>
        ) : (
          <p>Sign in to save your scores and appear on the leaderboard</p>
        )}
      </motion.div>

      {/* Attribution */}
      <div className="fixed bottom-4 right-4 z-20 text-xs text-gray-500 font-mono">
        Made with ❤️ by{' '}
        <a 
          href="https://x.com/DataVisGuy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          @DataVisGuy
        </a>
      </div>
    </main>
  )
}
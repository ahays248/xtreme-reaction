'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { shareToX, type ShareData } from '@/lib/sharing'
import { getScoreGrade } from '@/lib/scoring'

interface ShareButtonProps {
  finalScore: number
  accuracy: number
  avgReactionTime: number
  bestStreak: number
  trapHit: boolean
  userRank?: number | null
  leaderboardType?: 'daily' | 'all-time'
  username?: string
  xHandle?: string | null
  scoreCardElement?: HTMLElement | null
}

export default function ShareButton({
  finalScore,
  accuracy,
  avgReactionTime,
  bestStreak,
  trapHit,
  userRank,
  leaderboardType = 'daily',
  username,
  xHandle,
  scoreCardElement
}: ShareButtonProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'shared' | 'error'>('idle')
  
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  const handleShare = async () => {
    if (shareStatus === 'loading') return
    
    setShareStatus('loading')
    
    const shareData: ShareData = {
      finalScore,
      accuracy,
      avgReactionTime,
      bestStreak,
      userRank,
      leaderboardType,
      username,
      xHandle,
      grade
    }
    
    try {
      await shareToX(shareData, scoreCardElement || undefined)
      setShareStatus('shared')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setShareStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Error sharing:', error)
      setShareStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setShareStatus('idle')
      }, 3000)
    }
  }
  
  return (
    <motion.button
      onClick={handleShare}
      disabled={shareStatus === 'loading'}
      className={`
        min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3
        font-orbitron font-bold text-sm sm:text-base
        rounded-lg transition-all duration-200
        flex items-center justify-center gap-2
        ${shareStatus === 'shared' 
          ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
          : shareStatus === 'error'
          ? 'bg-red-900/30 border-2 border-red-500 text-red-400'
          : 'bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-neon-cyan'
        }
      `}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {shareStatus === 'loading' ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>GENERATING...</span>
        </>
      ) : shareStatus === 'shared' ? (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>SHARED!</span>
        </>
      ) : shareStatus === 'error' ? (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>ERROR</span>
        </>
      ) : (
        <>
          {/* X (Twitter) Logo */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>SHARE TO X</span>
        </>
      )}
    </motion.button>
  )
}
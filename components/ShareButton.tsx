'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shareToX, generateScoreCardImage, type ShareData } from '@/lib/sharing'
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
  onShowScoreCard?: () => void
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
  scoreCardElement,
  onShowScoreCard
}: ShareButtonProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'shared' | 'error'>('idle')
  const [showOptions, setShowOptions] = useState(false)
  
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
      // For desktop, show options instead of directly sharing
      if (!navigator.share) {
        setShowOptions(true)
        setShareStatus('idle')
        return
      }
      
      // Mobile: use Web Share API
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
  
  const handleDownloadImage = async () => {
    if (!scoreCardElement) return
    
    try {
      const blob = await generateScoreCardImage(scoreCardElement)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xtreme-reaction-score-${finalScore}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }
  
  const handleShareText = async () => {
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
    
    await shareToX(shareData)
    setShowOptions(false)
    setShareStatus('shared')
    
    setTimeout(() => {
      setShareStatus('idle')
    }, 3000)
  }
  
  return (
    <>
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
      
      {/* Share Options Modal */}
      <AnimatePresence>
        {showOptions && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-black border-2 border-neon-green rounded-lg p-6 z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-orbitron font-bold text-neon-green mb-4">
                Share Your Score
              </h3>
              
              <p className="text-sm text-gray-400 mb-6">
                Download the scorecard image, then attach it to your X post for the best visual impact!
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleDownloadImage}
                  className="w-full px-4 py-3 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold rounded-lg hover:bg-neon-green/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Scorecard
                </button>
                
                <button
                  onClick={handleShareText}
                  className="w-full px-4 py-3 bg-black border-2 border-cyan-500 text-cyan-400 font-orbitron font-bold rounded-lg hover:bg-cyan-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Open X with Text
                </button>
                
                {onShowScoreCard && (
                  <button
                    onClick={() => {
                      onShowScoreCard()
                      setShowOptions(false)
                    }}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-600 text-gray-400 font-orbitron font-bold rounded-lg hover:bg-gray-600/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Scorecard
                  </button>
                )}
                
                <button
                  onClick={() => setShowOptions(false)}
                  className="w-full px-4 py-2 text-gray-500 font-mono text-sm hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Tip: Attach the downloaded image to your X post for maximum engagement!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
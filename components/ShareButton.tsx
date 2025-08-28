'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shareToX, generateScoreCardImage, copyScoreCardToClipboard, type ShareData } from '@/lib/sharing'
import { getScoreGrade } from '@/lib/scoring'
import ScoreCard from './ScoreCard'

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
  scorePercentile?: number | null
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
  scorePercentile
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const scoreCardRef = useRef<HTMLDivElement>(null)
  
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  const handleCopyImage = async () => {
    if (!scoreCardRef.current || copyStatus === 'copying') return
    
    setCopyStatus('copying')
    
    const success = await copyScoreCardToClipboard(scoreCardRef.current)
    
    if (success) {
      setCopyStatus('copied')
      setTimeout(() => {
        setCopyStatus('idle')
      }, 3000)
    } else {
      // If copy failed, automatically download instead
      setCopyStatus('error')
      handleDownloadImage()
      setTimeout(() => {
        setCopyStatus('idle')
      }, 3000)
    }
  }
  
  const handleDownloadImage = async () => {
    if (!scoreCardRef.current) return
    
    try {
      const blob = await generateScoreCardImage(scoreCardRef.current)
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
  }
  
  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className="min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 bg-black border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-neon-cyan font-orbitron font-bold text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>SHARE TO X</span>
      </motion.button>
      
      {/* Share Modal with Scorecard Preview */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/90 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-4 sm:inset-8 lg:inset-12 flex flex-col bg-black border-2 border-neon-green rounded-lg z-50 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neon-green/30">
                <h3 className="text-lg sm:text-xl font-orbitron font-bold text-neon-green">
                  Share Your Score
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Scorecard Preview */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900/50">
                <div className="transform scale-50 sm:scale-75 lg:scale-90 origin-center">
                  <div ref={scoreCardRef}>
                    <ScoreCard
                      finalScore={finalScore}
                      accuracy={accuracy}
                      avgReactionTime={avgReactionTime}
                      hits={0} // Not used in visual
                      bestStreak={bestStreak}
                      trapHit={trapHit}
                      userRank={userRank}
                      leaderboardType={leaderboardType}
                      username={username}
                      xHandle={xHandle}
                      scorePercentile={scorePercentile}
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 border-t border-neon-green/30">
                <div className="flex flex-col gap-3">
                  {/* Primary Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopyImage}
                      disabled={copyStatus === 'copying'}
                      className={`
                        flex-1 px-4 py-3 font-orbitron font-bold rounded-lg
                        transition-all duration-200 flex items-center justify-center gap-2
                        ${copyStatus === 'copied' 
                          ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                          : copyStatus === 'error'
                          ? 'bg-orange-900/30 border-2 border-orange-500 text-orange-400'
                          : 'bg-black border-2 border-neon-green text-neon-green hover:bg-neon-green/20'
                        }
                      `}
                    >
                      {copyStatus === 'copying' ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Copying...</span>
                        </>
                      ) : copyStatus === 'copied' ? (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : copyStatus === 'error' ? (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy Image</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleShareText}
                      className="flex-1 px-4 py-3 bg-black border-2 border-cyan-500 text-cyan-400 font-orbitron font-bold rounded-lg hover:bg-cyan-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>Post to X</span>
                    </button>
                  </div>
                  
                  {/* Alternative download option */}
                  <button
                    onClick={handleDownloadImage}
                    className="w-full px-3 py-2 text-gray-500 hover:text-gray-300 font-mono text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Or download image instead</span>
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {copyStatus === 'error' 
                    ? 'Image downloaded! Attach it to your X post manually.'
                    : 'Copy the image, then click "Post to X" and paste it into your tweet!'
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
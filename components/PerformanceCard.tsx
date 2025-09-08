'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '@/lib/timing'
import { formatScore, getScoreGrade } from '@/lib/scoring'
import { getStreakMultiplier } from '@/lib/statistics'
import ShareButton from '@/components/ShareButton'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import { getPendingGameResults, clearPendingGameResults } from '@/lib/localStorage'
import { saveGameSession, getUserRank } from '@/lib/supabase/gameService'

interface PerformanceCardProps {
  finalScore: number
  accuracy: number
  avgReactionTime: number
  hits: number
  misses: number
  bestStreak: number
  difficultyLevel: number
  trapHit: boolean
  isNewHighScore: boolean
  previousHighScore: number
  reactionTimes: number[]
  isPracticeMode?: boolean
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
  elapsedTime: number // Time played in seconds
  userRank?: number | null
  leaderboardType?: 'daily' | 'all-time'
  username?: string
  xHandle?: string | null
  scorePercentile?: number | null
  totalPlayersToday?: number
  onShareModalChange?: (isOpen: boolean) => void
}

export default function PerformanceCard({
  finalScore,
  accuracy,
  avgReactionTime,
  hits,
  misses,
  bestStreak,
  difficultyLevel,
  trapHit,
  isNewHighScore,
  previousHighScore,
  reactionTimes,
  isPracticeMode = false,
  saveStatus = 'idle',
  elapsedTime,
  userRank,
  leaderboardType = 'daily',
  username,
  xHandle,
  scorePercentile,
  totalPlayersToday = 0,
  onShareModalChange
}: PerformanceCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingSaveStatus, setPendingSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pendingRank, setPendingRank] = useState<number | null>(null)
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  // Check for pending scores to save after authentication
  useEffect(() => {
    const savePendingScore = async () => {
      if (user && !isPracticeMode && pendingSaveStatus === 'idle') {
        const pendingResults = getPendingGameResults()
        if (pendingResults) {
          setPendingSaveStatus('saving')
          
          try {
            // Save the pending score
            const { error } = await saveGameSession(user.id, pendingResults)
            
            if (!error) {
              setPendingSaveStatus('saved')
              clearPendingGameResults()
              
              // Fetch rank for the saved score
              const { rank } = await getUserRank(user.id, 'daily')
              setPendingRank(rank)
            } else {
              setPendingSaveStatus('error')
              console.error('Failed to save pending score:', error)
            }
          } catch (error) {
            setPendingSaveStatus('error')
            console.error('Error saving pending score:', error)
          }
        }
      }
    }
    
    savePendingScore()
  }, [user, isPracticeMode])
  
  // Calculate performance metrics
  const fastestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0
  const slowestTime = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0
  // Calculate consistency - how similar reaction times are
  // Using coefficient of variation (lower = more consistent)
  const calculateConsistency = () => {
    if (reactionTimes.length <= 1) return 100
    
    // Calculate standard deviation
    const mean = avgReactionTime
    const variance = reactionTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / reactionTimes.length
    const stdDev = Math.sqrt(variance)
    
    // Coefficient of variation (CV) as percentage
    const cv = (stdDev / mean) * 100
    
    // Convert CV to consistency score (lower CV = higher consistency)
    // CV of 0% = 100% consistency, CV of 50%+ = 0% consistency
    return Math.max(0, Math.round(100 - (cv * 2)))
  }
  
  const consistency = calculateConsistency()
  
  // Visual bar widths (percentage) - ensure they're valid numbers
  const accuracyBar = Math.max(0, Math.min(100, accuracy || 0))
  const speedBar = Math.max(0, Math.min(100, (500 - avgReactionTime) / 5)) // 0ms = 100%, 500ms = 0%
  const streakBar = Math.min(bestStreak * 10, 100) // 10 streak = 100%
  
  return (
    <motion.div 
      className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 
          className={`text-2xl sm:text-3xl font-orbitron font-bold ${trapHit ? 'text-neon-red glitch' : 'text-neon-green'}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {trapHit ? 'GAME OVER - TRAP HIT!' : 'PERFORMANCE REPORT'}
        </motion.h2>
        {trapHit && (
          <p className="text-sm sm:text-base text-neon-red">Red target ended your run early!</p>
        )}
      </div>

      {/* Score Section */}
      <div className="bg-black/50 border border-neon-green/30 rounded-lg p-4 space-y-3">
        <div className="text-center">
          <p className="text-sm text-white font-mono">FINAL SCORE</p>
          <motion.p 
            className="text-4xl sm:text-5xl font-orbitron font-black text-neon-yellow text-glow mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            {formatScore(finalScore)}
          </motion.p>
          
          {/* Rank or Grade Badge - Use pending values if available */}
          <motion.div 
            className="inline-block mt-3 px-4 py-2 border-2 border-neon-cyan rounded-full"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {(pendingRank || userRank) && totalPlayersToday > 0 ? (
              <span className="text-2xl font-bold text-neon-cyan text-glow">
                {(pendingRank || userRank) === 1 ? (
                  "#1 PLAYER TODAY! 🏆"
                ) : (
                  `#${pendingRank || userRank} of ${totalPlayersToday} players today`
                )}
              </span>
            ) : (
              <span className="text-2xl font-bold text-neon-cyan text-glow">GRADE: {grade}</span>
            )}
          </motion.div>
          
          {/* High Score Indicator */}
          {isNewHighScore ? (
            <motion.p 
              className="mt-3 text-lg text-neon-green text-glow font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🏆 NEW HIGH SCORE! 🏆
            </motion.p>
          ) : previousHighScore > 0 && (
            <p className="mt-3 text-sm text-white font-mono">
              High Score: {formatScore(previousHighScore)}
            </p>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-black/50 border border-neon-green/30 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-rajdhani font-bold text-neon-green text-center">PERFORMANCE METRICS</h3>
        
        {/* Accuracy */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white font-mono">Accuracy</span>
            <span className="text-neon-cyan font-bold">{accuracy}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green-500"
              initial={{ width: "0%" }}
              animate={{ width: `${accuracyBar}%` }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/70">
            {hits} hits · {misses} misses
          </p>
        </div>

        {/* Speed */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white font-mono">Avg Speed</span>
            <span className="text-neon-yellow font-bold">{formatTime(avgReactionTime)}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: `${speedBar}%` }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </div>
          <p className="text-xs text-white/70">
            Fastest: {formatTime(fastestTime)} · Slowest: {formatTime(slowestTime)}
          </p>
        </div>

        {/* Streak */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white font-mono">Best Streak</span>
            <span className="text-orange-400 font-bold">{bestStreak} {getStreakMultiplier(bestStreak)}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: `${streakBar}%` }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </div>
        </div>

        {/* Consistency */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white font-mono">Consistency</span>
            <span className="text-purple-400 font-bold">{consistency}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${consistency}%` }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </div>
          <p className="text-xs text-white/70">
            How similar your reaction times were
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/50 border border-neon-green/30 rounded-lg p-3 text-center">
          <p className="text-xs text-white font-mono">TIME PLAYED</p>
          <p className="text-lg font-bold text-purple-400">{elapsedTime}s / 60s</p>
        </div>
        <div className="bg-black/50 border border-neon-green/30 rounded-lg p-3 text-center">
          <p className="text-xs text-white font-mono">TARGETS HIT</p>
          <p className="text-lg font-bold text-neon-cyan">{hits} targets</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-3 mt-4">
        <motion.button
          onClick={() => window.location.href = '/stats'}
          className="flex-1 px-4 py-2 bg-purple-500/20 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500/30 transition-all font-mono text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          View Stats
        </motion.button>
        <motion.button
          onClick={() => window.location.href = '/leaderboard'}
          className="flex-1 px-4 py-2 bg-cyan/20 border border-cyan text-cyan rounded-lg hover:bg-cyan/30 transition-all font-mono text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          Leaderboard
        </motion.button>
      </div>
      
      {/* Save Status / Practice Mode Indicator */}
      {isPracticeMode ? (
        <motion.div 
          className="mt-4 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-sm text-amber-400 text-center font-mono mb-2">
            ⚠️ Practice Mode - Score not saved!
          </p>
          <p className="text-xs text-amber-400/80 text-center mb-3">
            Sign in to save this score & compete on the leaderboard
          </p>
          <motion.button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-4 py-2.5 min-h-[44px] bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-orbitron font-bold text-sm sm:text-base rounded-lg hover:bg-amber-500/30 hover:text-amber-300 hover:border-amber-400 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔐 Sign In to Save This Score
          </motion.button>
        </motion.div>
      ) : pendingSaveStatus !== 'idle' ? (
        // Show pending save status
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {pendingSaveStatus === 'saving' && (
            <p className="text-sm text-yellow-400 text-center font-mono animate-pulse">
              💾 Saving your practice score...
            </p>
          )}
          {pendingSaveStatus === 'saved' && (
            <div className="text-center">
              <p className="text-sm text-green-400 font-mono mb-1">
                ✅ Your practice score has been saved!
              </p>
              <p className="text-xs text-green-400/80">
                You're now competing on the leaderboard
              </p>
            </div>
          )}
          {pendingSaveStatus === 'error' && (
            <p className="text-sm text-red-400 text-center font-mono">
              ❌ Failed to save practice score
            </p>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {saveStatus === 'saving' && (
            <p className="text-sm text-yellow-400 text-center font-mono animate-pulse">
              💾 Saving your score...
            </p>
          )}
          {saveStatus === 'saved' && (
            <p className="text-sm text-green-400 text-center font-mono">
              ✅ Score saved to leaderboard!
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm text-red-400 text-center font-mono">
              ❌ Failed to save score (playing offline)
            </p>
          )}
        </motion.div>
      )}
      
      {/* Share Button - Only show after score is saved or in practice mode */}
      {(saveStatus === 'saved' || isPracticeMode) && (
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ShareButton
            finalScore={finalScore}
            accuracy={accuracy}
            avgReactionTime={avgReactionTime}
            bestStreak={bestStreak}
            trapHit={trapHit}
            userRank={userRank}
            leaderboardType={leaderboardType}
            username={username}
            xHandle={xHandle}
            scorePercentile={scorePercentile}
            totalPlayersToday={totalPlayersToday}
            onModalChange={onShareModalChange}
          />
        </motion.div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onGoogleSignIn={signInWithGoogle}
      />
    </motion.div>
  )
}
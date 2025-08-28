'use client'

import { motion } from 'framer-motion'
import { formatTime } from '@/lib/timing'
import { formatScore, getScoreGrade } from '@/lib/scoring'
import { getStreakMultiplier } from '@/lib/statistics'

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
  saveStatus = 'idle'
}: PerformanceCardProps) {
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  // Calculate performance metrics
  const fastestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0
  const slowestTime = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0
  const consistency = reactionTimes.length > 1 
    ? Math.round((1 - (slowestTime - fastestTime) / avgReactionTime) * 100)
    : 100
  
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
          {trapHit ? 'TRAP HIT!' : 'PERFORMANCE REPORT'}
        </motion.h2>
        {trapHit && (
          <p className="text-sm sm:text-base text-neon-red">You clicked a red trap target!</p>
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
          
          {/* Grade Badge */}
          <motion.div 
            className="inline-block mt-3 px-4 py-2 border-2 border-neon-cyan rounded-full"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-2xl font-bold text-neon-cyan text-glow">GRADE: {grade}</span>
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
          <p className="text-xs text-white font-mono">MAX DIFFICULTY</p>
          <p className="text-lg font-bold text-purple-400">Level {Math.round(difficultyLevel / 10)}</p>
        </div>
        <div className="bg-black/50 border border-neon-green/30 rounded-lg p-3 text-center">
          <p className="text-xs text-white font-mono">ROUNDS COMPLETED</p>
          <p className="text-lg font-bold text-neon-cyan">10/10</p>
        </div>
      </div>
      
      {/* Save Status / Practice Mode Indicator */}
      {isPracticeMode ? (
        <motion.div 
          className="mt-4 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-amber-400 text-center font-mono">
            🎮 Practice Mode - Sign in to save your scores!
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
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
    </motion.div>
  )
}
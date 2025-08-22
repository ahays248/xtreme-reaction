'use client'

import { motion } from 'framer-motion'
import { GameResults } from '@/lib/game/types'
import { useEffect, useRef } from 'react'
import { usePlatformAdjustments } from '@/hooks/usePlatformAdjustments'

interface ScoreBoardProps {
  results: GameResults
  onRestart: () => void
  onShare: () => void
}

export function ScoreBoard({ results, onRestart, onShare }: ScoreBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const { adjustReactionTime, adjustScore, getAdjustedGrade, getPlatformInfo } = usePlatformAdjustments()
  const platformInfo = getPlatformInfo()

  // Grade based on performance (adjusted for platform)
  const getGrade = () => {
    return getAdjustedGrade(results.avgReactionTime, results.accuracy)
  }
  
  // Get adjusted values for display
  const adjustedReactionTime = adjustReactionTime(results.avgReactionTime)
  const adjustedScore = adjustScore(results.score)
  
  /* OLD GRADING LOGIC - REPLACED BY PLATFORM ADJUSTMENTS
    // Perfect accuracy gets bonus consideration
    if (results.accuracy === 100) {
      if (results.avgReactionTime < 500) return 'S'
      if (results.avgReactionTime < 600) return 'A'
      if (results.avgReactionTime < 700) return 'B'
      if (results.avgReactionTime < 800) return 'C'
      return 'B' // Minimum B for perfect accuracy
    }
    
    // S Grade: Elite performance
    if (results.avgReactionTime < 500 && results.accuracy >= 95) return 'S'
    if (results.avgReactionTime < 450 && results.accuracy >= 90) return 'S'
    
    // A Grade: Excellent performance
    if (results.avgReactionTime < 600 && results.accuracy >= 85) return 'A'
    if (results.avgReactionTime < 550 && results.accuracy >= 80) return 'A'
    
    // B Grade: Good performance  
    if (results.avgReactionTime < 700 && results.accuracy >= 75) return 'B'
    if (results.avgReactionTime < 650 && results.accuracy >= 70) return 'B'
    
    // C Grade: Average performance
    if (results.avgReactionTime < 800 && results.accuracy >= 65) return 'C'
    if (results.avgReactionTime < 750 && results.accuracy >= 60) return 'C'
    
    // D Grade: Below average
    if (results.avgReactionTime < 900 && results.accuracy >= 50) return 'D'
    
    // F Grade: Needs improvement
    return 'F'
  */

  const grade = getGrade()
  const gradeColors: Record<string, string> = {
    'S': 'text-yellow-400',
    'A': 'text-green-400',
    'B': 'text-blue-400',
    'C': 'text-gray-400',
    'D': 'text-orange-400',
    'F': 'text-red-400',
  }

  return (
    <motion.div
      ref={boardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl"
      id="scoreboard"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Game Complete!
      </h2>

      {/* Grade */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`text-8xl font-bold ${gradeColors[grade]}`}
        >
          {grade}
        </motion.div>
        <div className="text-gray-400 mt-2">Performance Grade</div>
      </div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <div className="text-5xl font-bold text-white">{adjustedScore}</div>
        <div className="text-gray-400">
          Total Score
          {adjustedScore !== results.score && (
            <span className="text-xs ml-2 text-blue-400">
              (raw: {results.score})
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 mb-6"
      >
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Avg Reaction Time</span>
          <span className="font-bold">
            {adjustedReactionTime}ms
            {adjustedReactionTime !== results.avgReactionTime && (
              <span className="text-xs text-blue-400 ml-1">
                (raw: {results.avgReactionTime}ms)
              </span>
            )}
            {adjustedReactionTime < 400 && ' 🔥'}
            {adjustedReactionTime < 300 && ' ⚡'}
          </span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Accuracy</span>
          <span className="font-bold">
            {results.accuracy}%
            {results.totalClicks > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({results.successfulHits}/{results.totalClicks} clicks)
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Successful Hits</span>
          <span className="font-bold text-green-400">{results.successfulHits}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Fakes Avoided</span>
          <span className="font-bold text-blue-400">{results.fakesAvoided || 0}</span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Errors</span>
          <span className="font-bold text-red-400">
            {results.incorrectHits + results.missedCues}
          </span>
        </div>
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Difficulty Reached</span>
          <span className="font-bold">{results.difficulty.toFixed(1)}</span>
        </div>
        
        {/* Platform indicator */}
        <div className="flex justify-between text-white">
          <span className="text-gray-400">Platform</span>
          <span className={`font-bold ${platformInfo.color}`}>
            {platformInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <button
          onClick={onShare}
          className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
        
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
        >
          Play Again
        </button>

        <button
          onClick={() => {
            // TODO: Navigate to leaderboard
            console.log('View leaderboard')
          }}
          className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Leaderboard
        </button>
      </motion.div>
    </motion.div>
  )
}
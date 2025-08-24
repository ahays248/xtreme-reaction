'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Target from '@/components/Target'
import MatrixRain from '@/components/MatrixRain'
import { useClickHandler } from '@/hooks/useClickHandler'
import { useGameLoop } from '@/hooks/useGameLoop'
import { calculateReactionTime, calculateAverage, formatTime, getLastNTimes } from '@/lib/timing'
import { getDifficultyConfig, getTargetSizeClass } from '@/lib/difficulty'
import { calculateFinalScore, formatScore, getHighScore, setHighScore, isNewHighScore, getScoreGrade } from '@/lib/scoring'
import { calculateAccuracy, calculateStreakBonus, getStreakMultiplier } from '@/lib/statistics'

const ROUND_DELAY = 1500 // Delay between rounds

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const [lastMissed, setLastMissed] = useState(false)
  const [isTrapTarget, setIsTrapTarget] = useState(false)
  const [showMissFeedback, setShowMissFeedback] = useState(false)
  const targetShowTime = useRef<number>(0)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const roundDelayId = useRef<NodeJS.Timeout | null>(null)
  const lastTapTime = useRef<number>(0)
  
  const { gameState, startGame, nextRound, recordHit, recordMiss, recordTrapHit, resetGame } = useGameLoop()

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      if (roundDelayId.current) clearTimeout(roundDelayId.current)
    }
  }, [])

  // Auto-spawn targets during game
  useEffect(() => {
    if (gameState.status === 'playing' && !showTarget && gameState.currentRound <= gameState.maxRounds) {
      // Small delay before showing next target
      roundDelayId.current = setTimeout(() => {
        showNextTarget()
      }, ROUND_DELAY)
    }
  }, [gameState.currentRound, gameState.status, showTarget])

  const showNextTarget = () => {
    // 25% chance of trap target (increases slightly with difficulty)
    const trapChance = 0.20 + (gameState.currentRound / gameState.maxRounds) * 0.10 // 20-30%
    const isCurrentTrap = Math.random() < trapChance
    
    setIsTrapTarget(isCurrentTrap)
    setShowTarget(true)
    setLastMissed(false)
    targetShowTime.current = Date.now()
    
    // Get difficulty settings for current round
    const difficulty = getDifficultyConfig(gameState.currentRound, gameState.maxRounds)
    
    // Set timeout for auto-hide with progressive difficulty
    timeoutId.current = setTimeout(() => {
      setShowTarget(false)
      
      if (isCurrentTrap) {
        // Successfully avoided trap - continue game
        setLastReaction(null)
        targetShowTime.current = 0
        nextRound()
        console.log('Trap avoided - good job!')
      } else {
        // Missed a real target
        recordMiss()
        setLastMissed(true)
        setShowMissFeedback(true)
        setLastReaction(null)
        targetShowTime.current = 0
        // Clear miss feedback after 500ms
        setTimeout(() => setShowMissFeedback(false), 500)
        nextRound()
        console.log('Target missed - too slow!')
      }
    }, difficulty.timeout)
  }

  const handleTargetClick = useClickHandler(() => {
    // Prevent double-tap registration (100ms cooldown)
    const now = Date.now()
    if (now - lastTapTime.current < 100) {
      console.log('Double-tap prevented')
      return
    }
    lastTapTime.current = now
    
    if (targetShowTime.current > 0 && timeoutId.current) {
      // Clear the timeout since target was clicked
      clearTimeout(timeoutId.current)
      timeoutId.current = null
      
      if (isTrapTarget) {
        // Hit a trap target - game over!
        setShowTarget(false)
        targetShowTime.current = 0
        recordTrapHit()
        console.log('TRAP HIT! Game Over!')
      } else {
        // Hit a normal target
        const reactionTime = calculateReactionTime(targetShowTime.current, Date.now())
        recordHit(reactionTime)
        setLastReaction(reactionTime)
        setLastMissed(false)
        setShowTarget(false)
        targetShowTime.current = 0
        nextRound()
        console.log(`Reaction time: ${reactionTime}ms`)
      }
    }
  })

  const handleStartGame = () => {
    // Clear any existing timeouts
    if (timeoutId.current) clearTimeout(timeoutId.current)
    if (roundDelayId.current) clearTimeout(roundDelayId.current)
    
    setShowTarget(false)
    setLastReaction(null)
    setLastMissed(false)
    setIsTrapTarget(false)
    startGame()
  }

  const handleReset = () => {
    // Clear any existing timeouts
    if (timeoutId.current) clearTimeout(timeoutId.current)
    if (roundDelayId.current) clearTimeout(roundDelayId.current)
    
    setShowTarget(false)
    setLastReaction(null)
    setLastMissed(false)
    setIsTrapTarget(false)
    resetGame()
  }

  const last5Times = getLastNTimes(gameState.reactionTimes, 5)
  const averageTime = calculateAverage(last5Times)
  
  // Get current difficulty settings
  const currentDifficulty = gameState.status === 'playing' 
    ? getDifficultyConfig(gameState.currentRound, gameState.maxRounds)
    : getDifficultyConfig(1, gameState.maxRounds)

  return (
    <main className="min-h-screen bg-black text-neon-green flex flex-col items-center justify-between p-4 relative overflow-hidden">
      <MatrixRain />
      
      {/* Scanline effect */}
      <div className="scanline" />
      
      {/* Header with cyberpunk styling */}
      <motion.div 
        className="text-center mt-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-4 text-glow-soft animate-flicker">
          XTREME REACTION
        </h1>
        <p className="text-xl mb-2 font-mono text-neon-cyan">Phase 10: UI Polish</p>
        <p className="text-sm opacity-70 font-rajdhani">
          Test your reflexes. Compete with the world. Share on X.
        </p>
      </motion.div>

      <div className={`flex flex-col items-center gap-6 flex-grow justify-center transition-all duration-200 z-10 min-h-[500px] ${
        showMissFeedback ? 'border-4 border-neon-red animate-pulse shadow-neon-red' : ''
      }`}>
        {/* Game status display */}
        {gameState.status === 'idle' && (
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-2xl font-rajdhani font-bold text-glow">Ready to test your reflexes?</p>
            <p className="text-sm opacity-70 font-mono">Hit 10 targets as fast as you can!</p>
            {getHighScore() > 0 && (
              <motion.p 
                className="text-lg font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                High Score: <span className="text-neon-yellow text-glow">{formatScore(getHighScore())}</span>
              </motion.p>
            )}
          </motion.div>
        )}

        {gameState.status === 'playing' && (
          <>
            {/* Game stats header */}
            <motion.div 
              className="flex justify-between items-center w-full max-w-md px-4 py-2 border-2 border-neon-green/30 bg-black/50 backdrop-blur-sm shadow-neon-green rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-lg font-mono">
                Score: <span className="text-neon-yellow font-bold">{formatScore(gameState.score)}</span>
              </div>
              <div className="text-xl font-orbitron font-bold text-neon-cyan">
                {gameState.currentRound}/{gameState.maxRounds}
              </div>
              <div className="text-lg font-mono">
                Accuracy: <span className="text-neon-green font-bold">{calculateAccuracy(gameState.hits, gameState.misses)}%</span>
              </div>
            </motion.div>

            {/* Stats display */}
            <div className="text-center space-y-2">
              <div className="text-lg font-mono space-x-4">
                <span>Hits: <span className="text-neon-green font-bold">{gameState.hits}</span></span>
                <span>Misses: <span className="text-neon-red font-bold">{gameState.misses}</span></span>
              </div>
              
              {/* Streak display */}
              <AnimatePresence>
                {gameState.currentStreak > 0 && (
                  <motion.div 
                    className="text-lg font-mono"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    Streak: <span className="text-orange-400 text-glow font-bold">{gameState.currentStreak}</span> {getStreakMultiplier(gameState.currentStreak)}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Feedback message */}
              <AnimatePresence mode="wait">
                {lastMissed ? (
                  <motion.div 
                    key="missed"
                    className="text-xl font-mono text-neon-red text-glow-red"
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    MISSED! Too slow!
                  </motion.div>
                ) : lastReaction !== null && (
                  <motion.div 
                    key="reaction"
                    className="text-xl font-mono"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                  >
                    Last: <span className="text-neon-yellow font-bold">{formatTime(lastReaction)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timeout indicator with dynamic value */}
            <AnimatePresence>
              {showTarget && (
                <motion.div 
                  className="text-xs font-mono opacity-70 text-neon-cyan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isTrapTarget ? "⚠️ DON'T CLICK THE RED! ⚠️" : `React within ${(currentDifficulty.timeout / 1000).toFixed(1)} seconds!`}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Difficulty indicator */}
            <div className="text-sm font-mono opacity-70 text-neon-cyan">
              Difficulty: <span className="font-bold">{currentDifficulty.difficultyPercent}%</span>
            </div>
          </>
        )}

        {gameState.status === 'gameOver' && (() => {
          const accuracy = calculateAccuracy(gameState.hits, gameState.misses)
          const avgReactionTime = gameState.reactionTimes.length > 0 
            ? calculateAverage(gameState.reactionTimes) 
            : 0
          const streakBonus = calculateStreakBonus(gameState.bestStreak) * gameState.bestStreak
          // If trap hit, score is 0 (penalty for hitting trap)
          const finalScore = gameState.trapHit 
            ? 0 
            : calculateFinalScore(
                gameState.hitScores,
                accuracy,
                gameState.difficultyLevel || 0,
                streakBonus
              )
          const grade = gameState.trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
          const highScore = getHighScore()
          const isNewHigh = isNewHighScore(finalScore)
          
          // Save high score if new
          if (isNewHigh) {
            setHighScore(finalScore)
          }
          
          return (
            <motion.div 
              className="text-center space-y-4 p-6 border-2 border-neon-green/50 bg-black/70 backdrop-blur-sm rounded-lg shadow-neon-intense"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.p 
                className={`text-3xl font-orbitron font-bold ${gameState.trapHit ? 'text-neon-red glitch' : 'text-neon-green'}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {gameState.trapHit ? 'TRAP HIT!' : 'GAME OVER!'}
              </motion.p>
              {gameState.trapHit && (
                <p className="text-xl text-neon-red text-glow-red">You clicked a red trap target!</p>
              )}
              
              {/* Final Score Display */}
              <div className="space-y-2">
                <p className="text-xl font-rajdhani">Final Score</p>
                <motion.p 
                  className="text-5xl font-orbitron font-black text-neon-yellow text-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  {formatScore(finalScore)}
                </motion.p>
                <p className="text-2xl font-bold font-mono text-neon-cyan">Grade: <span className="text-glow">{grade}</span></p>
                {isNewHigh && (
                  <motion.p 
                    className="text-xl text-neon-green text-glow-green"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    NEW HIGH SCORE!
                  </motion.p>
                )}
                {!isNewHigh && highScore > 0 && (
                  <p className="text-sm opacity-70 font-mono">High Score: {formatScore(highScore)}</p>
                )}
              </div>
              
              {/* Detailed Stats */}
              <div className="text-lg font-mono space-y-1 pt-4 border-t border-neon-green/30">
                <p>Hits: <span className="text-neon-green font-bold">{gameState.hits}</span></p>
                <p>Misses: <span className="text-neon-red font-bold">{gameState.misses}</span></p>
                <p>Accuracy: <span className="text-neon-cyan font-bold">{accuracy}%</span></p>
                {avgReactionTime > 0 && (
                  <p>Avg Time: <span className="text-neon-yellow font-bold">{formatTime(avgReactionTime)}</span></p>
                )}
                {gameState.bestStreak > 0 && (
                  <p>Best Streak: <span className="text-orange-400 font-bold">{gameState.bestStreak} {getStreakMultiplier(gameState.bestStreak)}</span></p>
                )}
                {streakBonus > 0 && (
                  <p>Streak Bonus: <span className="text-orange-400 font-bold">+{streakBonus}</span></p>
                )}
                <p>Difficulty Reached: <span className="text-purple-400 font-bold">{gameState.difficultyLevel || 0}%</span></p>
              </div>
            </motion.div>
          )
        })()}

        <div className="h-32 flex items-center justify-center">
          <Target 
            isVisible={showTarget && gameState.status === 'playing'} 
            onTargetClick={handleTargetClick}
            size={currentDifficulty.targetSize}
            variant={isTrapTarget ? 'trap' : 'normal'}
          />
        </div>
      </div>

      {/* Game controls - moved to bottom */}
      <motion.div 
        className="flex gap-4 mb-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
          {gameState.status === 'idle' && (
            <motion.button
              onClick={handleStartGame}
              className="px-8 py-4 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-xl rounded-lg hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green transition-all duration-200 shadow-neon-green hover:shadow-neon-intense"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START GAME
            </motion.button>
          )}
          
          {gameState.status === 'gameOver' && (
            <>
              <motion.button
                onClick={handleStartGame}
                className="px-6 py-3 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold rounded-lg hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green transition-all duration-200 shadow-neon-green hover:shadow-neon-intense"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="px-6 py-3 bg-black border-2 border-gray-600 text-gray-400 font-orbitron font-bold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                MENU
              </motion.button>
            </>
          )}
          
          {gameState.status === 'playing' && (
            <motion.button
              onClick={handleReset}
              className="px-4 py-2 bg-black border border-gray-600 text-gray-400 font-mono text-sm rounded hover:border-red-500 hover:text-red-500 transition-all duration-200 opacity-70"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              END GAME
            </motion.button>
          )}
      </motion.div>
    </main>
  )
}
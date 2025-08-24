'use client'

import { useState, useRef, useEffect } from 'react'
import Target from '@/components/Target'
import { useClickHandler } from '@/hooks/useClickHandler'
import { useGameLoop } from '@/hooks/useGameLoop'
import { calculateReactionTime, calculateAverage, formatTime, getLastNTimes } from '@/lib/timing'
import { getDifficultyConfig, getTargetSizeClass } from '@/lib/difficulty'

const ROUND_DELAY = 1500 // Delay between rounds

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const [lastMissed, setLastMissed] = useState(false)
  const [isTrapTarget, setIsTrapTarget] = useState(false)
  const targetShowTime = useRef<number>(0)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const roundDelayId = useRef<NodeJS.Timeout | null>(null)
  
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
        setLastReaction(null)
        targetShowTime.current = 0
        nextRound()
        console.log('Target missed - too slow!')
      }
    }, difficulty.timeout)
  }

  const handleTargetClick = useClickHandler(() => {
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
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Xtreme Reaction</h1>
        <p className="text-xl mb-2">Phase 7: Trap Targets</p>
        <p className="text-sm opacity-70">
          Test your reflexes. Compete with the world. Share on X.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Game status display */}
        {gameState.status === 'idle' && (
          <div className="text-center space-y-4">
            <p className="text-2xl">Ready to test your reflexes?</p>
            <p className="text-sm opacity-70">Hit 10 targets as fast as you can!</p>
          </div>
        )}

        {gameState.status === 'playing' && (
          <>
            {/* Round counter */}
            <div className="text-xl font-mono">
              Round {gameState.currentRound} / {gameState.maxRounds}
            </div>

            {/* Stats display */}
            <div className="text-center space-y-2">
              <div className="text-lg font-mono space-x-4">
                <span>Hits: <span className="text-green-400">{gameState.hits}</span></span>
                <span>Misses: <span className="text-red-400">{gameState.misses}</span></span>
              </div>
              
              {/* Feedback message */}
              {lastMissed ? (
                <div className="text-xl font-mono text-red-500">
                  MISSED! Too slow!
                </div>
              ) : lastReaction !== null && (
                <div className="text-xl font-mono">
                  Last: <span className="text-yellow-400">{formatTime(lastReaction)}</span>
                </div>
              )}
            </div>

            {/* Timeout indicator with dynamic value */}
            {showTarget && (
              <div className="text-xs font-mono opacity-50">
                {isTrapTarget ? "DON'T CLICK THE RED!" : `React within ${(currentDifficulty.timeout / 1000).toFixed(1)} seconds!`}
              </div>
            )}
            
            {/* Difficulty indicator */}
            <div className="text-sm font-mono opacity-70">
              Difficulty: {currentDifficulty.difficultyPercent}%
            </div>
          </>
        )}

        {gameState.status === 'gameOver' && (
          <div className="text-center space-y-4">
            <p className="text-3xl font-bold">
              {gameState.trapHit ? 'TRAP HIT!' : 'Game Over!'}
            </p>
            {gameState.trapHit && (
              <p className="text-xl text-red-500">You clicked a red trap target!</p>
            )}
            <div className="space-y-2">
              <p className="text-xl">Final Score</p>
              <div className="text-lg font-mono">
                <p>Hits: <span className="text-green-400">{gameState.hits}</span></p>
                <p>Misses: <span className="text-red-400">{gameState.misses}</span></p>
                {gameState.reactionTimes.length > 0 && (
                  <p>Avg Time: <span className="text-yellow-400">{formatTime(calculateAverage(gameState.reactionTimes))}</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        <Target 
          isVisible={showTarget && gameState.status === 'playing'} 
          onTargetClick={handleTargetClick}
          size={currentDifficulty.targetSize}
          variant={isTrapTarget ? 'trap' : 'normal'}
        />
        
        {/* Game controls */}
        <div className="flex gap-4">
          {gameState.status === 'idle' && (
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-green-500 text-black font-bold text-xl rounded hover:bg-green-400 transition-colors"
            >
              Start Game
            </button>
          )}
          
          {gameState.status === 'gameOver' && (
            <>
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
              >
                Back to Menu
              </button>
            </>
          )}
          
          {gameState.status === 'playing' && (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
            >
              End Game
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
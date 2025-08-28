import { useState, useCallback } from 'react'
import { GameState, initialGameState } from '@/lib/gameState'
import { getDifficultyConfig } from '@/lib/difficulty'
import { calculateHitScore } from '@/lib/scoring'

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  const startGame = useCallback(() => {
    setGameState({
      ...initialGameState,
      status: 'playing',
      currentRound: 1
    })
  }, [])

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const nextRound = prev.currentRound + 1
      if (nextRound > prev.maxRounds) {
        return { ...prev, status: 'gameOver' }
      }
      // Calculate difficulty for the next round
      const difficulty = getDifficultyConfig(nextRound, prev.maxRounds)
      return { 
        ...prev, 
        currentRound: nextRound,
        difficultyLevel: difficulty.difficultyPercent
      }
    })
  }, [])

  const recordHit = useCallback((reactionTime: number) => {
    const hitScore = calculateHitScore(reactionTime)
    setGameState(prev => {
      const newStreak = prev.currentStreak + 1
      const bestStreak = Math.max(newStreak, prev.bestStreak)
      return {
        ...prev,
        hits: prev.hits + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
        score: prev.score + hitScore,
        hitScores: [...prev.hitScores, hitScore],
        currentStreak: newStreak,
        bestStreak
      }
    })
  }, [])

  const recordMiss = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      misses: prev.misses + 1,
      currentStreak: 0 // Reset streak on miss
    }))
  }, [])

  const recordTrapHit = useCallback(() => {
    setGameState(prev => {
      const elapsedTime = prev.gameStartTime 
        ? Math.floor((Date.now() - prev.gameStartTime) / 1000)
        : 0
      return {
        ...prev,
        status: 'gameOver',
        trapHit: true,
        elapsedTime
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState(initialGameState)
  }, [])

  const updateElapsedTime = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing' || !prev.gameStartTime) return prev
      
      const elapsedTime = Math.floor((Date.now() - prev.gameStartTime) / 1000)
      
      // Auto end game if time is up
      if (elapsedTime >= prev.maxGameTime) {
        return { ...prev, status: 'gameOver', elapsedTime }
      }
      
      // Update difficulty based on time (increases over 60 seconds)
      const difficultyPercent = Math.min(100, (elapsedTime / prev.maxGameTime) * 100)
      
      return { ...prev, elapsedTime, difficultyLevel: difficultyPercent }
    })
  }, [])

  return {
    gameState,
    startGame,
    nextRound,
    recordHit,
    recordMiss,
    recordTrapHit,
    resetGame,
    updateElapsedTime
  }
}
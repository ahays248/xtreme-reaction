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
    setGameState(prev => ({
      ...prev,
      hits: prev.hits + 1,
      reactionTimes: [...prev.reactionTimes, reactionTime],
      score: prev.score + hitScore,
      hitScores: [...prev.hitScores, hitScore]
    }))
  }, [])

  const recordMiss = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      misses: prev.misses + 1
    }))
  }, [])

  const recordTrapHit = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: 'gameOver',
      trapHit: true
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState(initialGameState)
  }, [])

  return {
    gameState,
    startGame,
    nextRound,
    recordHit,
    recordMiss,
    recordTrapHit,
    resetGame
  }
}
import { useState, useCallback } from 'react'
import { GameState, initialGameState } from '@/lib/gameState'

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
      return { ...prev, currentRound: nextRound }
    })
  }, [])

  const recordHit = useCallback((reactionTime: number) => {
    setGameState(prev => ({
      ...prev,
      hits: prev.hits + 1,
      reactionTimes: [...prev.reactionTimes, reactionTime]
    }))
  }, [])

  const recordMiss = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      misses: prev.misses + 1
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
    resetGame
  }
}
import { useState, useCallback, useEffect, useRef } from 'react'
import { GameState, GameConfig, GameResults } from '@/lib/game/types'
import { 
  DEFAULT_CONFIG, 
  calculateScore, 
  getRandomDelay, 
  shouldShowFakeCue,
  getPunishmentDuration,
  calculateResults
} from '@/lib/game/engine'
import { getSoundManager } from '@/lib/game/sounds'
import { getMusicManager } from '@/lib/game/music'

const INITIAL_STATE: GameState = {
  status: 'idle',
  currentRound: 0,
  totalRounds: DEFAULT_CONFIG.totalRounds,
  reactionTimes: [],
  successfulHits: 0,
  incorrectHits: 0,
  missedCues: 0,
  fakesAvoided: 0,
  totalClicks: 0,
  difficulty: 1,
  score: 0,
  cueStartTime: null,
  isFakeCue: false,
  punishmentEndTime: null,
  consecutiveErrors: 0,
}

export function useGame(config: Partial<GameConfig> = {}) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)
  const [gameResults, setGameResults] = useState<GameResults | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cueTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const gameConfig = { ...DEFAULT_CONFIG, ...config }
  const soundManager = getSoundManager()
  const musicManager = getMusicManager()

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (cueTimeoutRef.current) {
      clearTimeout(cueTimeoutRef.current)
      cueTimeoutRef.current = null
    }
  }, [])

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [clearAllTimeouts])

  const finishGame = useCallback(() => {
    clearAllTimeouts()
    // Stop background music
    musicManager.stop()
    setGameState(prev => {
      const results = calculateResults(prev)
      setGameResults(results)
      return { ...prev, status: 'finished', score: results.score }
    })
  }, [clearAllTimeouts])

  const startRound = useCallback(() => {
    setGameState(prev => {
      // Don't start if already finished
      if (prev.status === 'finished') {
        return prev
      }

      // Check if game should end BEFORE starting new round
      if (prev.currentRound >= prev.totalRounds) {
        // Schedule finish after brief delay
        setTimeout(() => finishGame(), 100)
        return prev
      }

      // Move to next round
      return {
        ...prev,
        status: 'waiting' as const,
        currentRound: prev.currentRound + 1,
        isFakeCue: false,
        cueStartTime: null,
      }
    })

    // Only schedule cue if not finished
    const currentState = gameState
    if (currentState.currentRound < currentState.totalRounds) {
      // Schedule cue appearance after random delay
      const delay = getRandomDelay(gameConfig, currentState.difficulty)
      
      timeoutRef.current = setTimeout(() => {
        const isFake = shouldShowFakeCue(gameConfig, currentState.difficulty)
        
        setGameState(current => {
          // Double-check we're still in waiting state
          if (current.status !== 'waiting') return current
          
          return {
            ...current,
            status: 'cue',
            cueStartTime: Date.now(),
            isFakeCue: isFake,
          }
        })

        // Set timeout for cue to disappear
        cueTimeoutRef.current = setTimeout(() => {
          setGameState(current => {
            // Only process if still showing cue
            if (current.status !== 'cue') return current
            
            if (current.isFakeCue) {
              // Fake cue avoided successfully - this is good!
              // Schedule next round or finish
              if (current.currentRound < current.totalRounds) {
                setTimeout(() => startRound(), 1000)
              } else {
                setTimeout(() => finishGame(), 1000)
              }
              
              return {
                ...current,
                status: 'waiting',
                fakesAvoided: current.fakesAvoided + 1,
                consecutiveErrors: 0,
                score: current.score + 200,
              }
            } else {
              // Real cue missed - this is bad!
              soundManager.play('error') // Play error sound for missed cue
              
              // Schedule next round or finish
              if (current.currentRound < current.totalRounds) {
                setTimeout(() => startRound(), 1000)
              } else {
                setTimeout(() => finishGame(), 1000)
              }
              
              return {
                ...current,
                status: 'waiting',
                missedCues: current.missedCues + 1,
                consecutiveErrors: current.consecutiveErrors + 1,
              }
            }
          })
        }, gameConfig.cueTimeout)
      }, delay)
    }
  }, [gameConfig, gameState, finishGame])

  const startGame = useCallback(() => {
    clearAllTimeouts()
    setGameState({
      ...INITIAL_STATE,
      status: 'ready',
      totalRounds: gameConfig.totalRounds,
    })
    setGameResults(null)
    
    // Start background music
    musicManager.play()
    
    // Start first round after brief delay
    timeoutRef.current = setTimeout(() => startRound(), 2000)
  }, [gameConfig.totalRounds, startRound, clearAllTimeouts])

  const handleTap = useCallback((isMissedClick: boolean = false) => {
    const currentState = gameState
    
    // Ignore taps during punishment or finished
    if (currentState.status === 'punishment' || currentState.status === 'finished') {
      return
    }
    
    // Track all clicks for accuracy calculation
    if (currentState.status === 'cue' || currentState.status === 'waiting') {
      setGameState(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1
      }))
    }
    
    if (currentState.status === 'waiting') {
      // Tapped too early (before cue appears)
      clearAllTimeouts()
      soundManager.play('error') // Play error sound
      
      const punishmentDuration = getPunishmentDuration(gameConfig, currentState.consecutiveErrors)
      
      setGameState(prev => ({
        ...prev,
        status: 'punishment',
        incorrectHits: prev.incorrectHits + 1,
        consecutiveErrors: prev.consecutiveErrors + 1,
        punishmentEndTime: Date.now() + punishmentDuration,
      }))

      // End punishment and continue
      timeoutRef.current = setTimeout(() => {
        setGameState(prev => {
          // Check if should continue or finish
          if (prev.currentRound < prev.totalRounds) {
            setTimeout(() => startRound(), 500)
          } else {
            setTimeout(() => finishGame(), 500)
          }
          return { ...prev, status: 'waiting' }
        })
      }, punishmentDuration)
      return
    }

    if (currentState.status === 'cue') {
      // If it's a missed click on a real cue, just count it but don't stop the round
      if (isMissedClick && !currentState.isFakeCue) {
        // Clicked background instead of green circle - no punishment, just track
        return // Let the cue continue to display
      }
      
      clearAllTimeouts()
      
      if (currentState.isFakeCue) {
        // Tapped on fake cue - this is bad!
        soundManager.play('error') // Play error sound
        const punishmentDuration = getPunishmentDuration(gameConfig, currentState.consecutiveErrors)
        
        setGameState(prev => ({
          ...prev,
          status: 'punishment',
          incorrectHits: prev.incorrectHits + 1,
          consecutiveErrors: prev.consecutiveErrors + 1,
          punishmentEndTime: Date.now() + punishmentDuration,
        }))

        // End punishment and continue
        timeoutRef.current = setTimeout(() => {
          setGameState(prev => {
            // Check if should continue or finish
            if (prev.currentRound < prev.totalRounds) {
              setTimeout(() => startRound(), 500)
            } else {
              setTimeout(() => finishGame(), 500)
            }
            return { ...prev, status: 'waiting' }
          })
        }, punishmentDuration)
      } else {
        // Successful tap on real cue - this is good!
        const reactionTime = Date.now() - (currentState.cueStartTime || Date.now())
        console.log(`Reaction time: ${reactionTime}ms for round ${currentState.currentRound}`)
        
        // Play appropriate success sound
        if (reactionTime < 400) {
          soundManager.play('perfect') // Very fast reaction
        } else {
          soundManager.play('success') // Normal success
        }
        
        setGameState(prev => ({
          ...prev,
          status: 'waiting',
          reactionTimes: [...prev.reactionTimes, reactionTime],
          successfulHits: prev.successfulHits + 1,
          consecutiveErrors: 0,
          difficulty: Math.min(10, prev.difficulty + 0.1),
          score: prev.score + Math.max(0, 1000 - reactionTime),
        }))

        // Continue to next round or finish
        if (currentState.currentRound < currentState.totalRounds) {
          setTimeout(() => startRound(), 1000)
        } else {
          setTimeout(() => finishGame(), 1000)
        }
      }
    }
  }, [gameState, gameConfig, clearAllTimeouts, startRound, finishGame])

  const resetGame = useCallback(() => {
    clearAllTimeouts()
    musicManager.stop()
    setGameState(INITIAL_STATE)
    setGameResults(null)
  }, [clearAllTimeouts])

  return {
    gameState,
    gameResults,
    startGame,
    handleTap,
    resetGame,
  }
}
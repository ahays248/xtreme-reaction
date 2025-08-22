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
import { saveGameSession } from '@/lib/supabase/gameService'
import { createClient } from '@/lib/supabase/client'

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
  const isTransitioningRef = useRef<boolean>(false)
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

  const finishGame = useCallback(async () => {
    clearAllTimeouts()
    // Stop background music
    musicManager.stop()
    
    // Get current user for saving
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    setGameState(prev => {
      const results = calculateResults(prev)
      setGameResults(results)
      
      // Save game results to database asynchronously
      saveGameSession(results, user?.id).then(result => {
        if (result.success) {
          console.log('Game session saved successfully')
        } else {
          console.error('Failed to save game session:', result.error)
        }
      }).catch(error => {
        console.error('Error saving game session:', error)
      })
      
      return { ...prev, status: 'finished', score: results.score }
    })
  }, [clearAllTimeouts])

  const startRound = useCallback(() => {
    // Prevent multiple simultaneous round starts
    if (isTransitioningRef.current) {
      console.log('Already transitioning, skipping startRound')
      return
    }
    
    console.log('startRound called')
    isTransitioningRef.current = true
    
    setGameState(prev => {
      console.log('startRound - current status:', prev.status, 'round:', prev.currentRound)
      
      // Don't start if already finished or already in waiting/cue state
      if (prev.status === 'finished' || prev.status === 'waiting' || prev.status === 'cue') {
        console.log('Skipping round start - status is', prev.status)
        isTransitioningRef.current = false
        return prev
      }

      // Check if game should end BEFORE starting new round
      if (prev.currentRound >= prev.totalRounds) {
        // Schedule finish after brief delay
        setTimeout(() => {
          isTransitioningRef.current = false
          finishGame()
        }, 100)
        return prev
      }

      // Move to next round and schedule cue
      const newState = {
        ...prev,
        status: 'waiting' as const,
        currentRound: prev.currentRound + 1,
        isFakeCue: false,
        cueStartTime: null,
      }
      
      // Schedule cue appearance after random delay
      const delay = getRandomDelay(gameConfig, newState.difficulty)
      console.log('Scheduling cue to appear in', delay, 'ms')
        
      timeoutRef.current = setTimeout(() => {
        const isFake = shouldShowFakeCue(gameConfig, newState.difficulty)
        
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
              console.log('Red circle avoided - round', current.currentRound, 'of', current.totalRounds)
              
              // Clear timeouts first
              clearAllTimeouts()
              
              // Update state
              const updatedState = {
                ...current,
                status: 'idle' as const, // Set to idle so startRound can proceed
                fakesAvoided: current.fakesAvoided + 1,
                consecutiveErrors: 0,
                score: current.score + 200,
              }
              
              // Schedule next round or finish
              if (current.currentRound < current.totalRounds) {
                console.log('Scheduling next round from red circle timeout')
                timeoutRef.current = setTimeout(() => startRound(), 1000)
              } else {
                console.log('Game should finish after red circle')
                timeoutRef.current = setTimeout(() => finishGame(), 1000)
              }
              
              return updatedState
            } else {
              // Real cue missed - this is bad!
              soundManager.play('error') // Play error sound for missed cue
              
              // Clear timeouts first
              clearAllTimeouts()
              
              // Update state
              const updatedState = {
                ...current,
                status: 'idle' as const, // Set to idle so startRound can proceed
                missedCues: current.missedCues + 1,
                consecutiveErrors: current.consecutiveErrors + 1,
              }
              
              // Schedule next round or finish
              if (current.currentRound < current.totalRounds) {
                timeoutRef.current = setTimeout(() => startRound(), 1000)
              } else {
                timeoutRef.current = setTimeout(() => finishGame(), 1000)
              }
              
              return updatedState
            }
          })
        }, gameConfig.cueTimeout)
      }, delay)
      
      // Clear transition flag after delay is set
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 100)
      
      return newState
    })
  }, [gameConfig, finishGame, clearAllTimeouts])

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
            clearAllTimeouts()
            timeoutRef.current = setTimeout(() => startRound(), 500)
          } else {
            clearAllTimeouts()
            timeoutRef.current = setTimeout(() => finishGame(), 500)
          }
          return { ...prev, status: 'idle' } // Set to idle so startRound can proceed
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
              clearAllTimeouts()
              timeoutRef.current = setTimeout(() => startRound(), 500)
            } else {
              clearAllTimeouts()
              timeoutRef.current = setTimeout(() => finishGame(), 500)
            }
            return { ...prev, status: 'idle' } // Set to idle so startRound can proceed
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
          status: 'idle', // Set to idle so startRound can proceed
          reactionTimes: [...prev.reactionTimes, reactionTime],
          successfulHits: prev.successfulHits + 1,
          consecutiveErrors: 0,
          difficulty: Math.min(10, prev.difficulty + 0.1),
          score: prev.score + Math.max(0, 1000 - reactionTime),
        }))

        // Continue to next round or finish
        clearAllTimeouts()
        if (currentState.currentRound < currentState.totalRounds) {
          console.log('Scheduling next round after successful hit')
          timeoutRef.current = setTimeout(() => startRound(), 1000)
        } else {
          timeoutRef.current = setTimeout(() => finishGame(), 1000)
        }
      }
    }
  }, [gameState, gameConfig, clearAllTimeouts, startRound, finishGame])

  const resetGame = useCallback(() => {
    clearAllTimeouts()
    musicManager.stop()
    isTransitioningRef.current = false
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
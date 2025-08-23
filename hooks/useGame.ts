import { useState, useCallback, useEffect, useRef } from 'react'
import { GameState, GameConfig, GameResults } from '@/lib/game/types'
import { 
  DEFAULT_CONFIG, 
  getRandomDelay, 
  shouldShowFakeCue,
  getCueLifespan,
  calculateStreakBonus,
  calculateResults
} from '@/lib/game/engine'
import { getSoundManager } from '@/lib/game/sounds'
import { getMusicManager } from '@/lib/game/music'
import { saveGameSession } from '@/lib/supabase/gameService'
import { createClient } from '@/lib/supabase/client'

const INITIAL_STATE: GameState = {
  status: 'idle',
  currentRound: 0,
  livesRemaining: DEFAULT_CONFIG.maxLives,
  reactionTimes: [],
  successfulHits: 0,
  incorrectHits: 0,
  missedCues: 0,
  fakesAvoided: 0,
  totalClicks: 0,
  currentStreak: 0,
  maxStreak: 0,
  streakMultiplier: 1,
  difficulty: 1,
  score: 0,
  cueStartTime: null,
  isFakeCue: false,
  cueLifespan: DEFAULT_CONFIG.startingCueLifespan,
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
  
  // Version marker to verify changes are loaded
  useEffect(() => {
    console.log('🎮 useGame hook loaded - v11.0 CLEAN TIMEOUTS!')
    console.log('🎯 Simplified timeout logic, fixed red circle duplicate bug')
    return () => {
      console.log('🔄 useGame hook unmounting')
    }
  }, [])

  // Clear main timeout
  const clearMainTimeout = useCallback(() => {
    if (timeoutRef.current) {
      console.log('🧹 Clearing main timeout')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])
  
  // Clear cue timeout
  const clearCueTimeout = useCallback(() => {
    if (cueTimeoutRef.current) {
      console.log('🧹 Clearing cue timeout')
      clearTimeout(cueTimeoutRef.current)
      cueTimeoutRef.current = null
    }
  }, [])
  
  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 clearAllTimeouts called')
    clearMainTimeout()
    clearCueTimeout()
  }, [clearMainTimeout, clearCueTimeout])

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

  const handleCorrectAction = useCallback((isHit: boolean) => {
    setGameState(prev => {
      const newStreak = prev.currentStreak + 1
      const newMaxStreak = Math.max(prev.maxStreak, newStreak)
      
      // Update streak multiplier
      let newMultiplier = 1
      if (newStreak >= gameConfig.streakThreshold) {
        newMultiplier = gameConfig.streakMultiplier
        // Play streak sound if we just hit the threshold
        if (prev.currentStreak === gameConfig.streakThreshold - 1) {
          soundManager.play('perfect') // Use perfect sound for streak
        }
      }
      
      return {
        ...prev,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        streakMultiplier: newMultiplier,
      }
    })
  }, [gameConfig, soundManager])

  const handleMistake = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.livesRemaining - 1
      
      // Play error sound
      soundManager.play('error')
      
      // Check if game over
      if (newLives <= 0) {
        setTimeout(() => finishGame(), 1000)
      }
      
      return {
        ...prev,
        livesRemaining: newLives,
        currentStreak: 0, // Reset streak
        streakMultiplier: 1, // Reset multiplier
      }
    })
  }, [soundManager, finishGame])

  const scheduleNextRound = useCallback((delayMs: number = 1500) => {
    console.log(`⏭️ Scheduling next round in ${delayMs}ms`)
    clearAllTimeouts()
    timeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false
      startRound()
    }, delayMs)
  }, [clearAllTimeouts])

  const startRound = useCallback(() => {
    // Prevent multiple simultaneous round starts
    if (isTransitioningRef.current) {
      console.log('⚠️ Already transitioning, skipping startRound')
      return
    }
    
    console.log('🎮 startRound called')
    isTransitioningRef.current = true
    
    // Clear any existing timeouts first
    clearAllTimeouts()
    
    setGameState(prev => {
      console.log(`📊 Round ${prev.currentRound + 1} - Lives: ${prev.livesRemaining} - Streak: ${prev.currentStreak}`)
      
      // Don't start if already finished or already in waiting/cue state
      if (prev.status === 'finished' || prev.status === 'waiting' || prev.status === 'cue') {
        console.log('Skipping round start - status is', prev.status)
        isTransitioningRef.current = false
        return prev
      }

      // Check if game should end (no lives left)
      if (prev.livesRemaining <= 0) {
        setTimeout(() => {
          isTransitioningRef.current = false
          finishGame()
        }, 100)
        return prev
      }

      // Move to next round
      const newRoundNumber = prev.currentRound + 1
      const newCueLifespan = getCueLifespan(gameConfig, newRoundNumber)
      const willBeFake = shouldShowFakeCue(gameConfig, prev.difficulty)
      
      console.log(`📈 Starting round ${newRoundNumber}, cue lifespan: ${newCueLifespan}ms, will be ${willBeFake ? 'RED' : 'GREEN'}`)
      
      const newState = {
        ...prev,
        status: 'waiting' as const,
        currentRound: newRoundNumber,
        isFakeCue: false, // Will be set when cue appears
        cueStartTime: null,
        cueLifespan: newCueLifespan,
      }
      
      // Schedule cue appearance after random delay
      const delay = getRandomDelay(gameConfig, newState.difficulty)
      console.log(`⏱️ Cue will appear in ${delay}ms`)
      
      timeoutRef.current = setTimeout(() => {
        console.log(`⏰ Showing ${willBeFake ? 'RED (fake)' : 'GREEN (real)'} cue for round ${newRoundNumber}`)
        
        setGameState(current => {
          if (current.status !== 'waiting') {
            console.log(`❌ Status changed to ${current.status}, not showing cue`)
            return current
          }
          
          // Set cue timeout for auto-disappear
          cueTimeoutRef.current = setTimeout(() => {
            console.log(`🔔 Cue timeout fired for ${willBeFake ? 'RED' : 'GREEN'} circle!`)
            
            setGameState(curr => {
              if (curr.status !== 'cue') {
                console.log(`⚠️ Cue timeout fired but status is ${curr.status}, ignoring`)
                return curr
              }
              
              if (willBeFake) {
                // Red circle avoided - good!
                console.log(`✅ RED CIRCLE AVOIDED - round ${curr.currentRound}`)
                const newStreak = curr.currentStreak + 1
                const baseScore = 200
                const bonusScore = calculateStreakBonus(baseScore, newStreak, gameConfig)
                
                // Schedule next round
                scheduleNextRound()
                
                return {
                  ...curr,
                  status: 'idle' as const,
                  fakesAvoided: curr.fakesAvoided + 1,
                  score: curr.score + bonusScore,
                  currentStreak: newStreak,
                  maxStreak: Math.max(curr.maxStreak, newStreak),
                  streakMultiplier: newStreak >= gameConfig.streakThreshold ? gameConfig.streakMultiplier : 1,
                }
              } else {
                // Green circle missed - bad!
                console.log(`❌ MISSED GREEN CIRCLE - round ${curr.currentRound}`)
                soundManager.play('error')
                
                const newLives = curr.livesRemaining - 1
                
                if (newLives > 0) {
                  scheduleNextRound()
                } else {
                  setTimeout(() => finishGame(), 1000)
                }
                
                return {
                  ...curr,
                  status: newLives > 0 ? 'idle' as const : 'finished' as const,
                  missedCues: curr.missedCues + 1,
                  livesRemaining: newLives,
                  currentStreak: 0,
                  streakMultiplier: 1,
                }
              }
            })
          }, newCueLifespan)
          
          return {
            ...current,
            status: 'cue',
            cueStartTime: Date.now(),
            isFakeCue: willBeFake,
          }
        })
      }, delay)
      
      // Clear transition flag after setup
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 100)
      
      return newState
    })
  }, [gameConfig, finishGame, clearAllTimeouts, soundManager, scheduleNextRound])

  const startGame = useCallback(() => {
    clearAllTimeouts()
    setGameState({
      ...INITIAL_STATE,
      status: 'ready',
      livesRemaining: gameConfig.maxLives,
    })
    setGameResults(null)
    
    // Music is now started from GameCanvas after initialization
    console.log('🎮 Game starting - music should be initialized from GameCanvas')
    
    // Start first round after brief delay
    scheduleNextRound(2000)
  }, [gameConfig.maxLives, startRound, clearAllTimeouts])

  const handleTap = useCallback((isMissedClick: boolean = false) => {
    const currentState = gameState
    
    // Ignore taps if game is finished
    if (currentState.status === 'finished') {
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
      console.log(`❌ Tapped too early in round ${currentState.currentRound}`)
      clearAllTimeouts()
      
      handleMistake()
      
      setGameState(prev => ({
        ...prev,
        status: 'idle',
        incorrectHits: prev.incorrectHits + 1,
      }))
      
      // Continue to next round if lives remaining
      if (currentState.livesRemaining > 1) {
        scheduleNextRound()
      }
      return
    }

    if (currentState.status === 'cue') {
      // If it's a missed click on a real cue, just count it but don't stop the round
      if (isMissedClick && !currentState.isFakeCue) {
        return // Let the cue continue to display
      }
      
      // Clear all timeouts when interacting with a cue
      clearAllTimeouts()
      
      if (currentState.isFakeCue) {
        // Tapped on fake cue - this is bad!
        console.log(`❌ Tapped red circle in round ${currentState.currentRound}`)
        
        handleMistake()
        
        setGameState(prev => ({
          ...prev,
          status: 'idle',
          incorrectHits: prev.incorrectHits + 1,
        }))
        
        // Continue to next round if lives remaining
        if (currentState.livesRemaining > 1) {
          scheduleNextRound()
        }
      } else {
        // Successful tap on real cue - this is good!
        const reactionTime = Date.now() - (currentState.cueStartTime || Date.now())
        console.log(`⚡ Reaction time: ${reactionTime}ms for round ${currentState.currentRound}`)
        
        // Play appropriate success sound
        if (reactionTime < 400) {
          soundManager.play('perfect') // Very fast reaction
        } else {
          soundManager.play('success') // Normal success
        }
        
        // Handle correct action
        handleCorrectAction(true)
        
        // Calculate base score (better score for faster reaction)
        const baseScore = Math.max(0, 1000 - reactionTime)
        const bonusScore = calculateStreakBonus(baseScore, currentState.currentStreak + 1, gameConfig)
        
        setGameState(prev => ({
          ...prev,
          status: 'idle',
          reactionTimes: [...prev.reactionTimes, reactionTime],
          successfulHits: prev.successfulHits + 1,
          difficulty: Math.min(10, prev.difficulty + 0.1),
          score: prev.score + bonusScore,
        }))
        
        console.log(`✅ Round ${currentState.currentRound} complete!`)
        
        // Schedule next round
        scheduleNextRound()
      }
    }
  }, [gameState, gameConfig, clearAllTimeouts, handleCorrectAction, handleMistake, scheduleNextRound, soundManager])

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


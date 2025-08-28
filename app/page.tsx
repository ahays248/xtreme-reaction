'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Target from '@/components/Target'
import MatrixRain from '@/components/MatrixRain'
import VolumeControl from '@/components/VolumeControl'
import PerformanceCard from '@/components/PerformanceCard'
import AuthButton from '@/components/AuthButton'
import SupabaseCheck from '@/components/SupabaseCheck'
import Footer from '@/components/Footer'
import { useClickHandler } from '@/hooks/useClickHandler'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useSound } from '@/hooks/useSound'
import { useAuth } from '@/hooks/useAuth'
import { calculateReactionTime, calculateAverage, formatTime, getLastNTimes } from '@/lib/timing'
import { getDifficultyConfig, getTargetSizeClass } from '@/lib/difficulty'
import { calculateFinalScore, formatScore, getHighScore, setHighScore, isNewHighScore } from '@/lib/scoring'
import { calculateAccuracy, calculateStreakBonus, getStreakMultiplier } from '@/lib/statistics'
import { generateRandomPosition, isClickInPlayArea, getPlayAreaBounds, type TargetPosition } from '@/lib/targetPosition'
import { saveGameSession, type GameResults } from '@/lib/supabase/gameService'

const ROUND_DELAY = 1500 // Delay between rounds

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const [lastMissed, setLastMissed] = useState(false)
  const [isTrapTarget, setIsTrapTarget] = useState(false)
  const [showMissFeedback, setShowMissFeedback] = useState(false)
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({ x: 50, y: 50 })
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const targetShowTime = useRef<number>(0)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const roundDelayId = useRef<NodeJS.Timeout | null>(null)
  const lastTapTime = useRef<number>(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const processingMiss = useRef<boolean>(false)
  
  const { gameState, startGame, nextRound, recordHit, recordMiss, recordTrapHit, resetGame } = useGameLoop()
  const { 
    playSound, 
    playMusic, 
    switchMusic, 
    stopMusic, 
    volume, 
    setVolume, 
    musicVolume,
    setMusicVolume,
    muted, 
    toggleMute,
    musicMuted,
    toggleMusicMute,
    initializeAudio, 
    initialized 
  } = useSound()
  
  const { user, isPracticeMode } = useAuth()

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

  // Handle background music based on game state
  useEffect(() => {
    // Only play music if audio has been initialized
    if (!initialized || !soundEnabled) return
    
    if (gameState.status === 'idle') {
      switchMusic('menu')  // Use switchMusic consistently
    } else if (gameState.status === 'playing') {
      switchMusic('gameplay')
    } else if (gameState.status === 'gameOver') {
      switchMusic('results')
    }
  }, [gameState.status, switchMusic, initialized, soundEnabled])

  // Save score when game ends (only for authenticated users)
  useEffect(() => {
    const saveScore = async () => {
      if (gameState.status === 'gameOver' && !isPracticeMode && user) {
        setSaveStatus('saving')
        
        // Calculate game results
        const avgReactionTime = gameState.reactionTimes.length > 0 
          ? calculateAverage(gameState.reactionTimes) 
          : 0
        const accuracy = calculateAccuracy(gameState.hits, gameState.misses)
        
        const gameResults: GameResults = {
          score: gameState.score,
          avgReactionTime,
          successfulHits: gameState.hits,
          incorrectHits: gameState.trapHit ? 1 : 0,
          missedCues: gameState.misses,
          accuracy,
          totalClicks: gameState.hits + gameState.misses + (gameState.trapHit ? 1 : 0),
          maxStreak: gameState.bestStreak,
          roundsCompleted: gameState.currentRound - 1,
          gameDuration: 30000, // Estimate for 10 rounds
          targetsShown: gameState.currentRound,
          trapsAvoided: 0, // Will implement tracking later
          trapHit: gameState.trapHit,
          difficultyLevel: gameState.difficultyLevel,
        }
        
        const { error } = await saveGameSession(user.id, gameResults)
        
        if (error) {
          console.error('Failed to save game session:', error)
          setSaveStatus('error')
        } else {
          setSaveStatus('saved')
        }
      }
    }
    
    if (gameState.status === 'gameOver') {
      saveScore()
    }
  }, [gameState.status, gameState, user, isPracticeMode])

  const showNextTarget = () => {
    // Reset processing flag for new round
    processingMiss.current = false
    
    // 25% chance of trap target (increases slightly with difficulty)
    const trapChance = 0.20 + (gameState.currentRound / gameState.maxRounds) * 0.10 // 20-30%
    const isCurrentTrap = Math.random() < trapChance
    
    // Generate random position for this target
    const newPosition = generateRandomPosition()
    setTargetPosition(newPosition)
    
    setIsTrapTarget(isCurrentTrap)
    setShowTarget(true)
    setLastMissed(false)
    targetShowTime.current = Date.now()
    
    // Get difficulty settings for current round
    const difficulty = getDifficultyConfig(gameState.currentRound, gameState.maxRounds)
    
    // Set timeout for auto-hide with progressive difficulty
    timeoutId.current = setTimeout(() => {
      setShowTarget(false)
      targetShowTime.current = 0  // Clear this immediately to prevent click handler from firing
      
      if (isCurrentTrap) {
        // Successfully avoided trap - continue game
        setLastReaction(null)
        nextRound()
        console.log('Trap avoided - good job!')
      } else {
        // Missed a real target - but check if we're not already processing a miss
        if (!processingMiss.current) {
          processingMiss.current = true
          recordMiss()
          if (soundEnabled) playSound('miss')
          setLastMissed(true)
          setShowMissFeedback(true)
          setLastReaction(null)
          // Clear miss feedback and processing flag after 500ms
          setTimeout(() => {
            setShowMissFeedback(false)
            processingMiss.current = false
          }, 500)
          nextRound()
          console.log('Target missed - too slow!')
        }
      }
    }, difficulty.timeout)
  }

  const handleTargetClick = useClickHandler((e: React.PointerEvent) => {
    e.stopPropagation() // Prevent game area click handler
    e.preventDefault() // Prevent default behavior
    
    // Prevent double-tap registration (100ms cooldown)
    const now = Date.now()
    if (now - lastTapTime.current < 100) {
      console.log('Double-tap prevented on target')
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
        if (soundEnabled) playSound('trap')
        console.log('TRAP HIT! Game Over!')
      } else {
        // Hit a normal target
        const reactionTime = calculateReactionTime(targetShowTime.current, Date.now())
        recordHit(reactionTime)
        if (soundEnabled) playSound('hit')
        setLastReaction(reactionTime)
        setLastMissed(false)
        setShowTarget(false)
        targetShowTime.current = 0
        nextRound()
        console.log(`Reaction time: ${reactionTime}ms`)
      }
    }
  })
  
  // Handle clicks on the game area (for miss detection)
  // Don't use useClickHandler wrapper here to avoid double processing
  const handleGameAreaClick = (e: React.PointerEvent) => {
    // Only handle primary pointer (main mouse button or first touch)
    if (!e.isPrimary) return
    
    // Prevent double-tap registration (100ms cooldown)
    const now = Date.now()
    if (now - lastTapTime.current < 100) {
      console.log('Double-tap prevented on game area')
      return
    }
    
    // Only count as miss if game is playing and target is visible
    if (gameState.status === 'playing' && showTarget && targetShowTime.current > 0) {
      // Prevent double registration with multiple checks
      if (showMissFeedback || processingMiss.current) return
      
      // Check if click is in play area but not on target
      const clientX = e.clientX
      const clientY = e.clientY
      
      if (isClickInPlayArea(clientX, clientY)) {
        // Set processing flag immediately
        processingMiss.current = true
        // Update last tap time to prevent double registration
        lastTapTime.current = now
        
        // This is a miss - clicked in play area but not on target
        recordMiss()
        if (soundEnabled) playSound('miss')
        setLastMissed(true)
        setShowMissFeedback(true)
        
        // Clear feedback and processing flag after delay
        setTimeout(() => {
          setShowMissFeedback(false)
          processingMiss.current = false
        }, 500)
        
        console.log('Missed target - clicked wrong area')
      }
    }
  }

  const handleEnableSound = async () => {
    // Initialize audio on user interaction
    await initializeAudio()
    setSoundEnabled(true)
    // Menu music will start playing via the useEffect
  }

  const handleStartGame = async () => {
    // Reset save status for new game
    setSaveStatus('idle')
    
    // Only initialize audio if user explicitly enabled it
    // Don't auto-enable sound when starting game
    if (!soundEnabled && initialized) {
      // Audio is initialized but not enabled - keep it that way
    } else if (!initialized && !soundEnabled) {
      // Audio not initialized and not enabled - don't initialize
    }
    
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
    <main className="min-h-screen bg-black text-neon-green flex flex-col items-center p-2 sm:p-4 relative">
      <MatrixRain />
      
      {/* Scanline effect */}
      <div className="scanline" />
      
      {/* Mobile Header Bar - Only on menu screen */}
      {gameState.status === 'idle' && (
        <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-green-500/30 z-30 sm:hidden">
          <div className="flex items-center justify-between px-2 py-2 min-h-[48px]">
            {/* Left: Auth Button */}
            <div className="flex-shrink-0">
              <AuthButton />
            </div>
            
            {/* Right: Volume Control for mobile */}
            <div className="flex-shrink-0">
              <VolumeControl
                volume={volume}
                muted={muted}
                musicVolume={musicVolume}
                musicMuted={musicMuted}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
                onMusicVolumeChange={setMusicVolume}
                onToggleMusicMute={toggleMusicMute}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Header with cyberpunk styling - Only show on menu and results screens */}
      {gameState.status !== 'playing' && (
        <motion.div 
          className={`text-center mt-2 sm:mt-4 md:mt-8 z-10 flex-shrink-0 ${gameState.status === 'idle' ? 'pt-14 sm:pt-0' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-orbitron font-black mb-1 sm:mb-2 md:mb-4 text-glow-soft animate-flicker">
            XTREME REACTION
          </h1>
          <p className="text-sm sm:text-lg md:text-xl mb-0.5 sm:mb-1 md:mb-2 font-mono text-neon-cyan">v1.0 - Phase 14 Complete</p>
          <p className="text-xs md:text-sm opacity-70 font-rajdhani hidden sm:block">
            Test your reflexes. Compete with the world. Share on X.
          </p>
        </motion.div>
      )}

      <div 
        ref={gameAreaRef}
        className={`flex flex-col items-center gap-2 sm:gap-4 md:gap-6 flex-grow justify-center transition-all duration-200 z-10 w-full max-w-2xl relative min-h-[300px] ${
          showMissFeedback ? 'border-4 border-neon-red animate-pulse shadow-neon-red' : ''
        }`}
        onPointerDown={handleGameAreaClick}
      >
        {/* Game status display */}
        {gameState.status === 'idle' && (
          <motion.div 
            className="text-center space-y-1 sm:space-y-2 md:space-y-4 px-2 sm:px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enable Sound Button - shows when audio not enabled */}
            {!soundEnabled && (
              <motion.button
                onClick={handleEnableSound}
                className="mb-4 px-6 sm:px-8 py-3 sm:py-4 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-base sm:text-lg rounded-lg hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green transition-all duration-200 shadow-neon-green hover:shadow-neon-intense animate-pulse"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  opacity: { duration: 0.5 }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                🔊 ENABLE SOUND
              </motion.button>
            )}
            
            <p className="text-lg sm:text-xl md:text-2xl font-rajdhani font-bold text-glow">Ready to test your reflexes?</p>
            <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
              <p className="text-xs sm:text-sm opacity-70 font-mono">Hit 10 GREEN targets fast!</p>
              <p className="text-xs sm:text-sm text-neon-red font-mono">⚠️ Avoid RED targets! ⚠️</p>
            </div>
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
            {/* Minimal game info - just round counter and score */}
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-8 items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-lg md:text-xl font-orbitron font-bold text-neon-cyan">
                Round {gameState.currentRound}/{gameState.maxRounds}
              </div>
              <div className="text-lg md:text-xl font-mono text-neon-yellow font-bold">
                {formatScore(gameState.score)}
              </div>
            </motion.div>

            {/* Streak display - floating */}
            <AnimatePresence>
              {gameState.currentStreak >= 3 && (
                <motion.div 
                  className="fixed top-16 left-1/2 transform -translate-x-1/2 z-20 text-lg font-mono"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <span className="text-orange-400 text-glow font-bold">{gameState.currentStreak} {getStreakMultiplier(gameState.currentStreak)}</span>
                </motion.div>
              )}
            </AnimatePresence>
              
            {/* Feedback messages - floating */}
            <AnimatePresence mode="wait">
              {lastMissed ? (
                <motion.div 
                  key="missed"
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 text-2xl font-mono text-neon-red text-glow-red pointer-events-none"
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  MISS!
                </motion.div>
              ) : lastReaction !== null && (
                <motion.div 
                  key="reaction"
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 text-2xl font-mono pointer-events-none"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-neon-green font-bold">{formatTime(lastReaction)}</span>
                </motion.div>
              )}
            </AnimatePresence>
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
          const highScore = getHighScore()
          const isNewHigh = isNewHighScore(finalScore)
          
          // Save high score if new
          if (isNewHigh) {
            setHighScore(finalScore)
          }
          
          return (
            <PerformanceCard
              finalScore={finalScore}
              accuracy={accuracy}
              avgReactionTime={avgReactionTime}
              hits={gameState.hits}
              misses={gameState.misses}
              bestStreak={gameState.bestStreak}
              isPracticeMode={isPracticeMode}
              difficultyLevel={gameState.difficultyLevel || 0}
              trapHit={gameState.trapHit || false}
              isNewHighScore={isNewHigh}
              previousHighScore={highScore}
              reactionTimes={gameState.reactionTimes}
              saveStatus={saveStatus}
            />
          )
        })()}

        {/* Removed play area visualization - no longer needed */}
        
        <Target 
          isVisible={showTarget && gameState.status === 'playing'} 
          onTargetClick={handleTargetClick}
          size={currentDifficulty.targetSize}
          variant={isTrapTarget ? 'trap' : 'normal'}
          position={targetPosition}
        />
      </div>

      {/* Game controls - moved to bottom */}
      <motion.div 
        className="flex gap-2 sm:gap-4 pb-safe mb-2 sm:mb-4 md:mb-8 z-10 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
          {gameState.status === 'idle' && (
            <motion.button
              onClick={handleStartGame}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-base sm:text-lg md:text-xl rounded-lg hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green transition-all duration-200 shadow-neon-green hover:shadow-neon-intense"
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
                className="px-4 md:px-6 py-2 md:py-3 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-sm md:text-base rounded-lg hover:bg-neon-green/20 hover:text-neon-green hover:border-neon-green transition-all duration-200 shadow-neon-green hover:shadow-neon-intense"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="px-4 md:px-6 py-2 md:py-3 bg-black border-2 border-gray-500 text-white font-orbitron font-bold text-sm md:text-base rounded-lg hover:border-gray-300 hover:text-gray-100 transition-all duration-200"
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

      {/* Desktop Auth and Volume Controls - only show on menu, positioned at top right */}
      {gameState.status === 'idle' && (
        <div className="hidden sm:flex fixed top-4 right-4 z-20 gap-4 items-center">
          <AuthButton />
          <VolumeControl
            volume={volume}
            muted={muted}
            musicVolume={musicVolume}
            musicMuted={musicMuted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onMusicVolumeChange={setMusicVolume}
            onToggleMusicMute={toggleMusicMute}
          />
        </div>
      )}

      {/* Footer with legal links - only show on menu and game over screens */}
      {(gameState.status === 'idle' || gameState.status === 'gameOver') && <Footer />}
    </main>
  )
}
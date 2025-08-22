'use client'

import { useGame } from '@/hooks/useGame'
import { useSound } from '@/hooks/useSound'
import { getSoundManager } from '@/lib/game/sounds'
import { getMusicManager } from '@/lib/game/music'
import { CueDisplay } from './CueDisplay'
import { ScoreBoard } from './ScoreBoard'
import { Punishment } from './Punishment'
import { motion } from 'framer-motion'

export function GameCanvas() {
  const { gameState, gameResults, startGame, handleTap, resetGame } = useGame()
  const { soundEnabled, toggleSound } = useSound()
  const musicManager = getMusicManager()

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden select-none">
      {/* Audio controls - always visible */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Music toggle */}
        <button
          onClick={() => {
            musicManager.toggle()
            if (musicManager.isEnabled() && gameState.status !== 'idle' && gameState.status !== 'finished') {
              musicManager.resume()
            } else {
              musicManager.pause()
            }
          }}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Toggle music"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </button>
        
        {/* Sound effects toggle */}
        <button
          onClick={toggleSound}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          {soundEnabled ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
      {/* Punishment overlay */}
      {gameState.status === 'punishment' && (
        <Punishment consecutiveErrors={gameState.consecutiveErrors} />
      )}

      {/* Main game area */}
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      >
        {/* Idle state - Start screen */}
        {gameState.status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 px-4 max-w-lg mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Xtreme Reaction
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Tap the green circles as fast as you can!
            </p>
            <p className="text-base md:text-lg text-gray-400">
              Avoid the red circles - they're traps!
            </p>
            <div className="pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Initialize audio context on user interaction
                  getSoundManager().initOnUserInteraction()
                  startGame()
                }}
                className="px-8 py-4 bg-green-500 text-white text-lg md:text-xl font-bold rounded-lg hover:bg-green-600 transition-colors touch-manipulation"
                style={{ minHeight: '60px', minWidth: '200px' }}
              >
                Start Game
              </button>
            </div>
          </motion.div>
        )}

        {/* Ready state */}
        {gameState.status === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center px-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Get Ready!</h2>
            <p className="text-lg md:text-xl text-gray-300 mt-4">Game starting...</p>
          </motion.div>
        )}

        {/* Waiting or Cue state */}
        {(gameState.status === 'waiting' || gameState.status === 'cue') && (
          <>
            {/* Game HUD - Fixed position */}
            <div className="fixed top-0 left-0 right-0 p-4 bg-gradient-to-b from-gray-900 to-transparent z-10">
              {/* Progress bar */}
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between text-white mb-2 text-sm md:text-base">
                  <span>Round {gameState.currentRound}/{gameState.totalRounds}</span>
                  <span className="font-bold">Score: {gameState.score}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(gameState.currentRound / gameState.totalRounds) * 100}%` }}
                  />
                </div>
                
                {/* Stats */}
                <div className="flex justify-between mt-3 text-white text-xs md:text-sm">
                  <div className="flex gap-3">
                    <span className="text-green-400">✓ {gameState.successfulHits}</span>
                    <span className="text-blue-400">⚡ {gameState.fakesAvoided}</span>
                    <span className="text-red-400">✗ {gameState.incorrectHits + gameState.missedCues}</span>
                  </div>
                  <span className="text-gray-400">Diff: {gameState.difficulty.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Cue display area - Full screen */}
            <div 
              className="absolute inset-0"
              onClick={() => {
                // Handle background clicks
                if (gameState.status === 'waiting') {
                  handleTap() // This will trigger "too early" punishment
                } else if (gameState.status === 'cue' && !gameState.isFakeCue) {
                  // Clicked background instead of green circle - count as missed click
                  handleTap(true) // Pass true to indicate a missed click
                }
              }}
              onTouchStart={(e) => {
                if (gameState.status === 'waiting') {
                  e.preventDefault()
                  handleTap()
                } else if (gameState.status === 'cue' && !gameState.isFakeCue) {
                  e.preventDefault()
                  handleTap(true) // Missed click on touch
                }
              }}
            >
              <CueDisplay 
                isVisible={gameState.status === 'cue'}
                isFake={gameState.isFakeCue}
                onCueClick={() => {
                  // Handle clicks directly on the circle
                  if (gameState.status === 'cue') {
                    handleTap(false) // Pass false to indicate successful circle click
                  }
                }}
              />
            </div>

            {/* Waiting message */}
            {gameState.status === 'waiting' && (
              <div className="text-center text-gray-500 text-xl md:text-2xl z-20 pointer-events-none">
                Wait for the cue...
              </div>
            )}
          </>
        )}

        {/* Finished state */}
        {gameState.status === 'finished' && gameResults && (
          <ScoreBoard 
            results={gameResults}
            onRestart={resetGame}
            onShare={() => {
              // TODO: Implement share functionality
              console.log('Share score')
            }}
          />
        )}
      </div>
    </div>
  )
}
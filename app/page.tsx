'use client'

import { useState, useRef, useEffect } from 'react'
import Target from '@/components/Target'
import { useClickHandler } from '@/hooks/useClickHandler'
import { calculateReactionTime, calculateAverage, formatTime, getLastNTimes } from '@/lib/timing'

const TARGET_TIMEOUT = 2000 // 2 seconds to react

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [missCount, setMissCount] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const [lastMissed, setLastMissed] = useState(false)
  const targetShowTime = useRef<number>(0)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  // Clear timeout when component unmounts or target is hidden
  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const handleShowTarget = () => {
    setShowTarget(true)
    setLastMissed(false)
    targetShowTime.current = Date.now()
    
    // Set timeout for auto-hide
    timeoutId.current = setTimeout(() => {
      setShowTarget(false)
      setMissCount(prev => prev + 1)
      setLastMissed(true)
      setLastReaction(null)
      targetShowTime.current = 0
      console.log('Target missed - too slow!')
    }, TARGET_TIMEOUT)
  }

  const handleTargetClick = useClickHandler(() => {
    if (targetShowTime.current > 0 && timeoutId.current) {
      // Clear the timeout since target was clicked
      clearTimeout(timeoutId.current)
      timeoutId.current = null
      
      const reactionTime = calculateReactionTime(targetShowTime.current, Date.now())
      setClickCount(prev => prev + 1)
      setReactionTimes(prev => [...prev, reactionTime])
      setLastReaction(reactionTime)
      setLastMissed(false)
      setShowTarget(false)
      targetShowTime.current = 0
      console.log(`Reaction time: ${reactionTime}ms`)
    }
  })

  const last5Times = getLastNTimes(reactionTimes, 5)
  const averageTime = calculateAverage(last5Times)

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Xtreme Reaction</h1>
        <p className="text-xl mb-2">Phase 4: Auto-Hide Targets</p>
        <p className="text-sm opacity-70">
          Test your reflexes. Compete with the world. Share on X.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Stats display */}
        <div className="text-center space-y-2">
          <div className="text-xl font-mono space-x-4">
            <span>Hits: <span className="text-green-400">{clickCount}</span></span>
            <span>Misses: <span className="text-red-400">{missCount}</span></span>
          </div>
          
          {/* Feedback message */}
          {lastMissed ? (
            <div className="text-2xl font-mono text-red-500">
              MISSED! Too slow!
            </div>
          ) : lastReaction !== null && (
            <div className="text-2xl font-mono">
              Last: <span className="text-yellow-400">{formatTime(lastReaction)}</span>
            </div>
          )}
          
          {last5Times.length > 0 && (
            <div className="text-lg font-mono">
              Avg (last 5): <span className="text-cyan-400">{formatTime(averageTime)}</span>
            </div>
          )}
        </div>

        {/* Last 5 reaction times */}
        {last5Times.length > 0 && (
          <div className="text-sm font-mono opacity-70">
            Recent: {last5Times.map(time => formatTime(time)).join(' | ')}
          </div>
        )}
        
        {/* Timeout indicator */}
        {showTarget && (
          <div className="text-xs font-mono opacity-50">
            React within {TARGET_TIMEOUT / 1000} seconds!
          </div>
        )}

        <Target isVisible={showTarget} onTargetClick={handleTargetClick} />
        
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (showTarget) {
                // Cancel timeout and hide
                if (timeoutId.current) {
                  clearTimeout(timeoutId.current)
                  timeoutId.current = null
                }
                setShowTarget(false)
                targetShowTime.current = 0
              } else {
                handleShowTarget()
              }
            }}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
          >
            {showTarget ? 'Hide' : 'Show'} Target
          </button>
          
          <button
            onClick={() => {
              // Clear any active timeout
              if (timeoutId.current) {
                clearTimeout(timeoutId.current)
                timeoutId.current = null
              }
              setShowTarget(false)
              setClickCount(0)
              setMissCount(0)
              setReactionTimes([])
              setLastReaction(null)
              setLastMissed(false)
              targetShowTime.current = 0
            }}
            className="px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </main>
  )
}
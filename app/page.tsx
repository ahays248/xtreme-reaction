'use client'

import { useState, useRef } from 'react'
import Target from '@/components/Target'
import { useClickHandler } from '@/hooks/useClickHandler'
import { calculateReactionTime, calculateAverage, formatTime, getLastNTimes } from '@/lib/timing'

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const targetShowTime = useRef<number>(0)

  const handleShowTarget = () => {
    setShowTarget(true)
    targetShowTime.current = Date.now()
  }

  const handleTargetClick = useClickHandler(() => {
    if (targetShowTime.current > 0) {
      const reactionTime = calculateReactionTime(targetShowTime.current, Date.now())
      setClickCount(prev => prev + 1)
      setReactionTimes(prev => [...prev, reactionTime])
      setLastReaction(reactionTime)
      console.log(`Reaction time: ${reactionTime}ms`)
    }
  })

  const last5Times = getLastNTimes(reactionTimes, 5)
  const averageTime = calculateAverage(last5Times)

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Xtreme Reaction</h1>
        <p className="text-xl mb-2">Phase 3: Basic Timing</p>
        <p className="text-sm opacity-70">
          Test your reflexes. Compete with the world. Share on X.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Stats display */}
        <div className="text-center space-y-2">
          <div className="text-xl font-mono">
            Clicks: <span className="text-green-400">{clickCount}</span>
          </div>
          {lastReaction !== null && (
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

        <Target isVisible={showTarget} onTargetClick={handleTargetClick} />
        
        <div className="flex gap-4">
          <button
            onClick={() => showTarget ? setShowTarget(false) : handleShowTarget()}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
          >
            {showTarget ? 'Hide' : 'Show'} Target
          </button>
          
          <button
            onClick={() => {
              setClickCount(0)
              setReactionTimes([])
              setLastReaction(null)
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
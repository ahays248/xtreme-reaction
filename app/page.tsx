'use client'

import { useState } from 'react'
import Target from '@/components/Target'
import { useClickHandler } from '@/hooks/useClickHandler'

export default function Home() {
  const [showTarget, setShowTarget] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleTargetClick = useClickHandler(() => {
    setClickCount(prev => prev + 1)
  })

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Xtreme Reaction</h1>
        <p className="text-xl mb-2">Phase 2: Click Detection</p>
        <p className="text-sm opacity-70">
          Test your reflexes. Compete with the world. Share on X.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Click counter display */}
        <div className="text-2xl font-mono">
          Clicks: <span className="text-green-400">{clickCount}</span>
        </div>

        <Target isVisible={showTarget} onTargetClick={handleTargetClick} />
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowTarget(!showTarget)}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
          >
            {showTarget ? 'Hide' : 'Show'} Target
          </button>
          
          <button
            onClick={() => setClickCount(0)}
            className="px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
          >
            Reset Count
          </button>
        </div>
      </div>
    </main>
  )
}
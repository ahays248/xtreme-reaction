'use client'

import { useState, useEffect } from 'react'

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void
}

export default function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [error, setError] = useState(false)

  // Generate new math problem
  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    setNum1(a)
    setNum2(b)
    setUserAnswer('')
    setError(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const handleSubmit = () => {
    const correctAnswer = num1 + num2
    const isCorrect = parseInt(userAnswer) === correctAnswer
    
    if (isCorrect) {
      onVerify(true)
      setError(false)
    } else {
      setError(true)
      onVerify(false)
      // Generate new problem after wrong answer
      setTimeout(generateProblem, 1500)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">Verify you're human</p>
        <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
          <p className="text-2xl font-mono text-neon-cyan">
            {num1} + {num2} = ?
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 px-3 py-2 bg-black border-2 rounded-lg font-mono transition-colors ${
            error 
              ? 'border-red-500 text-red-400' 
              : 'border-green-500/50 text-neon-green focus:border-green-500'
          }`}
          placeholder="Answer"
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          disabled={!userAnswer}
          className="px-4 py-2 bg-black border-2 border-green-500 text-neon-green font-bold rounded-lg hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Verify
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-400 text-center animate-pulse">
          Incorrect. Try again!
        </p>
      )}
    </div>
  )
}
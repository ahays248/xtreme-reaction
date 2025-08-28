'use client'

import { formatScore, getScoreGrade } from '@/lib/scoring'
import { formatTime } from '@/lib/timing'

interface ScoreCardProps {
  finalScore: number
  accuracy: number
  avgReactionTime: number
  hits: number
  bestStreak: number
  trapHit: boolean
  userRank?: number | null
  leaderboardType?: 'daily' | 'all-time'
  username?: string
  xHandle?: string | null
  scorePercentile?: number | null
}

export default function ScoreCard({
  finalScore,
  accuracy,
  avgReactionTime,
  hits,
  bestStreak,
  trapHit,
  userRank,
  leaderboardType = 'daily',
  username,
  xHandle,
  scorePercentile
}: ScoreCardProps) {
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  // Grade colors
  const gradeColors: Record<string, string> = {
    'S': 'text-purple-400',
    'A': 'text-green-400',
    'B': 'text-blue-400',
    'C': 'text-yellow-400',
    'D': 'text-orange-400',
    'F': 'text-red-400'
  }
  
  const displayName = xHandle ? `@${xHandle}` : username || 'Anonymous'
  
  return (
    <div 
      id="score-card"
      className="w-[1200px] h-[630px] bg-black flex flex-col items-center justify-center p-12 relative"
      style={{
        fontFamily: 'Orbitron, monospace',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)'
      }}
    >
      {/* Matrix-style background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0, 255, 0, 0.1) 35px, rgba(0, 255, 0, 0.1) 70px),
                           repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0, 255, 0, 0.1) 35px, rgba(0, 255, 0, 0.1) 70px)`
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black text-neon-green" style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}>
            XTREME REACTION
          </h1>
          <p className="text-xl text-gray-400">Ultimate Reflex Challenge</p>
        </div>
        
        {/* Score and Grade */}
        <div className="flex items-center space-x-12">
          <div className="text-center">
            <p className="text-lg text-gray-400 mb-2">FINAL SCORE</p>
            <p className="text-7xl font-black text-neon-yellow" style={{ textShadow: '0 0 30px rgba(255, 255, 0, 0.5)' }}>
              {formatScore(finalScore)}
            </p>
          </div>
          
          <div className="text-center">
            {scorePercentile !== null && scorePercentile !== undefined ? (
              <>
                <p className="text-lg text-gray-400 mb-2">TODAY'S RANK</p>
                <div className="text-5xl font-black text-cyan-400" style={{ textShadow: '0 0 25px currentColor' }}>
                  TOP {100 - scorePercentile}%
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-400 mb-2">GRADE</p>
                <div className={`text-6xl font-black ${gradeColors[grade]}`} style={{ textShadow: '0 0 25px currentColor' }}>
                  {grade}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">ACCURACY</p>
            <p className="text-3xl font-bold text-green-400">{accuracy}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">AVG SPEED</p>
            <p className="text-3xl font-bold text-yellow-400">{formatTime(avgReactionTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">BEST STREAK</p>
            <p className="text-3xl font-bold text-orange-400">{bestStreak}</p>
          </div>
        </div>
        
        {/* Leaderboard Rank */}
        {userRank && (
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {leaderboardType === 'daily' ? 'Daily' : 'All-Time'} Rank: #{userRank}
            </p>
          </div>
        )}
        
        {/* Player Name */}
        {displayName !== 'Anonymous' && (
          <div className="text-center">
            <p className="text-xl text-gray-300">{displayName}</p>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-lg text-gray-400">Think you can beat this score?</p>
          <p className="text-xl font-bold text-neon-green">
            Play at XtremeReaction.lol
          </p>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-neon-green opacity-50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-neon-green opacity-50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-neon-green opacity-50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-neon-green opacity-50" />
    </div>
  )
}
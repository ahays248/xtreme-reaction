'use client'

import { formatScore, getScoreGrade } from '@/lib/scoring'
import { formatTime } from '@/lib/timing'

// Use inline styles with hex colors to avoid html2canvas issues with modern CSS color functions
const colors = {
  neonGreen: '#00ff00',
  neonYellow: '#ffff00',
  neonCyan: '#00ffff',
  gray400: '#9ca3af',
  green400: '#4ade80',
  yellow400: '#facc15',
  orange400: '#fb923c',
  cyan400: '#22d3ee',
  purple400: '#c084fc',
  blue400: '#60a5fa',
  red400: '#f87171',
  gray300: '#d1d5db',
  gray500: '#6b7280',
  black: '#000000',
  white: '#ffffff'
}

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
    'S': colors.purple400,
    'A': colors.green400,
    'B': colors.blue400,
    'C': colors.yellow400,
    'D': colors.orange400,
    'F': colors.red400
  }
  
  const displayName = xHandle ? `@${xHandle}` : username || 'Anonymous'
  
  return (
    <div 
      id="score-card"
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: colors.black,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        fontFamily: 'Orbitron, monospace',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
        color: colors.white,
        lineHeight: 1.2
      }}
    >
      {/* Matrix-style background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0, 255, 0, 0.1) 35px, rgba(0, 255, 0, 0.1) 70px),
                         repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0, 255, 0, 0.1) 35px, rgba(0, 255, 0, 0.1) 70px)`
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: 900,
            color: colors.neonGreen,
            textShadow: `0 0 20px rgba(0, 255, 0, 0.5)`,
            lineHeight: 1,
            marginBottom: '20px',
            letterSpacing: '2px'
          }}>
            XTREME REACTION
          </h1>
          <p style={{ fontSize: '20px', color: colors.gray400, lineHeight: 1.2 }}>Ultimate Reflex Challenge</p>
        </div>
        
        {/* Score and Grade/Percentile */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: colors.gray400, marginBottom: '4px', lineHeight: 1 }}>FINAL SCORE</p>
            <p style={{
              fontSize: '56px',
              fontWeight: 900,
              color: colors.neonYellow,
              textShadow: `0 0 30px rgba(255, 255, 0, 0.5)`,
              lineHeight: 1,
              marginTop: '8px'
            }}>
              {formatScore(finalScore)}
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            {scorePercentile !== null && scorePercentile !== undefined ? (
              <>
                <p style={{ fontSize: '16px', color: colors.gray400, marginBottom: '4px', lineHeight: 1 }}>TODAY'S RANK</p>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: colors.cyan400,
                  textShadow: `0 0 25px ${colors.cyan400}`,
                  lineHeight: 1,
                  marginTop: '8px'
                }}>
                  TOP {100 - scorePercentile}%
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '16px', color: colors.gray400, marginBottom: '4px', lineHeight: 1 }}>GRADE</p>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  color: gradeColors[grade],
                  textShadow: `0 0 25px ${gradeColors[grade]}`,
                  lineHeight: 1,
                  marginTop: '8px'
                }}>
                  {grade}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.gray400, fontSize: '14px', marginBottom: '4px', lineHeight: 1 }}>ACCURACY</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: colors.green400, lineHeight: 1, marginTop: '4px' }}>{accuracy}%</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.gray400, fontSize: '14px', marginBottom: '4px', lineHeight: 1 }}>AVG SPEED</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: colors.yellow400, lineHeight: 1, marginTop: '4px' }}>{formatTime(avgReactionTime)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.gray400, fontSize: '14px', marginBottom: '4px', lineHeight: 1 }}>BEST STREAK</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: colors.orange400, lineHeight: 1, marginTop: '4px' }}>{bestStreak}</p>
          </div>
        </div>
        
        {/* Leaderboard Rank */}
        {userRank && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: colors.cyan400, lineHeight: 1 }}>
              {leaderboardType === 'daily' ? 'Daily' : 'All-Time'} Rank: #{userRank}
            </p>
          </div>
        )}
        
        {/* Player Name */}
        {displayName !== 'Anonymous' && (
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '20px', color: colors.gray300, lineHeight: 1 }}>{displayName}</p>
          </div>
        )}
        
        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '8px' }}>
          <p style={{ fontSize: '18px', color: colors.gray400, marginBottom: '8px', lineHeight: 1.4 }}>Think you can beat this score?</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: colors.neonGreen, lineHeight: 1.4 }}>
            Play at XtremeReaction.lol
          </p>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: '32px', left: '32px', width: '64px', height: '64px', borderLeft: `2px solid ${colors.neonGreen}`, borderTop: `2px solid ${colors.neonGreen}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '32px', right: '32px', width: '64px', height: '64px', borderRight: `2px solid ${colors.neonGreen}`, borderTop: `2px solid ${colors.neonGreen}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '32px', left: '32px', width: '64px', height: '64px', borderLeft: `2px solid ${colors.neonGreen}`, borderBottom: `2px solid ${colors.neonGreen}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '32px', right: '32px', width: '64px', height: '64px', borderRight: `2px solid ${colors.neonGreen}`, borderBottom: `2px solid ${colors.neonGreen}`, opacity: 0.5 }} />
    </div>
  )
}
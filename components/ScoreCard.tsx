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
  totalPlayersToday?: number
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
  scorePercentile,
  totalPlayersToday = 0
}: ScoreCardProps) {
  const grade = trapHit ? 'F' : getScoreGrade(avgReactionTime, accuracy)
  
  // Detect if we're rendering for mobile (would be passed from parent ideally)
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
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
        letterSpacing: 'normal'
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
            fontSize: isMobile ? '40px' : '48px',
            fontWeight: 900,
            color: colors.neonGreen,
            textShadow: `0 0 20px rgba(0, 255, 0, 0.5)`,
            lineHeight: isMobile ? '50px' : '48px',
            marginBottom: isMobile ? '28px' : '24px',
            letterSpacing: isMobile ? '4px' : '3px'
          }}>
            XTREME REACTION
          </h1>
          <p style={{ fontSize: isMobile ? '16px' : '18px', color: colors.gray400, lineHeight: isMobile ? '28px' : '24px', marginTop: '0', letterSpacing: isMobile ? '2px' : '1.5px' }}>Ultimate Reflex Challenge</p>
        </div>
        
        {/* Score and Grade/Percentile */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: colors.gray400, marginBottom: isMobile ? '8px' : '4px', lineHeight: isMobile ? '20px' : '16px', letterSpacing: isMobile ? '2.5px' : '1.5px' }}>FINAL SCORE</p>
            <p style={{
              fontSize: isMobile ? '44px' : '52px',
              fontWeight: 900,
              color: colors.neonYellow,
              textShadow: `0 0 30px rgba(255, 255, 0, 0.5)`,
              lineHeight: isMobile ? '50px' : '52px',
              marginTop: isMobile ? '4px' : '8px',
              letterSpacing: isMobile ? '2.5px' : '1.5px'
            }}>
              {formatScore(finalScore)}
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            {userRank && totalPlayersToday > 0 ? (
              <>
                <p style={{ fontSize: isMobile ? '14px' : '16px', color: colors.gray400, marginBottom: isMobile ? '8px' : '4px', lineHeight: isMobile ? '20px' : '16px', letterSpacing: isMobile ? '2.5px' : '1.5px' }}>TODAY'S RANK</p>
                <div style={{
                  fontSize: isMobile ? '38px' : '52px',
                  fontWeight: 900,
                  color: colors.cyan400,
                  textShadow: `0 0 25px ${colors.cyan400}`,
                  lineHeight: isMobile ? '48px' : '58px',
                  marginTop: isMobile ? '4px' : '8px',
                  letterSpacing: isMobile ? '2.5px' : '1.5px'
                }}>
                  {userRank === 1 ? '🏆 #1' : `#${userRank}`}
                </div>
                <p style={{ fontSize: isMobile ? '12px' : '14px', color: colors.gray500, marginTop: '8px', letterSpacing: '1px' }}>
                  of {totalPlayersToday} players
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: isMobile ? '14px' : '16px', color: colors.gray400, marginBottom: isMobile ? '8px' : '4px', lineHeight: isMobile ? '20px' : '16px', letterSpacing: isMobile ? '2.5px' : '1.5px' }}>GRADE</p>
                <div style={{
                  fontSize: isMobile ? '44px' : '52px',
                  fontWeight: 900,
                  color: gradeColors[grade],
                  textShadow: `0 0 25px ${gradeColors[grade]}`,
                  lineHeight: isMobile ? '50px' : '52px',
                  marginTop: isMobile ? '4px' : '8px',
                  letterSpacing: isMobile ? '2.5px' : '1.5px'
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
            <p style={{ color: colors.gray400, fontSize: isMobile ? '12px' : '13px', marginBottom: isMobile ? '8px' : '6px', lineHeight: isMobile ? '18px' : '16px', letterSpacing: isMobile ? '2px' : '1.5px' }}>ACCURACY</p>
            <p style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 'bold', color: colors.green400, lineHeight: isMobile ? '26px' : '28px', marginTop: '0', letterSpacing: isMobile ? '1.5px' : '1px' }}>{accuracy}%</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.gray400, fontSize: isMobile ? '12px' : '13px', marginBottom: isMobile ? '8px' : '6px', lineHeight: isMobile ? '18px' : '16px', letterSpacing: isMobile ? '2px' : '1.5px' }}>AVG SPEED</p>
            <p style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 'bold', color: colors.yellow400, lineHeight: isMobile ? '26px' : '28px', marginTop: '0', letterSpacing: isMobile ? '1.5px' : '1px' }}>{formatTime(avgReactionTime)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: colors.gray400, fontSize: isMobile ? '12px' : '13px', marginBottom: isMobile ? '8px' : '6px', lineHeight: isMobile ? '18px' : '16px', letterSpacing: isMobile ? '2px' : '1.5px' }}>BEST STREAK</p>
            <p style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 'bold', color: colors.orange400, lineHeight: isMobile ? '26px' : '28px', marginTop: '0', letterSpacing: isMobile ? '1.5px' : '1px' }}>{bestStreak}</p>
          </div>
        </div>
        
        {/* Leaderboard Rank */}
        {userRank && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: colors.cyan400, lineHeight: '24px', letterSpacing: '1px' }}>
              {leaderboardType === 'daily' ? 'Daily' : 'All-Time'} Rank: #{userRank}
            </p>
          </div>
        )}
        
        {/* Player Name */}
        {displayName !== 'Anonymous' && (
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '18px', color: colors.gray300, lineHeight: '24px', letterSpacing: '1px' }}>{displayName}</p>
          </div>
        )}
        
        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '8px' }}>
          <p style={{ fontSize: isMobile ? '15px' : '17px', color: colors.gray400, marginBottom: isMobile ? '12px' : '10px', lineHeight: isMobile ? '26px' : '24px', letterSpacing: isMobile ? '1.5px' : '1px' }}>Think you can beat this score?</p>
          <p style={{ fontSize: isMobile ? '17px' : '19px', fontWeight: 'bold', color: colors.neonGreen, lineHeight: isMobile ? '28px' : '26px', letterSpacing: isMobile ? '2px' : '1.5px' }}>
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
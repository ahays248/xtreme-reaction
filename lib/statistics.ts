// Phase 9: Statistics and Accuracy Tracking

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(hits: number, misses: number): number {
  const total = hits + misses
  if (total === 0) return 100 // No attempts yet
  return Math.round((hits / total) * 100)
}

/**
 * Track streak information
 */
export interface StreakInfo {
  current: number
  best: number
}

/**
 * Calculate streak bonus points
 * Bonus starts at 5 consecutive hits
 */
export function calculateStreakBonus(streak: number): number {
  if (streak < 5) return 0
  // 50 points per hit after 5th consecutive
  return (streak - 4) * 50
}

/**
 * Get streak multiplier for display
 */
export function getStreakMultiplier(streak: number): string {
  if (streak < 5) return ''
  if (streak < 10) return '🔥'
  if (streak < 15) return '🔥🔥'
  return '🔥🔥🔥'
}

/**
 * Calculate reaction time trend
 */
export function getReactionTrend(reactionTimes: number[]): 'improving' | 'declining' | 'stable' {
  if (reactionTimes.length < 3) return 'stable'
  
  const recent = reactionTimes.slice(-3)
  const previous = reactionTimes.slice(-6, -3)
  
  if (previous.length === 0) return 'stable'
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length
  
  const difference = recentAvg - previousAvg
  
  if (difference < -50) return 'improving' // Getting faster
  if (difference > 50) return 'declining'  // Getting slower
  return 'stable'
}
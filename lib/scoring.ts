// Phase 8: Scoring System

/**
 * Calculate score for a single hit based on reaction time
 * Formula: Base Score = (1000 - reaction_time_ms)
 * Faster reactions = higher points
 */
export function calculateHitScore(reactionTime: number): number {
  // Cap reaction time at 1000ms for scoring (minimum 0 points)
  const cappedTime = Math.min(reactionTime, 1000)
  // Base score: 1000ms - reaction time (faster = more points)
  const baseScore = Math.max(0, 1000 - cappedTime)
  return Math.round(baseScore)
}

// Accuracy calculation moved to statistics.ts for Phase 9

/**
 * Calculate final score with accuracy, difficulty, and streak multipliers
 * Formula: Final Score = (Sum of Hit Scores + Streak Bonus) * (accuracy / 100) * difficulty_multiplier
 */
export function calculateFinalScore(
  hitScores: number[],
  accuracy: number,
  difficultyReached: number,
  streakBonus: number = 0
): number {
  // Sum all individual hit scores
  const totalHitScore = hitScores.reduce((sum, score) => sum + score, 0)
  
  // Add streak bonus to base score
  const baseScore = totalHitScore + streakBonus
  
  // Apply accuracy multiplier (0.0 to 1.0)
  const accuracyMultiplier = accuracy / 100
  
  // Apply difficulty multiplier (1.0 to 1.5 based on how far they got)
  const difficultyMultiplier = 1 + (difficultyReached / 100) * 0.5
  
  // Calculate final score
  const finalScore = baseScore * accuracyMultiplier * difficultyMultiplier
  
  return Math.round(finalScore)
}

/**
 * Get score grade based on average reaction time and accuracy
 */
export function getScoreGrade(avgReactionTime: number, accuracy: number): string {
  if (avgReactionTime < 250 && accuracy > 90) return 'S'
  if (avgReactionTime < 300 && accuracy > 80) return 'A'
  if (avgReactionTime < 350 && accuracy > 70) return 'B'
  if (avgReactionTime < 400 && accuracy > 60) return 'C'
  return 'D'
}

/**
 * Format score with commas for display
 */
export function formatScore(score: number): string {
  return score.toLocaleString()
}

/**
 * Get/Set high score in localStorage
 */
export function getHighScore(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem('xtremeReactionHighScore')
  return stored ? parseInt(stored, 10) : 0
}

export function setHighScore(score: number): void {
  if (typeof window === 'undefined') return
  const currentHigh = getHighScore()
  if (score > currentHigh) {
    localStorage.setItem('xtremeReactionHighScore', score.toString())
  }
}

/**
 * Check if score is a new high score
 */
export function isNewHighScore(score: number): boolean {
  return score > getHighScore()
}
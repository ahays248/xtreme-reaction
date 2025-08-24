// Phase 6: Progressive Difficulty calculations

// Calculate timeout duration based on round
// Starts at 2000ms, ends at 800ms
export function getTimeoutForRound(round: number, maxRounds: number): number {
  const minTimeout = 800   // Minimum timeout at hardest difficulty
  const maxTimeout = 2000  // Starting timeout at easiest difficulty
  
  // Linear progression from max to min over the rounds
  const progress = (round - 1) / (maxRounds - 1)
  const timeout = maxTimeout - (progress * (maxTimeout - minTimeout))
  
  return Math.round(timeout)
}

// Calculate target size based on round
// Starts at 96px (w-24), ends at 48px (w-12)
export function getTargetSizeForRound(round: number, maxRounds: number): number {
  const minSize = 48   // Minimum size at hardest difficulty (still touch-friendly)
  const maxSize = 96   // Starting size at easiest difficulty
  
  // Linear progression from max to min over the rounds
  const progress = (round - 1) / (maxRounds - 1)
  const size = maxSize - (progress * (maxSize - minSize))
  
  return Math.round(size)
}

// Get complete difficulty configuration for a round
export function getDifficultyConfig(round: number, maxRounds: number) {
  return {
    timeout: getTimeoutForRound(round, maxRounds),
    targetSize: getTargetSizeForRound(round, maxRounds),
    round,
    difficultyPercent: Math.round(((round - 1) / (maxRounds - 1)) * 100)
  }
}

// Get Tailwind class for target size
export function getTargetSizeClass(size: number): string {
  // Map pixel sizes to Tailwind classes
  if (size >= 96) return 'w-24 h-24'  // 96px
  if (size >= 80) return 'w-20 h-20'  // 80px
  if (size >= 64) return 'w-16 h-16'  // 64px
  if (size >= 56) return 'w-14 h-14'  // 56px
  return 'w-12 h-12'                  // 48px minimum
}
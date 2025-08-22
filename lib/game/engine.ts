import { GameState, GameResults, GameConfig } from './types'

export const DEFAULT_CONFIG: GameConfig = {
  totalRounds: 10,
  minDelay: 1000,
  maxDelay: 5000,
  cueTimeout: 3000,  // Increased from 2000ms to 3000ms for more time
  basePunishmentDuration: 1000,
  punishmentMultiplier: 1.5,
  fakeChance: 0.2,
  distractionChance: 0.1,
}

export function calculateScore(state: GameState): number {
  // The score has already been accumulated during gameplay
  // This includes all bonuses for successful hits, avoided fakes, etc.
  // Just return the final accumulated score
  return state.score
}

export function getRandomDelay(config: GameConfig, difficulty: number): number {
  // Reduce max delay as difficulty increases
  const adjustedMax = Math.max(
    config.minDelay + 500,
    config.maxDelay - (difficulty * 200)
  )
  
  return Math.random() * (adjustedMax - config.minDelay) + config.minDelay
}

export function shouldShowFakeCue(config: GameConfig, difficulty: number): boolean {
  // Increase fake chance with difficulty
  const adjustedChance = Math.min(0.5, config.fakeChance + (difficulty * 0.05))
  return Math.random() < adjustedChance
}

export function getPunishmentDuration(config: GameConfig, consecutiveErrors: number): number {
  return config.basePunishmentDuration * Math.pow(config.punishmentMultiplier, consecutiveErrors)
}

export function calculateResults(state: GameState): GameResults {
  // Reaction time only includes successful hits on real cues
  const avgReactionTime = state.reactionTimes.length > 0
    ? Math.round(state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length)
    : 0

  // NEW: True accuracy based on total clicks
  // Good clicks: successful hits on green circles
  // Bad clicks: all other clicks (early, on red, missed green)
  let accuracy = 0
  if (state.totalClicks > 0) {
    // Only successful hits count as accurate clicks
    accuracy = (state.successfulHits / state.totalClicks) * 100
  } else if (state.fakesAvoided > 0) {
    // If no clicks but avoided fakes, that's perfect accuracy
    accuracy = 100
  }

  // Calculate bonus score based on accuracy
  const accuracyBonus = Math.round(accuracy * 10) // 10 points per accuracy percent

  return {
    avgReactionTime,
    successfulHits: state.successfulHits,
    incorrectHits: state.incorrectHits,
    missedCues: state.missedCues,
    fakesAvoided: state.fakesAvoided,
    totalClicks: state.totalClicks,
    difficulty: state.difficulty,
    score: state.score + accuracyBonus, // Add accuracy bonus to final score
    accuracy: Math.round(accuracy),
  }
}
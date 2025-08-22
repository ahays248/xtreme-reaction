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

  // Accuracy includes successful hits and avoided fakes as good, errors as bad
  const goodActions = state.successfulHits + state.fakesAvoided
  const totalActions = goodActions + state.incorrectHits + state.missedCues
  const accuracy = totalActions > 0 ? (goodActions / totalActions) * 100 : 0

  return {
    avgReactionTime,
    successfulHits: state.successfulHits,
    incorrectHits: state.incorrectHits,
    missedCues: state.missedCues,
    fakesAvoided: state.fakesAvoided,
    difficulty: state.difficulty,
    score: calculateScore(state),
    accuracy: Math.round(accuracy),
  }
}
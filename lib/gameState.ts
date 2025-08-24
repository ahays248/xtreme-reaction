export type GameStatus = 'idle' | 'playing' | 'gameOver'

export interface GameState {
  status: GameStatus
  currentRound: number
  maxRounds: number
  hits: number
  misses: number
  reactionTimes: number[]
  difficultyLevel?: number // Track current difficulty percentage
  trapHit?: boolean // Track if game ended due to trap
  score: number // Current score
  hitScores: number[] // Individual scores for each hit
  currentStreak: number // Current consecutive hits
  bestStreak: number // Best streak this game
}

export const initialGameState: GameState = {
  status: 'idle',
  currentRound: 0,
  maxRounds: 10,
  hits: 0,
  misses: 0,
  reactionTimes: [],
  score: 0,
  hitScores: [],
  currentStreak: 0,
  bestStreak: 0
}
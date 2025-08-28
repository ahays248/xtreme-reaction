export type GameStatus = 'idle' | 'playing' | 'gameOver'

export interface GameState {
  status: GameStatus
  currentRound: number // Still track rounds for difficulty progression
  maxRounds: number // Keep for compatibility but won't limit the game
  gameStartTime?: number // Track when game started
  elapsedTime: number // Track elapsed time in seconds
  maxGameTime: number // Maximum game duration in seconds
  hits: number
  misses: number
  reactionTimes: number[]
  difficultyLevel?: number // Track current difficulty percentage
  trapHit?: boolean // Track if game ended due to trap
  score: number // Current score
  hitScores: number[] // Individual scores for each hit
  currentStreak: number // Current consecutive hits
  bestStreak: number // Best streak this game
  trapsShown: number // Track number of red circles shown
  targetsShown: number // Track total targets shown
  targetsSinceLastTrap: number // Track spacing between red circles
}

export const initialGameState: GameState = {
  status: 'idle',
  currentRound: 0,
  maxRounds: 999, // Effectively unlimited
  gameStartTime: undefined,
  elapsedTime: 0,
  maxGameTime: 60, // 60 seconds
  hits: 0,
  misses: 0,
  reactionTimes: [],
  score: 0,
  hitScores: [],
  currentStreak: 0,
  bestStreak: 0,
  trapsShown: 0,
  targetsShown: 0,
  targetsSinceLastTrap: 0
}
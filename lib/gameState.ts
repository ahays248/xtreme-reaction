export type GameStatus = 'idle' | 'playing' | 'gameOver'

export interface GameState {
  status: GameStatus
  currentRound: number
  maxRounds: number
  hits: number
  misses: number
  reactionTimes: number[]
  difficultyLevel?: number // Track current difficulty percentage
}

export const initialGameState: GameState = {
  status: 'idle',
  currentRound: 0,
  maxRounds: 10,
  hits: 0,
  misses: 0,
  reactionTimes: []
}
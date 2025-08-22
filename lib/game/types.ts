export interface GameState {
  status: 'idle' | 'ready' | 'waiting' | 'cue' | 'punishment' | 'finished'
  currentRound: number
  totalRounds: number
  reactionTimes: number[]
  successfulHits: number
  incorrectHits: number
  missedCues: number
  fakesAvoided: number  // Track successfully avoided fake cues
  totalClicks: number  // Total clicks attempted (including misses on circles)
  difficulty: number
  score: number
  cueStartTime: number | null
  isFakeCue: boolean
  punishmentEndTime: number | null
  consecutiveErrors: number
}

export interface GameResults {
  avgReactionTime: number
  successfulHits: number
  incorrectHits: number
  missedCues: number
  fakesAvoided: number
  totalClicks: number
  difficulty: number
  score: number
  accuracy: number
}

export type CueType = 'real' | 'fake' | 'distraction'

export interface GameConfig {
  totalRounds: number
  minDelay: number // milliseconds
  maxDelay: number // milliseconds
  cueTimeout: number // milliseconds
  basePunishmentDuration: number // milliseconds
  punishmentMultiplier: number // for consecutive errors
  fakeChance: number // 0-1
  distractionChance: number // 0-1
}
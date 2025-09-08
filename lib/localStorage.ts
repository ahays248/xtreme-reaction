import type { GameResults } from './supabase/gameService'

const PENDING_GAME_KEY = 'pendingGameResults'
const PENDING_GAME_TIMESTAMP_KEY = 'pendingGameTimestamp'

/**
 * Store game results in localStorage for later saving
 * Only keeps the most recent game
 */
export function storePendingGameResults(results: GameResults): void {
  try {
    localStorage.setItem(PENDING_GAME_KEY, JSON.stringify(results))
    localStorage.setItem(PENDING_GAME_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Failed to store pending game results:', error)
  }
}

/**
 * Retrieve pending game results from localStorage
 * Returns null if no pending results or if they're too old (>1 hour)
 */
export function getPendingGameResults(): GameResults | null {
  try {
    const resultsStr = localStorage.getItem(PENDING_GAME_KEY)
    const timestampStr = localStorage.getItem(PENDING_GAME_TIMESTAMP_KEY)
    
    if (!resultsStr || !timestampStr) {
      return null
    }
    
    // Check if results are less than 1 hour old
    const timestamp = parseInt(timestampStr, 10)
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    
    if (timestamp < oneHourAgo) {
      clearPendingGameResults()
      return null
    }
    
    return JSON.parse(resultsStr) as GameResults
  } catch (error) {
    console.error('Failed to retrieve pending game results:', error)
    return null
  }
}

/**
 * Clear pending game results from localStorage
 */
export function clearPendingGameResults(): void {
  try {
    localStorage.removeItem(PENDING_GAME_KEY)
    localStorage.removeItem(PENDING_GAME_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Failed to clear pending game results:', error)
  }
}

/**
 * Check if there are pending game results
 */
export function hasPendingGameResults(): boolean {
  return getPendingGameResults() !== null
}
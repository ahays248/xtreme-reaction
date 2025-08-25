import { createClient } from './client'
import type { Database } from './database.types'

type GameSession = Database['public']['Tables']['game_sessions']['Row']
type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface GameResults {
  score: number
  avgReactionTime: number
  successfulHits: number
  incorrectHits: number
  missedCues: number
  accuracy: number
  totalClicks: number
  maxStreak: number
  roundsCompleted: number
  gameDuration: number
  targetsShown: number
  trapsAvoided: number
}

/**
 * Save a game session to the database
 * This will be called after a game ends (Phase 15)
 */
export async function saveGameSession(
  userId: string,
  results: GameResults
): Promise<{ data: GameSession | null; error: Error | null }> {
  const supabase = createClient()
  
  const gameSessionData: GameSessionInsert = {
    user_id: userId,
    score: results.score,
    avg_reaction_time: Math.round(results.avgReactionTime),
    successful_hits: results.successfulHits,
    incorrect_hits: results.incorrectHits,
    trap_targets_hit: results.incorrectHits, // Same as incorrect_hits for red targets
    missed_cues: results.missedCues,
    accuracy: Math.round(results.accuracy),
    total_clicks: results.totalClicks,
    max_streak: results.maxStreak,
    rounds_survived: results.roundsCompleted,
    game_duration: results.gameDuration,
    targets_shown: results.targetsShown,
    fakes_avoided: results.trapsAvoided,
    difficulty_reached: results.roundsCompleted, // Can be adjusted based on difficulty system
  }

  const { data, error } = await supabase
    .from('game_sessions')
    .insert(gameSessionData)
    .select()
    .single()

  if (error) {
    console.error('Error saving game session:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get user profile by ID
 * This will be used to display user stats (Phase 14)
 */
export async function getUserProfile(
  userId: string
): Promise<{ data: Profile | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get user's recent game sessions
 * Useful for showing game history
 */
export async function getUserGameSessions(
  userId: string,
  limit = 10
): Promise<{ data: GameSession[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching game sessions:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get daily leaderboard
 * For Phase 16: Leaderboards
 */
export async function getDailyLeaderboard(
  limit = 20
): Promise<{ data: any[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('daily_leaderboard')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Error fetching daily leaderboard:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get all-time leaderboard
 * For Phase 16: Leaderboards
 */
export async function getAllTimeLeaderboard(
  limit = 20
): Promise<{ data: any[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('all_time_leaderboard')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Error fetching all-time leaderboard:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Test database connection
 * Simple utility to verify database is accessible
 */
export async function testDatabaseConnection(): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('count')
      .single()
    
    if (error) {
      console.error('Database connection test failed:', error)
      return false
    }
    
    console.log('Database connection successful')
    return true
  } catch (err) {
    console.error('Database connection test error:', err)
    return false
  }
}
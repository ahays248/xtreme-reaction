import { createClient } from './client'
import type { Database } from './database.types'
import { gameSessionLimiter } from '../rateLimit'

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
  trapHit?: boolean // Track if game ended due to trap
  difficultyLevel?: number // Current difficulty percentage
}

/**
 * Save a game session to the database
 * This will be called after a game ends (Phase 15)
 */
export async function saveGameSession(
  userId: string,
  results: GameResults
): Promise<{ data: GameSession | null; error: Error | null }> {
  // Rate limiting check
  if (gameSessionLimiter.isRateLimited(userId)) {
    console.warn('Rate limit exceeded for user:', userId)
    return { 
      data: null, 
      error: new Error('Too many requests. Please wait before saving another game.') 
    }
  }
  
  // Validate minimum reaction time (prevent impossible scores)
  if (results.avgReactionTime < 100) {
    console.warn('Suspicious reaction time detected:', results.avgReactionTime, 'User:', userId)
    return {
      data: null,
      error: new Error('Invalid game data detected. Scores with average reaction time below 100ms are not allowed.')
    }
  }
  
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
    difficulty_reached: Math.round(results.difficultyLevel || results.roundsCompleted),
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

export interface LeaderboardEntry {
  user_id: string
  username: string
  x_username: string | null
  best_score: number
  best_reaction_time: number
  games_today?: number | null
  total_games?: number | null
  lifetime_hits?: number | null
  lifetime_misses?: number | null
}

/**
 * Get daily leaderboard
 * For Phase 16: Leaderboards
 */
export async function getDailyLeaderboard(
  limit = 20
): Promise<{ data: LeaderboardEntry[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('daily_leaderboard')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Error fetching daily leaderboard:', error)
    return { data: null, error }
  }

  // Filter out any entries with null required fields and cast
  const validData = data?.filter(entry => 
    entry.user_id && entry.username && entry.best_score !== null && entry.best_reaction_time !== null
  ) as LeaderboardEntry[] || []

  return { data: validData, error: null }
}

/**
 * Get all-time leaderboard
 * For Phase 16: Leaderboards
 */
export async function getAllTimeLeaderboard(
  limit = 20
): Promise<{ data: LeaderboardEntry[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('all_time_leaderboard')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Error fetching all-time leaderboard:', error)
    return { data: null, error }
  }

  // Filter out any entries with null required fields and cast
  const validData = data?.filter(entry => 
    entry.user_id && entry.username && entry.best_score !== null && entry.best_reaction_time !== null
  ) as LeaderboardEntry[] || []

  return { data: validData, error: null }
}

/**
 * Get user's rank in the leaderboard
 * For Phase 16: Shows user position even if not in top 20
 */
export async function getUserRank(
  userId: string,
  type: 'daily' | 'all-time' = 'daily'
): Promise<{ rank: number | null; error: Error | null }> {
  const supabase = createClient()
  
  try {
    // Get all scores ordered properly to calculate rank
    const view = type === 'daily' ? 'daily_leaderboard' : 'all_time_leaderboard'
    const { data, error } = await supabase
      .from(view)
      .select('user_id, best_score')
      .order('best_score', { ascending: false })
    
    if (error) {
      console.error('Error fetching user rank:', error)
      return { rank: null, error }
    }
    
    if (!data) return { rank: null, error: null }
    
    // Find user's position
    const userIndex = data.findIndex(entry => entry.user_id === userId)
    if (userIndex === -1) return { rank: null, error: null }
    
    return { rank: userIndex + 1, error: null }
  } catch (err) {
    return { rank: null, error: err as Error }
  }
}

/**
 * Get percentile ranking for a score compared to today's scores
 * Returns what percentage of players you beat today
 */
export async function getScorePercentile(score: number): Promise<number | null> {
  const supabase = createClient()
  
  try {
    const today = new Date().toISOString().split('T')[0]
    const startOfDay = `${today}T00:00:00.000Z`
    const endOfDay = `${today}T23:59:59.999Z`
    
    // Get all scores from today - use played_at not created_at
    const { data: allScores, error } = await supabase
      .from('game_sessions')
      .select('score')
      .gte('played_at', startOfDay)
      .lte('played_at', endOfDay)
      .order('score', { ascending: true })
    
    if (error) {
      console.error('Error fetching scores for percentile:', error)
      return null
    }
    
    if (!allScores || allScores.length === 0) {
      // If no scores today, you're in the 100th percentile!
      return 100
    }
    
    // Find how many scores are below this score
    const scoresBelow = allScores.filter(s => s.score < score).length
    const percentile = Math.round((scoresBelow / allScores.length) * 100)
    
    return percentile
  } catch (error) {
    console.error('Error calculating percentile:', error)
    return null
  }
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
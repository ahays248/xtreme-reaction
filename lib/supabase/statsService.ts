import { createClient } from './client'
import type { Database } from './database.types'

type GameSession = Database['public']['Tables']['game_sessions']['Row']

export interface GameStats {
  avgReactionTime: number
  accuracy: number
  score: number
  playedAt: string
  successfulHits: number
  missedCues: number
  incorrectHits: number
}

export interface DailyGameCount {
  date: string
  count: number
}

/**
 * Get user's game history for charts
 */
export async function getUserGameStats(
  userId: string,
  limit = 20
): Promise<{ data: GameStats[] | null; error: Error | null }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_sessions')
    .select('avg_reaction_time, accuracy, score, played_at, successful_hits, missed_cues, incorrect_hits')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching game stats:', error)
    return { data: null, error }
  }

  const stats: GameStats[] = data?.map(session => ({
    avgReactionTime: session.avg_reaction_time,
    accuracy: session.accuracy || 0,
    score: session.score,
    playedAt: session.played_at || new Date().toISOString(),
    successfulHits: session.successful_hits,
    missedCues: session.missed_cues,
    incorrectHits: session.incorrect_hits || 0
  })) || []

  // Reverse to show oldest first for charts
  return { data: stats.reverse(), error: null }
}

/**
 * Get total game sessions per day (all users)
 */
export async function getTotalGamesPerDay(
  days = 14
): Promise<{ data: DailyGameCount[] | null; error: Error | null }> {
  const supabase = createClient()
  
  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('game_sessions')
    .select('played_at')
    .gte('played_at', startDate.toISOString())
    .lte('played_at', endDate.toISOString())
    .order('played_at', { ascending: true })

  if (error) {
    console.error('Error fetching total games:', error)
    return { data: null, error }
  }

  // Group by day
  const dailyCounts = new Map<string, number>()
  
  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyCounts.set(dateStr, 0)
  }
  
  // Count games per day
  data?.forEach(session => {
    if (session.played_at) {
      const date = session.played_at.split('T')[0]
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    }
  })

  // Convert to array and sort
  const result: DailyGameCount[] = Array.from(dailyCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return { data: result, error: null }
}

/**
 * Get user's aggregated stats
 */
export async function getUserAggregateStats(
  userId: string
): Promise<{ 
  totalGames: number
  avgAccuracy: number
  avgReactionTime: number
  bestScore: number
  improvement: number
} | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_sessions')
    .select('accuracy, avg_reaction_time, score')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return null
  }

  const totalGames = data.length
  const avgAccuracy = Math.round(data.reduce((sum, g) => sum + (g.accuracy || 0), 0) / totalGames)
  const avgReactionTime = Math.round(data.reduce((sum, g) => sum + g.avg_reaction_time, 0) / totalGames)
  const bestScore = Math.max(...data.map(g => g.score))
  
  // Calculate improvement (compare last 5 games to first 5)
  let improvement = 0
  if (totalGames >= 10) {
    const recent5 = data.slice(0, 5)
    const oldest5 = data.slice(-5)
    const recentAvg = recent5.reduce((sum, g) => sum + g.score, 0) / 5
    const oldAvg = oldest5.reduce((sum, g) => sum + g.score, 0) / 5
    improvement = Math.round(((recentAvg - oldAvg) / oldAvg) * 100)
  }

  return {
    totalGames,
    avgAccuracy,
    avgReactionTime,
    bestScore,
    improvement
  }
}
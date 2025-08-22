import { createClient } from '@/lib/supabase/client'
import { GameResults } from '@/lib/game/types'
import type { Database } from './database.types'

type GameSession = Database['public']['Tables']['game_sessions']['Insert']

export async function saveGameSession(results: GameResults, userId?: string) {
  const supabase = createClient()
  
  try {
    // Get the current user if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    }
    
    // Prepare the game session data
    const gameSession: GameSession = {
      user_id: userId || null, // Can be null for anonymous users
      score: results.score,
      grade: results.grade,
      avg_reaction_time: results.avgReactionTime,
      fastest_reaction: results.fastestReaction,
      slowest_reaction: results.slowestReaction,
      successful_hits: results.successfulHits,
      missed_cues: results.missedCues,
      incorrect_hits: results.incorrectHits,
      fakes_avoided: results.fakesAvoided,
      total_clicks: results.totalClicks,
      accuracy: results.accuracy,
      difficulty_reached: results.difficulty,
      played_at: new Date().toISOString()
    }
    
    // Insert the game session
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(gameSession)
      .select()
      .single()
    
    if (error) {
      console.error('Error saving game session:', error)
      return { success: false, error }
    }
    
    // If user is logged in, update their profile stats
    if (userId) {
      await updateUserStats(userId, results)
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error saving game session:', error)
    return { success: false, error }
  }
}

async function updateUserStats(userId: string, results: GameResults) {
  const supabase = createClient()
  
  try {
    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return
    }
    
    // Update profile stats
    const updates = {
      total_games: (profile.total_games || 0) + 1,
      total_score: (profile.total_score || 0) + results.score,
      best_score: Math.max(profile.best_score || 0, results.score),
      best_reaction_time: Math.min(
        profile.best_reaction_time || 999999,
        results.fastestReaction || 999999
      ),
      avg_reaction_time: profile.avg_reaction_time
        ? (profile.avg_reaction_time * profile.total_games + results.avgReactionTime) / (profile.total_games + 1)
        : results.avgReactionTime,
      s_grades: profile.s_grades + (results.grade === 'S' ? 1 : 0),
      a_grades: profile.a_grades + (results.grade === 'A' ? 1 : 0),
      b_grades: profile.b_grades + (results.grade === 'B' ? 1 : 0),
      c_grades: profile.c_grades + (results.grade === 'C' ? 1 : 0),
      d_grades: profile.d_grades + (results.grade === 'D' ? 1 : 0),
      updated_at: new Date().toISOString()
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating profile stats:', updateError)
    }
  } catch (error) {
    console.error('Unexpected error updating user stats:', error)
  }
}

export async function getLeaderboard(type: 'daily' | 'all_time' = 'all_time', limit = 10) {
  const supabase = createClient()
  
  const view = type === 'daily' ? 'daily_leaderboard' : 'all_time_leaderboard'
  
  const { data, error } = await supabase
    .from(view)
    .select('*')
    .limit(limit)
  
  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  
  return data
}

export async function getUserRank(userId: string, type: 'daily' | 'all_time' = 'all_time') {
  const supabase = createClient()
  
  const view = type === 'daily' ? 'daily_leaderboard' : 'all_time_leaderboard'
  
  // Get all entries to calculate rank
  const { data, error } = await supabase
    .from(view)
    .select('user_id')
  
  if (error || !data) {
    console.error('Error fetching user rank:', error)
    return null
  }
  
  const userIndex = data.findIndex(entry => entry.user_id === userId)
  return userIndex === -1 ? null : userIndex + 1
}
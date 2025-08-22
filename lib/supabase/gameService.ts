import { createClient } from '@/lib/supabase/client'
import { GameResults } from '@/lib/game/types'

export async function saveGameSession(results: GameResults, userId?: string) {
  const supabase = createClient()
  
  try {
    // Get the current user if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    }
    
    console.log('Saving game session...', { results, userId })
    
    // Prepare the game session data matching the actual database schema
    const gameSession = {
      user_id: userId || null, // Can be null for anonymous users
      avg_reaction_time: Math.round(results.avgReactionTime),
      successful_hits: results.successfulHits,
      incorrect_hits: results.incorrectHits,
      missed_cues: results.missedCues,
      difficulty_reached: Math.round(results.difficulty || 1),
      score: results.score,
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
      return { success: false, error: error.message }
    }
    
    console.log('Game session saved successfully:', data)
    
    // If user is logged in, update their profile stats
    if (userId) {
      await updateUserStats(userId, results)
    }
    
    return { success: true, data }
  } catch (error: any) {
    console.error('Unexpected error saving game session:', error)
    return { success: false, error: error.message || 'Unknown error' }
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
      lifetime_hits: (profile.lifetime_hits || 0) + results.successfulHits,
      lifetime_misses: (profile.lifetime_misses || 0) + results.incorrectHits + results.missedCues,
      best_reaction_time: profile.best_reaction_time 
        ? Math.min(profile.best_reaction_time, Math.round(results.avgReactionTime))
        : Math.round(results.avgReactionTime),
      updated_at: new Date().toISOString()
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating profile stats:', updateError)
    } else {
      console.log('User profile stats updated successfully')
    }
  } catch (error) {
    console.error('Unexpected error updating user stats:', error)
  }
}

export async function getLeaderboard(type: 'daily' | 'all_time' = 'all_time', limit = 10) {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('game_sessions')
      .select(`
        *,
        profiles!left(username, x_username)
      `)
      .order('score', { ascending: false })
      .limit(limit)
    
    // For daily leaderboard, filter by today's date
    if (type === 'daily') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('played_at', today.toISOString())
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error fetching leaderboard:', error)
    return []
  }
}

export async function getUserRank(userId: string, type: 'daily' | 'all_time' = 'all_time') {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('game_sessions')
      .select('user_id, score')
      .order('score', { ascending: false })
    
    // For daily rank, filter by today's date
    if (type === 'daily') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('played_at', today.toISOString())
    }
    
    const { data, error } = await query
    
    if (error || !data) {
      console.error('Error fetching user rank:', error)
      return null
    }
    
    const userIndex = data.findIndex(entry => entry.user_id === userId)
    return userIndex === -1 ? null : userIndex + 1
  } catch (error) {
    console.error('Unexpected error fetching user rank:', error)
    return null
  }
}

export async function checkUserAuth() {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return { isAuthenticated: !!user, userId: user?.id || null }
  } catch (error) {
    console.error('Error checking auth:', error)
    return { isAuthenticated: false, userId: null }
  }
}
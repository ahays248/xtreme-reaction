import { createClient } from './client'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Sign in with X (Twitter) OAuth
 */
export async function signInWithX() {
  const supabase = createClient()
  
  // Use the app URL as redirect, Supabase will handle the OAuth flow
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: 'https://xtreme-reaction.vercel.app/',
    },
  })

  if (error) {
    console.error('Error signing in with X:', error)
    return { error }
  }

  return { data, error: null }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get the current user session
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  return session
}

/**
 * Get the current user
 */
export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

/**
 * Get the user's profile from the database
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  const supabase = createClient()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null)
    }
  )

  return subscription
}

/**
 * Check if user is in practice mode (not authenticated)
 */
export function isPracticeMode(user: User | null): boolean {
  return !user
}
import { createClient } from './client'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  username: string, 
  xHandle?: string
) {
  const supabase = createClient()
  
  try {
    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('Sign up error:', authError)
      return { error: authError }
    }

    if (!authData.user) {
      return { error: new Error('No user returned from sign up') }
    }

    // Step 2: Create or update the user profile
    // The profile might already exist from a trigger, so we upsert
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        username: username,
        x_username: xHandle || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the whole signup if profile creation fails
      // The user can still sign in and we'll try to create profile later
    }

    return { data: authData, error: null }
  } catch (err) {
    console.error('Unexpected error during sign up:', err)
    return { error: err as Error }
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error during sign in:', err)
    return { error: err as Error }
  }
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
    // Don't log "Auth session missing" errors - these are expected when not logged in
    if (!error.message?.includes('Auth session missing')) {
      console.error('Error getting user:', error)
    }
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
    // Profile might not exist yet, create it
    if (error.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: 'Player' + userId.slice(0, 6), // Default username
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating profile:', createError)
        return null
      }
      
      return newProfile
    }
    
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

/**
 * Reset password request
 */
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    console.error('Password reset error:', error)
    return { error }
  }
  
  return { error: null }
}
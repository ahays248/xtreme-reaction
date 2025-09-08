import { createClient } from './client'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { authLimiter } from '../rateLimit'

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
  // Rate limiting
  if (authLimiter.isRateLimited(email)) {
    throw new Error('Too many attempts. Please wait before trying again.')
  }
  
  const supabase = createClient()
  
  try {
    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          x_username: xHandle,
        }
      }
    })

    if (authError) {
      console.error('Sign up error:', authError)
      // Check if user already exists and provide clearer error
      if (authError.message?.includes('already registered')) {
        return { error: new Error('This email is already registered. Please sign in instead.') }
      }
      return { error: authError }
    }

    if (!authData.user) {
      return { error: new Error('No user returned from sign up') }
    }

    // Step 2: Create the user profile
    // Use insert instead of upsert to respect RLS policies
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
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
  // Rate limiting
  if (authLimiter.isRateLimited(email)) {
    throw new Error('Too many login attempts. Please wait before trying again.')
  }
  
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
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error('Google sign in error:', error)
      return { error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error during Google sign in:', err)
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
export async function getUserProfile(userId: string, isOAuthUser?: boolean): Promise<Profile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // Profile might not exist yet, create it
    if (error.code === 'PGRST116') {
      // For OAuth users, create with a temporary username that needs to be changed
      // For email users, they already chose a username during signup
      const tempUsername = isOAuthUser 
        ? `Player${userId.slice(0, 6)}` // Temporary username for OAuth
        : `User${userId.slice(0, 6)}` // Fallback for email users who somehow don't have a profile
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: tempUsername,
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
 * Update user's username (for Google OAuth users who need to set it)
 */
export async function updateUsername(
  userId: string, 
  username: string, 
  xHandle?: string
): Promise<{ data: Profile | null; error: Error | null }> {
  const supabase = createClient()
  
  // Validate username format
  if (!username || username.length < 3 || username.length > 20) {
    return { data: null, error: new Error('Username must be 3-20 characters') }
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { data: null, error: new Error('Username can only contain letters, numbers, and underscores') }
  }
  
  // Prevent email-like usernames
  if (username.includes('@') || username.includes('.com')) {
    return { data: null, error: new Error('Username cannot look like an email address') }
  }
  
  try {
    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', userId)
      .single()
    
    if (existingUser) {
      return { data: null, error: new Error('Username is already taken') }
    }
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username,
        x_username: xHandle || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating username:', error)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error updating username:', err)
    return { data: null, error: err as Error }
  }
}

/**
 * Check if a username needs to be set up (for OAuth users)
 */
export function needsUsernameSetup(profile: Profile | null): boolean {
  if (!profile) return false
  
  // Check if username is the default pattern (Player + ID substring)
  // or if it's null/empty
  return !profile.username || 
         profile.username === '' ||
         profile.username.startsWith('Player') ||
         profile.username.includes('@') // Somehow got email as username
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
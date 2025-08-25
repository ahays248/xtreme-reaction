import { createClient } from './client'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Sign in with X (Twitter) OAuth
 */
export async function signInWithX() {
  const supabase = createClient()
  
  try {
    console.log('Initiating X OAuth with config:')
    console.log('- Provider: twitter')
    console.log('- Redirect URL:', `${window.location.origin}/`)
    console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Use the app URL as redirect after successful auth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      console.error('OAuth Error Details:', {
        message: error.message,
        status: error.status,
        details: error
      })
      
      // Check for common error patterns
      if (error.message?.includes('Provider not found') || error.message?.includes('provider')) {
        console.error('❌ Twitter provider is likely not enabled in Supabase Dashboard')
        console.error('📋 Check: Authentication > Providers > Twitter in your Supabase dashboard')
      }
      
      return { error }
    }

    // Enhanced debugging for OAuth URL
    console.log('✅ OAuth request successful')
    console.log('OAuth data:', data)
    console.log('OAuth URL:', data?.url)
    
    // Validate the OAuth URL
    if (data?.url) {
      if (data.url.includes('twitter.com') || data.url.includes('x.com')) {
        console.log('✅ Valid Twitter OAuth URL detected, redirecting...')
        window.location.href = data.url
      } else {
        console.error('❌ Invalid OAuth URL - not redirecting to Twitter:', data.url)
        console.error('📋 This suggests Twitter provider is not properly configured')
        return { 
          error: new Error('Invalid OAuth URL: Twitter provider may not be enabled in Supabase Dashboard') 
        }
      }
    } else {
      console.error('❌ No OAuth URL returned from Supabase')
      return { 
        error: new Error('No OAuth URL returned - check Twitter provider configuration in Supabase') 
      }
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('❌ Unexpected error during sign in:', err)
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
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
    // Check for debug mode
    const debugMode = localStorage.getItem('oauth_debug_mode') === 'true'
    
    // Store debug info in localStorage to persist across redirects
    const debugInfo = {
      timestamp: new Date().toISOString(),
      provider: 'twitter',
      redirectUrl: `${window.location.origin}/auth/callback`,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      stage: 'initiating',
      debugMode
    }
    
    localStorage.setItem('oauth_debug', JSON.stringify(debugInfo))
    console.log('Initiating X OAuth with config:', debugInfo)
    
    // Use the app URL as redirect after successful auth
    // Try with explicit auth callback path
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: debugMode, // Skip redirect in debug mode
      },
    })

    if (error) {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        stage: 'error',
        error: {
          message: error.message,
          status: error.status,
          name: error.name
        }
      }
      
      localStorage.setItem('oauth_error', JSON.stringify(errorInfo))
      console.error('OAuth Error Details:', errorInfo)
      
      // Check for common error patterns
      if (error.message?.includes('Provider not found') || error.message?.includes('provider')) {
        console.error('❌ Twitter provider is likely not enabled in Supabase Dashboard')
        console.error('📋 Check: Authentication > Providers > Twitter in your Supabase dashboard')
      }
      
      return { error }
    }

    // Enhanced debugging for OAuth URL
    const responseInfo = {
      timestamp: new Date().toISOString(),
      stage: 'response',
      hasData: !!data,
      hasUrl: !!data?.url,
      url: data?.url,
      provider: data?.provider,
      debugMode
    }
    
    localStorage.setItem('oauth_response', JSON.stringify(responseInfo))
    console.log('✅ OAuth request successful')
    console.log('OAuth Response:', responseInfo)
    
    // In debug mode, show the URL but don't redirect
    if (debugMode) {
      const debugResult = {
        success: !!data?.url,
        url: data?.url,
        isTwitterUrl: data?.url && (data.url.includes('twitter.com') || data.url.includes('x.com')),
        provider: data?.provider,
        message: data?.url ? 
          (data.url.includes('twitter.com') || data.url.includes('x.com') ? 
            '✅ OAuth URL points to Twitter!' : 
            '❌ OAuth URL does not point to Twitter') : 
          '❌ No OAuth URL returned'
      }
      
      localStorage.setItem('oauth_debug_result', JSON.stringify(debugResult))
      console.log('Debug Mode Result:', debugResult)
      
      // Show alert with the URL for debugging
      alert(`OAuth Debug Mode:\n\n${debugResult.message}\n\nURL: ${data?.url || 'No URL returned'}\n\nCheck console and localStorage for details.`)
      
      return { data, error: null }
    }
    
    // Validate the OAuth URL
    if (data?.url) {
      if (data.url.includes('twitter.com') || data.url.includes('x.com')) {
        console.log('✅ Valid Twitter OAuth URL detected, redirecting...')
        window.location.href = data.url
      } else {
        console.error('❌ Invalid OAuth URL - not redirecting to Twitter:', data.url)
        console.error('📋 This suggests Twitter provider is not properly configured')
        
        // Store error before attempting redirect
        const errorData = {
          timestamp: new Date().toISOString(),
          stage: 'invalid_url',
          url: data.url,
          message: 'OAuth URL does not point to Twitter'
        }
        localStorage.setItem('oauth_error', JSON.stringify(errorData))
        
        // Still attempt redirect to see what happens
        console.log('Attempting redirect anyway to debug...')
        window.location.href = data.url
        
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
    const catchError = {
      timestamp: new Date().toISOString(),
      stage: 'catch',
      error: {
        message: (err as Error).message,
        name: (err as Error).name,
        stack: (err as Error).stack
      }
    }
    localStorage.setItem('oauth_catch_error', JSON.stringify(catchError))
    console.error('❌ Unexpected error during sign in:', catchError)
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
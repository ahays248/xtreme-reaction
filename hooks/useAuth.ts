'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import { 
  getUser, 
  getUserProfile, 
  onAuthStateChange,
  signInWithEmail as signIn,
  signUpWithEmail as signUp,
  signInWithGoogle as signInGoogle,
  signOut as signOutUser,
  updateUsername as updateUserUsername,
  needsUsernameSetup
} from '@/lib/supabase/authHelpers'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isPracticeMode: boolean
  needsUsernameSetup: boolean
}

export function useAuth() {
  // Start with loading state to prevent hydration mismatch
  // The server always renders loading state, client will update after mount
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isPracticeMode: true,
    needsUsernameSetup: false,
  })

  useEffect(() => {
    // Get initial user
    const initAuth = async () => {
      const user = await getUser()
      
      if (user) {
        // Check if user is OAuth user (no password)
        const isOAuthUser = user.app_metadata?.provider === 'google' || 
                           user.app_metadata?.providers?.includes('google')
        
        const profile = await getUserProfile(user.id, isOAuthUser)
        const needsSetup = needsUsernameSetup(profile)
        
        setAuthState({
          user,
          profile,
          loading: false,
          isPracticeMode: false,
          needsUsernameSetup: needsSetup,
        })
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isPracticeMode: true,
          needsUsernameSetup: false,
        })
      }
    }

    initAuth()

    // Subscribe to auth changes
    const subscription = onAuthStateChange(async (user) => {
      if (user) {
        const isOAuthUser = user.app_metadata?.provider === 'google' || 
                           user.app_metadata?.providers?.includes('google')
        const profile = await getUserProfile(user.id, isOAuthUser)
        const needsSetup = needsUsernameSetup(profile)
        
        setAuthState({
          user,
          profile,
          loading: false,
          isPracticeMode: false,
          needsUsernameSetup: needsSetup,
        })
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isPracticeMode: true,
          needsUsernameSetup: false,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await signIn(email, password)
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
    // Auth state will be updated by the subscription
  }

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    username: string, 
    xHandle?: string
  ) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await signUp(email, password, username, xHandle)
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
    // Auth state will be updated by the subscription
  }

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await signInGoogle()
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
    // OAuth will redirect, state will be updated when returning
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await signOutUser()
    if (error) {
      console.error('Sign out error:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
    // Auth state will be updated by the subscription
  }

  const updateUsername = async (username: string, xHandle?: string) => {
    if (!authState.user) {
      throw new Error('No user logged in')
    }
    
    setAuthState(prev => ({ ...prev, loading: true }))
    const { data, error } = await updateUserUsername(authState.user.id, username, xHandle)
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      throw error
    }
    
    // Update the local state with new profile
    setAuthState(prev => ({
      ...prev,
      profile: data,
      loading: false,
      needsUsernameSetup: false,
    }))
  }

  return {
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    isPracticeMode: authState.isPracticeMode,
    needsUsernameSetup: authState.needsUsernameSetup,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    updateUsername,
  }
}
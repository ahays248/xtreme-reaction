'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import { 
  getUser, 
  getUserProfile, 
  onAuthStateChange,
  signInWithX as signIn,
  signOut as signOutUser
} from '@/lib/supabase/authHelpers'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isPracticeMode: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isPracticeMode: true,
  })

  useEffect(() => {
    // Get initial user
    const initAuth = async () => {
      const user = await getUser()
      
      if (user) {
        const profile = await getUserProfile(user.id)
        setAuthState({
          user,
          profile,
          loading: false,
          isPracticeMode: false,
        })
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isPracticeMode: true,
        })
      }
    }

    initAuth()

    // Subscribe to auth changes
    const subscription = onAuthStateChange(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.id)
        setAuthState({
          user,
          profile,
          loading: false,
          isPracticeMode: false,
        })
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isPracticeMode: true,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithX = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await signIn()
    if (error) {
      console.error('Sign in error:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
    // Auth state will be updated by the subscription
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

  return {
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    isPracticeMode: authState.isPracticeMode,
    signInWithX,
    signOut,
  }
}
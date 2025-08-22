import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInAnonymously = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInAnonymously()
      
      if (error) throw error
      
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error signing in anonymously:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithX = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      return { success: true, url: data.url }
    } catch (error) {
      console.error('Error signing in with X:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAnonymous: user?.is_anonymous ?? false,
    signInAnonymously,
    signInWithX,
    signOut
  }
}
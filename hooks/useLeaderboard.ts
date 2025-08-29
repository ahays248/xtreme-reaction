import { useState, useEffect, useCallback, useRef } from 'react'
import { getDailyLeaderboard, getAllTimeLeaderboard, getUserRank, type LeaderboardEntry } from '@/lib/supabase/gameService'
import { useAuth } from './useAuth'

type LeaderboardType = 'daily' | 'all-time'

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[]
  loading: boolean
  error: Error | null
  userRank: number | null
  refresh: () => void
  type: LeaderboardType
  setType: (type: LeaderboardType) => void
  lastUpdated: Date | null
}

export function useLeaderboard(initialType: LeaderboardType = 'daily'): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [type, setType] = useState<LeaderboardType>(initialType)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAuth()

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch the appropriate leaderboard
      const fetchFunction = type === 'daily' ? getDailyLeaderboard : getAllTimeLeaderboard
      const { data, error: fetchError } = await fetchFunction(20)
      
      if (fetchError) {
        throw fetchError
      }
      
      setLeaderboard(data || [])
      setLastUpdated(new Date())
      
      // If user is logged in, fetch their rank
      if (user) {
        const { rank } = await getUserRank(user.id, type)
        setUserRank(rank)
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [type, user])

  // Fetch leaderboard when component mounts or type changes
  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Auto-refresh every 150 seconds (2.5 minutes) only when tab is visible
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only set interval if tab is visible
    if (isTabVisible) {
      intervalRef.current = setInterval(fetchLeaderboard, 150000) // 150 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchLeaderboard, isTabVisible])

  return {
    leaderboard,
    loading,
    error,
    userRank,
    refresh: fetchLeaderboard,
    type,
    setType,
    lastUpdated
  }
}
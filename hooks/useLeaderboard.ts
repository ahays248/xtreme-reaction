import { useState, useEffect, useCallback } from 'react'
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
}

export function useLeaderboard(initialType: LeaderboardType = 'daily'): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [type, setType] = useState<LeaderboardType>(initialType)
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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  return {
    leaderboard,
    loading,
    error,
    userRank,
    refresh: fetchLeaderboard,
    type,
    setType
  }
}
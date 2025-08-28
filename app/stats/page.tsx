'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getUserGameStats, getTotalGamesPerDay, getUserAggregateStats } from '@/lib/supabase/statsService'
import ProgressChart from '@/components/charts/ProgressChart'
import AccuracyChart from '@/components/charts/AccuracyChart'
import ScoreHistoryChart from '@/components/charts/ScoreHistoryChart'
import TotalGamesChart from '@/components/charts/TotalGamesChart'
import StatsOverview from '@/components/charts/StatsOverview'
import type { GameStats, DailyGameCount } from '@/lib/supabase/statsService'

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [gameStats, setGameStats] = useState<GameStats[]>([])
  const [totalGames, setTotalGames] = useState<DailyGameCount[]>([])
  const [aggregateStats, setAggregateStats] = useState({
    totalGames: 0,
    avgAccuracy: 0,
    avgReactionTime: 0,
    bestScore: 0,
    improvement: 0
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    if (user) {
      loadStats()
    }
  }, [user, authLoading, router])

  async function loadStats() {
    setLoading(true)
    
    // Load user's game stats
    const { data: userStats } = await getUserGameStats(user!.id, 20)
    if (userStats) {
      setGameStats(userStats)
    }

    // Load total games per day
    const { data: dailyGames } = await getTotalGamesPerDay(14)
    if (dailyGames) {
      setTotalGames(dailyGames)
    }

    // Load aggregate stats
    const stats = await getUserAggregateStats(user!.id)
    if (stats) {
      setAggregateStats(stats)
    }

    setLoading(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neon-green text-xl">Loading stats...</div>
      </div>
    )
  }

  if (gameStats.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-neon-green mb-4">No Games Yet</h1>
        <p className="text-gray-400 mb-8">Play some games to see your stats!</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-neon-green/20 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green/30 transition-all"
        >
          Play Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neon-green">Your Stats</h1>
          <Link 
            href="/"
            className="px-4 py-2 text-sm bg-neon-green/20 border border-neon-green text-neon-green rounded-lg hover:bg-neon-green/30 transition-all"
          >
            Back to Game
          </Link>
        </div>

        {/* Stats Overview */}
        <StatsOverview {...aggregateStats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Games Chart (All Users) */}
          <TotalGamesChart data={totalGames} />

          {/* Progress Chart */}
          <ProgressChart data={gameStats} />

          {/* Accuracy Chart */}
          <AccuracyChart data={gameStats} />

          {/* Score History */}
          <ScoreHistoryChart data={gameStats} />
        </div>
      </div>
    </div>
  )
}
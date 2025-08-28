'use client'

import { motion } from 'framer-motion'
import { formatTime } from '@/lib/timing'
import { formatScore } from '@/lib/scoring'
import type { LeaderboardEntry } from '@/lib/supabase/gameService'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  userRank?: number | null
  type: 'daily' | 'all-time'
  onTypeChange: (type: 'daily' | 'all-time') => void
  loading?: boolean
}

export default function Leaderboard({ 
  entries, 
  currentUserId, 
  userRank,
  type,
  onTypeChange,
  loading = false 
}: LeaderboardProps) {
  
  const getRankDisplay = (rank: number) => {
    switch(rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => onTypeChange('daily')}
          className={`flex-1 px-3 sm:px-4 py-2 font-orbitron font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 ${
            type === 'daily' 
              ? 'bg-neon-green/20 text-neon-green border-2 border-neon-green shadow-neon-green' 
              : 'bg-black border-2 border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          TODAY'S BEST
        </button>
        <button
          onClick={() => onTypeChange('all-time')}
          className={`flex-1 px-3 sm:px-4 py-2 font-orbitron font-bold text-xs sm:text-sm rounded-lg transition-all duration-200 ${
            type === 'all-time' 
              ? 'bg-neon-green/20 text-neon-green border-2 border-neon-green shadow-neon-green' 
              : 'bg-black border-2 border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          ALL TIME
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-neon-green animate-pulse font-mono">Loading leaderboard...</p>
        </div>
      )}

      {/* Leaderboard Table */}
      {!loading && entries.length > 0 && (
        <div className="bg-black/50 border-2 border-green-500/30 rounded-lg overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-12 gap-1 sm:gap-2 p-2 sm:p-3 bg-green-500/10 border-b border-green-500/30 text-xs sm:text-sm font-mono text-gray-400 min-w-[320px]">
            <div className="col-span-2 sm:col-span-1">RANK</div>
            <div className="col-span-4 sm:col-span-5 lg:col-span-4">PLAYER</div>
            <div className="col-span-3">SCORE</div>
            <div className="col-span-3 sm:col-span-2">TIME</div>
            <div className="hidden lg:block col-span-2">GAMES</div>
          </div>

          {/* Entries */}
          <div className="divide-y divide-green-500/20">
            {entries.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = currentUserId === entry.user_id
              
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-1 sm:gap-2 p-2 sm:p-3 hover:bg-green-500/5 transition-colors min-w-[320px] ${
                    isCurrentUser ? 'bg-neon-green/10 border-l-4 border-neon-green' : ''
                  }`}
                >
                  <div className="col-span-2 sm:col-span-1 font-bold text-base sm:text-lg">
                    {getRankDisplay(rank)}
                  </div>
                  <div className="col-span-4 sm:col-span-5 lg:col-span-4">
                    <p className="font-orbitron text-white truncate text-xs sm:text-sm">
                      {entry.username}
                    </p>
                    {entry.x_username && (
                      <p className="text-xs text-gray-500 truncate hidden sm:block">@{entry.x_username}</p>
                    )}
                  </div>
                  <div className="col-span-3 font-mono text-neon-cyan text-xs sm:text-sm">
                    {formatScore(entry.best_score)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 font-mono text-yellow-400 text-xs sm:text-sm">
                    {formatTime(entry.best_reaction_time)}
                  </div>
                  <div className="hidden lg:block col-span-2 text-gray-400 text-sm">
                    {type === 'daily' ? entry.games_today : entry.total_games}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* User Rank (if not in top 20) */}
          {currentUserId && userRank && userRank > 20 && (
            <div className="border-t-2 border-green-500/30 p-2 sm:p-3 bg-amber-900/20 min-w-[320px]">
              <div className="grid grid-cols-12 gap-1 sm:gap-2">
                <div className="col-span-2 sm:col-span-1 font-bold text-base sm:text-lg">
                  #{userRank}
                </div>
                <div className="col-span-10 sm:col-span-11 text-amber-400 font-mono text-xs sm:text-sm">
                  Your Position (Keep playing to climb!)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && entries.length === 0 && (
        <div className="text-center py-12 border-2 border-gray-600 border-dashed rounded-lg">
          <p className="text-gray-400 font-mono mb-2">No scores yet today!</p>
          <p className="text-gray-500 text-sm">Be the first to set a high score</p>
        </div>
      )}
    </div>
  )
}
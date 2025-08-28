'use client'

interface StatsOverviewProps {
  totalGames: number
  avgAccuracy: number
  avgReactionTime: number
  bestScore: number
  improvement: number
}

export default function StatsOverview({ 
  totalGames, 
  avgAccuracy, 
  avgReactionTime, 
  bestScore, 
  improvement 
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <div className="bg-black/50 border border-neon-green/30 rounded-lg p-3">
        <p className="text-xs text-gray-400">Total Games</p>
        <p className="text-2xl font-bold text-neon-green">{totalGames}</p>
      </div>
      
      <div className="bg-black/50 border border-cyan/30 rounded-lg p-3">
        <p className="text-xs text-gray-400">Avg Accuracy</p>
        <p className="text-2xl font-bold text-cyan">{avgAccuracy}%</p>
      </div>
      
      <div className="bg-black/50 border border-yellow-400/30 rounded-lg p-3">
        <p className="text-xs text-gray-400">Avg Reaction</p>
        <p className="text-2xl font-bold text-yellow-400">{avgReactionTime}ms</p>
      </div>
      
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-3">
        <p className="text-xs text-gray-400">Best Score</p>
        <p className="text-2xl font-bold text-purple-500">{bestScore.toLocaleString()}</p>
      </div>
      
      <div className="bg-black/50 border border-orange-500/30 rounded-lg p-3">
        <p className="text-xs text-gray-400">Improvement</p>
        <p className="text-2xl font-bold text-orange-500">
          {improvement > 0 ? '+' : ''}{improvement}%
        </p>
      </div>
    </div>
  )
}
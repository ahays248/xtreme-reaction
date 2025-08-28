'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { GameStats } from '@/lib/supabase/statsService'

interface ScoreHistoryChartProps {
  data: GameStats[]
}

export default function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  const chartData = data.slice(-10).map((game, index) => ({
    game: `Game ${data.length - 10 + index + 1}`,
    score: game.score
  }))

  return (
    <div className="bg-black/50 border border-yellow-400/30 rounded-lg p-4">
      <h3 className="text-lg font-bold text-yellow-400 mb-4">Recent Scores</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#facc1530" />
          <XAxis dataKey="game" stroke="#facc15" fontSize={12} />
          <YAxis stroke="#facc15" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #facc15' }}
            labelStyle={{ color: '#facc15' }}
          />
          <Bar 
            dataKey="score" 
            fill="#facc15"
            name="Score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
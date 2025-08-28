'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { GameStats } from '@/lib/supabase/statsService'

interface ScoreHistoryChartProps {
  data: GameStats[]
}

export default function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  // Show all games for score tracking
  const chartData = data.map((game, index) => ({
    game: index + 1,
    score: game.score
  }))

  // Calculate average score for reference line
  const avgScore = Math.round(data.reduce((sum, g) => sum + g.score, 0) / data.length)
  const maxScore = Math.max(...data.map(g => g.score))

  return (
    <div className="bg-black/50 border border-yellow-400/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-yellow-400">Score History</h3>
        <div className="flex gap-4 text-xs">
          <span className="text-gray-400">Avg: {avgScore.toLocaleString()}</span>
          <span className="text-yellow-400">Best: {maxScore.toLocaleString()}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#facc1530" />
          <XAxis 
            dataKey="game" 
            stroke="#facc15" 
            fontSize={12}
            label={{ value: 'Games', position: 'insideBottom', offset: -5, style: { fill: '#facc15', fontSize: 10 } }}
          />
          <YAxis stroke="#facc15" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #facc15' }}
            labelStyle={{ color: '#facc15' }}
            formatter={(value: number) => [`${value.toLocaleString()}`, 'Score']}
            labelFormatter={(label) => `Game ${label}`}
          />
          <ReferenceLine y={avgScore} stroke="#facc1560" strokeDasharray="5 5" />
          <Line 
            type="monotone"
            dataKey="score" 
            stroke="#facc15"
            strokeWidth={2}
            dot={{ fill: '#facc15', r: 3 }}
            name="Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
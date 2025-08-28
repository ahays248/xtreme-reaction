'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { GameStats } from '@/lib/supabase/statsService'

interface ProgressChartProps {
  data: GameStats[]
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const chartData = data.map((game, index) => ({
    game: `Game ${index + 1}`,
    reactionTime: game.avgReactionTime,
    accuracy: game.accuracy
  }))

  return (
    <div className="bg-black/50 border border-neon-green/30 rounded-lg p-4">
      <h3 className="text-lg font-bold text-neon-green mb-4">Reaction Time Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ff0030" />
          <XAxis dataKey="game" stroke="#00ff00" fontSize={12} />
          <YAxis stroke="#00ff00" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00' }}
            labelStyle={{ color: '#00ff00' }}
          />
          <Line 
            type="monotone" 
            dataKey="reactionTime" 
            stroke="#00ff00" 
            strokeWidth={2}
            dot={{ fill: '#00ff00', r: 4 }}
            name="Reaction Time (ms)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
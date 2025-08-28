'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyGameCount } from '@/lib/supabase/statsService'

interface TotalGamesChartProps {
  data: DailyGameCount[]
}

export default function TotalGamesChart({ data }: TotalGamesChartProps) {
  const chartData = data.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    games: day.count
  }))

  const totalGames = data.reduce((sum, day) => sum + day.count, 0)

  return (
    <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-500">Game Popularity</h3>
        <span className="text-sm text-purple-400">Total: {totalGames} games</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#a855f730" />
          <XAxis dataKey="date" stroke="#a855f7" fontSize={12} />
          <YAxis stroke="#a855f7" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #a855f7' }}
            labelStyle={{ color: '#a855f7' }}
          />
          <Line 
            type="monotone" 
            dataKey="games" 
            stroke="#a855f7" 
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 4 }}
            name="Total Games"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
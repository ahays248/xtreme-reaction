'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { GameStats } from '@/lib/supabase/statsService'

interface AccuracyChartProps {
  data: GameStats[]
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
  const chartData = data.map((game, index) => ({
    game: `Game ${index + 1}`,
    accuracy: game.accuracy
  }))

  return (
    <div className="bg-black/50 border border-cyan/30 rounded-lg p-4">
      <h3 className="text-lg font-bold text-cyan mb-4">Accuracy Improvement</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ffff30" />
          <XAxis dataKey="game" stroke="#00ffff" fontSize={12} />
          <YAxis stroke="#00ffff" fontSize={12} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #00ffff' }}
            labelStyle={{ color: '#00ffff' }}
          />
          <Area 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#00ffff" 
            fill="#00ffff30"
            strokeWidth={2}
            name="Accuracy (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'

export default function SupabaseCheck() {
  const [status, setStatus] = useState<{
    url: boolean
    anon: boolean
    callback: string
  } | null>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setStatus({
      url: !!url && url.includes('supabase.co'),
      anon: !!anon && anon.length > 100,
      callback: `${url}/auth/v1/callback`
    })
  }, [])

  if (!status) return null

  return (
    <div className="fixed top-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs max-w-sm">
      <h3 className="text-neon-green font-bold mb-2">Supabase Config Check</h3>
      <div className="space-y-1">
        <div className={status.url ? 'text-green-400' : 'text-red-400'}>
          ✓ URL: {status.url ? 'Valid' : 'Invalid'}
        </div>
        <div className={status.anon ? 'text-green-400' : 'text-red-400'}>
          ✓ Anon Key: {status.anon ? 'Present' : 'Missing'}
        </div>
        <div className="text-gray-400 text-[10px] mt-2">
          Expected callback URL for X:
          <div className="text-blue-400 break-all">{status.callback}</div>
        </div>
      </div>
    </div>
  )
}
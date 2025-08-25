'use client'

import { useEffect, useState } from 'react'

interface DebugInfo {
  timestamp: string
  stage: string
  error?: any
  [key: string]: any
}

export default function OAuthDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([])
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Check localStorage for OAuth debug info
    const items = [
      'oauth_debug',
      'oauth_error',
      'oauth_response',
      'oauth_catch_error',
      'oauth_redirect'
    ]

    const debugData: DebugInfo[] = []

    items.forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          const parsed = JSON.parse(item)
          debugData.push({ ...parsed, key })
        } catch (e) {
          debugData.push({ 
            key, 
            value: item,
            timestamp: new Date().toISOString(),
            stage: 'parse_error'
          })
        }
      }
    })

    if (debugData.length > 0) {
      setDebugInfo(debugData)
      setShowDebug(true)
    }
  }, [])

  const clearDebugInfo = () => {
    const items = [
      'oauth_debug',
      'oauth_error',
      'oauth_response',
      'oauth_catch_error',
      'oauth_redirect'
    ]
    items.forEach(key => localStorage.removeItem(key))
    setDebugInfo([])
    setShowDebug(false)
  }

  if (!showDebug || debugInfo.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-2xl bg-gray-900 border border-red-500 rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-red-500 font-bold">OAuth Debug Info</h3>
        <button
          onClick={clearDebugInfo}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 text-xs">
        {debugInfo.map((info, index) => (
          <div key={index} className="bg-black p-2 rounded border border-gray-700">
            <div className="text-green-400">Stage: {info.stage}</div>
            <div className="text-gray-400">Time: {info.timestamp}</div>
            {info.error && (
              <div className="text-red-400 mt-1">
                Error: {typeof info.error === 'string' ? info.error : JSON.stringify(info.error, null, 2)}
              </div>
            )}
            {info.url && (
              <div className="text-blue-400 mt-1 break-all">
                URL: {info.url}
              </div>
            )}
            <details className="mt-1">
              <summary className="text-gray-500 cursor-pointer">Full Data</summary>
              <pre className="text-gray-300 mt-1 text-[10px] overflow-x-auto">
                {JSON.stringify(info, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-gray-500">
        This debug info is stored in localStorage. Click "Clear" to remove it.
      </div>
    </div>
  )
}
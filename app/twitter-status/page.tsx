'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TwitterStatus() {
  const [status, setStatus] = useState<any>({
    loading: true,
    configCheck: null,
    oauthUrlCheck: null,
    apiCheck: null,
  })

  useEffect(() => {
    checkEverything()
  }, [])

  const checkEverything = async () => {
    setStatus({ loading: true })
    
    const results: any = {}
    
    // 1. Check Management API config
    try {
      const res = await fetch('/api/check-twitter')
      const data = await res.json()
      results.apiCheck = data
    } catch (err) {
      results.apiCheck = { error: 'Failed to check API config' }
    }
    
    // 2. Check OAuth URL generation
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      })
      
      if (error) {
        results.oauthUrlCheck = { error: error.message }
      } else if (data?.url) {
        const url = data.url
        results.oauthUrlCheck = {
          url,
          isTwitter: url.includes('twitter.com') || url.includes('api.x.com') || url.includes('x.com'),
          isSupabase: url.includes('supabase.co'),
        }
      }
    } catch (err) {
      results.oauthUrlCheck = { error: (err as Error).message }
    }
    
    // 3. Overall status
    results.configCheck = {
      twitterEnabled: results.apiCheck?.twitter_enabled,
      hasCredentials: results.apiCheck?.twitter_client_id === 'Configured' && results.apiCheck?.twitter_secret === 'Configured',
      urlPointsToTwitter: results.oauthUrlCheck?.isTwitter,
    }
    
    setStatus({
      loading: false,
      ...results
    })
  }

  if (status.loading) {
    return (
      <div className="min-h-screen bg-black text-neon-green flex items-center justify-center">
        <div className="text-2xl animate-pulse">Checking Twitter OAuth Status...</div>
      </div>
    )
  }

  const isFullyWorking = status.configCheck?.twitterEnabled && 
                        status.configCheck?.hasCredentials && 
                        status.configCheck?.urlPointsToTwitter

  return (
    <div className="min-h-screen bg-black text-neon-green p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Twitter OAuth Complete Status Check</h1>
        
        {/* Overall Status */}
        <div className={`p-6 rounded-lg border-2 ${isFullyWorking ? 'bg-green-900/20 border-neon-green' : 'bg-red-900/20 border-red-500'}`}>
          <h2 className="text-2xl font-bold mb-2">
            {isFullyWorking ? '✅ Twitter OAuth is FULLY CONFIGURED!' : '❌ Twitter OAuth is NOT ready'}
          </h2>
          {isFullyWorking && (
            <p className="text-sm">You can now use "Sign in with X" on the main page!</p>
          )}
        </div>

        {/* Configuration Check */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">1. Management API Configuration</h3>
          <div className="space-y-2 text-sm">
            <div>Twitter Enabled: {status.apiCheck?.twitter_enabled ? '✅ Yes' : '❌ No'}</div>
            <div>Client ID: {status.apiCheck?.twitter_client_id || '❌ Missing'}</div>
            <div>Client Secret: {status.apiCheck?.twitter_secret || '❌ Missing'}</div>
            {status.apiCheck?.error && (
              <div className="text-red-400">Error: {status.apiCheck.error}</div>
            )}
          </div>
        </div>

        {/* OAuth URL Check */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">2. OAuth URL Generation</h3>
          <div className="space-y-2">
            {status.oauthUrlCheck?.url ? (
              <>
                <div className="text-sm">
                  <span>Points to Twitter: </span>
                  <span className={status.oauthUrlCheck.isTwitter ? 'text-neon-green' : 'text-red-400'}>
                    {status.oauthUrlCheck.isTwitter ? '✅ Yes' : '❌ No (still Supabase)'}
                  </span>
                </div>
                <div className="bg-black p-3 rounded text-xs break-all">
                  {status.oauthUrlCheck.url}
                </div>
              </>
            ) : (
              <div className="text-red-400">Failed to generate OAuth URL</div>
            )}
            {status.oauthUrlCheck?.error && (
              <div className="text-red-400">Error: {status.oauthUrlCheck.error}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={checkEverything}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh Status
          </button>
          
          {isFullyWorking && (
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition-colors ml-4"
            >
              Go to Game & Sign In
            </button>
          )}
        </div>

        {/* Help Section */}
        {!isFullyWorking && (
          <div className="bg-gray-900 border border-yellow-600 rounded-lg p-6">
            <h3 className="text-yellow-500 font-semibold mb-2">What to do:</h3>
            <ol className="text-sm text-gray-300 space-y-2">
              <li>1. Wait 30-60 seconds for configuration to propagate</li>
              <li>2. Click "Refresh Status" to check again</li>
              <li>3. If still not working after 2 minutes, the Management API update may need to be re-run</li>
              <li>4. Make sure your Twitter app uses OAuth 1.0a (API Key/Secret, not OAuth 2.0)</li>
            </ol>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-8">
          <p>Debug Info:</p>
          <pre className="bg-black p-2 rounded mt-2">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
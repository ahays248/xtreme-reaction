'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestTwitterAuth() {
  const [status, setStatus] = useState<string>('Checking configuration...')
  const [oauthUrl, setOauthUrl] = useState<string>('')
  const [isTwitterEnabled, setIsTwitterEnabled] = useState<boolean>(false)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const supabase = createClient()
      
      // Try to generate OAuth URL without redirecting
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        setStatus(`❌ Error: ${error.message}`)
        return
      }

      if (data?.url) {
        setOauthUrl(data.url)
        
        // Check if URL points to Twitter
        const isTwitter = data.url.includes('twitter.com') || data.url.includes('api.x.com') || data.url.includes('x.com')
        setIsTwitterEnabled(isTwitter)
        
        if (isTwitter) {
          setStatus('✅ Twitter OAuth is WORKING! The URL correctly points to Twitter/X.')
        } else {
          setStatus('⚠️ OAuth URL still points to Supabase. Configuration may need more time to propagate.')
        }
      }
    } catch (err) {
      setStatus(`❌ Unexpected error: ${err}`)
    }
  }

  const testRealLogin = () => {
    if (oauthUrl) {
      window.location.href = oauthUrl
    }
  }

  return (
    <div className="min-h-screen bg-black text-neon-green p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Twitter OAuth Test</h1>
        
        <div className="bg-gray-900 border border-neon-green rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Configuration Status:</h2>
            <p className="text-sm">{status}</p>
          </div>

          {oauthUrl && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Generated OAuth URL:</h3>
                <div className="bg-black p-3 rounded text-xs break-all">
                  {oauthUrl}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  {isTwitterEnabled 
                    ? "Twitter OAuth is configured! Click below to test the actual login flow."
                    : "The OAuth URL is still pointing to Supabase. Wait 30-60 seconds and refresh this page."}
                </p>
                
                {isTwitterEnabled && (
                  <button
                    onClick={testRealLogin}
                    className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                  >
                    Test Real Twitter Login
                  </button>
                )}
              </div>

              <button
                onClick={checkConfiguration}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh Status
              </button>
            </>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">What this test does:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Checks if Twitter OAuth is properly configured in Supabase</li>
            <li>• Generates an OAuth URL without redirecting</li>
            <li>• Verifies if the URL points to Twitter (success) or Supabase (not ready)</li>
            <li>• Allows you to test the actual login flow once configured</li>
          </ul>
        </div>

        <div className="mt-4">
          <a href="/" className="text-sm text-gray-400 hover:text-neon-green">
            ← Back to Game
          </a>
        </div>
      </div>
    </div>
  )
}
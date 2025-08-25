'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OAuthVerify() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testOAuth = async () => {
    setLoading(true)
    setTestResult('Testing OAuth configuration...')
    
    try {
      const supabase = createClient()
      
      // Attempt to initiate OAuth with skipBrowserRedirect to capture URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true, // Don't redirect, just get the URL
        },
      })
      
      if (error) {
        setTestResult(`❌ Error: ${error.message}`)
        return
      }
      
      if (data?.url) {
        // Check if URL contains twitter.com or api.twitter.com
        const isTwitterUrl = data.url.includes('twitter.com') || data.url.includes('api.x.com')
        
        if (isTwitterUrl) {
          setTestResult(`✅ SUCCESS! OAuth is redirecting to Twitter!\n\nOAuth URL: ${data.url}\n\nYou can now click "Sign in with X" on the main page to authenticate!`)
        } else {
          setTestResult(`⚠️ Still redirecting to Supabase:\n${data.url}\n\nThe configuration may need more time to propagate. Wait 60 seconds and try again.`)
        }
      }
    } catch (err) {
      setTestResult(`❌ Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-neon-green rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neon-green mb-4">OAuth Verification</h2>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Testing if Twitter OAuth is properly configured after Management API update.
          </p>
          
          <button
            onClick={testOAuth}
            disabled={loading}
            className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test OAuth Configuration'}
          </button>
          
          {testResult && (
            <pre className="bg-black p-4 rounded-lg text-sm text-green-400 whitespace-pre-wrap">
              {testResult}
            </pre>
          )}
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              This test checks if the OAuth URL now points to Twitter instead of Supabase.
              If successful, the main "Sign in with X" button should work properly.
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  )
}
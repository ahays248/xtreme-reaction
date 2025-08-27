'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestOAuthPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const testOAuth = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const supabase = createClient()
      
      // Test OAuth URL generation
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true // Don't redirect, just get the URL
        }
      })
      
      if (error) {
        setError(error.message)
        console.error('OAuth Error:', error)
      } else {
        const oauthUrl = data?.url || 'No URL returned'
        
        // Analyze the URL
        const urlAnalysis = {
          url: oauthUrl,
          isTwitterUrl: oauthUrl.includes('twitter.com') || oauthUrl.includes('x.com'),
          isSupabaseUrl: oauthUrl.includes('supabase.co'),
          urlParts: oauthUrl.split('?')[0],
          provider: data?.provider,
          timestamp: new Date().toISOString()
        }
        
        setResult(urlAnalysis)
        console.log('OAuth Test Result:', urlAnalysis)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Test Error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const checkAuthSettings = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      // Check public auth settings
      const response = await fetch('https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/settings')
      const settings = await response.json()
      
      setResult({
        providers: settings.external || {},
        twitter: settings.external?.twitter || false,
        hasTwitter: !!settings.external?.twitter,
        timestamp: new Date().toISOString()
      })
      
      console.log('Auth Settings:', settings)
    } catch (err: any) {
      setError(err.message)
      console.error('Settings Error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const attemptDirectAuth = () => {
    // Try to construct OAuth URL manually
    const baseUrl = 'https://xhcfjhzfyozzuicubqmh.supabase.co'
    const redirectTo = encodeURIComponent(`${window.location.origin}/auth/callback`)
    const oauthUrl = `${baseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${redirectTo}`
    
    setResult({
      action: 'Manual redirect attempt',
      url: oauthUrl,
      message: 'Opening in new tab to see what happens...'
    })
    
    // Open in new tab to see the result
    window.open(oauthUrl, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-black text-green-500 p-8">
      <h1 className="text-3xl font-bold mb-8">OAuth Debug Test Page</h1>
      
      <div className="space-y-4 max-w-2xl">
        <button
          onClick={testOAuth}
          disabled={loading}
          className="px-6 py-3 bg-green-900 hover:bg-green-800 disabled:bg-gray-800 rounded"
        >
          {loading ? 'Testing...' : 'Test OAuth URL Generation'}
        </button>
        
        <button
          onClick={checkAuthSettings}
          disabled={loading}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-800 rounded ml-4"
        >
          {loading ? 'Checking...' : 'Check Auth Settings'}
        </button>
        
        <button
          onClick={attemptDirectAuth}
          disabled={loading}
          className="px-6 py-3 bg-purple-900 hover:bg-purple-800 disabled:bg-gray-800 rounded ml-4"
        >
          {loading ? 'Opening...' : 'Attempt Direct Auth'}
        </button>
      </div>
      
      {error && (
        <div className="mt-8 p-4 bg-red-900 rounded">
          <h2 className="text-xl font-bold mb-2">Error:</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-8 p-4 bg-gray-900 rounded">
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.url && (
            <div className="mt-4">
              <h3 className="font-bold">OAuth URL:</h3>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 underline break-all"
              >
                {result.url}
              </a>
              
              <div className="mt-2">
                Status: {result.isTwitterUrl ? '✅ Points to Twitter' : '❌ Points to Supabase'}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-900 rounded">
        <h2 className="text-xl font-bold mb-2">Known Information:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Project ID: xhcfjhzfyozzuicubqmh</li>
          <li>Twitter Client ID: iN3FERNVeWJ24G6fvgn1meSzj</li>
          <li>Callback URL: {window.location.origin}/auth/callback</li>
          <li>Provider: twitter (OAuth 1.0a)</li>
        </ul>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TestResult {
  name: string
  status: 'pending' | 'testing' | 'success' | 'error'
  message?: string
  details?: any
}

export default function OAuthDiagnostic() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  // Check for errors in URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('auth_error')
    if (authError) {
      setIsOpen(true)
    }
  }, [])
  
  const runDiagnostics = async () => {
    setIsRunning(true)
    const results: TestResult[] = []
    
    // Test 1: Check environment configuration
    results.push({ name: 'Environment Configuration', status: 'testing' })
    setTestResults([...results])
    
    try {
      const envTest = {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
      
      if (envTest.supabase_url && envTest.has_anon_key) {
        results[0] = {
          ...results[0],
          status: 'success',
          message: 'Environment variables configured',
          details: envTest,
        }
      } else {
        results[0] = {
          ...results[0],
          status: 'error',
          message: 'Missing environment variables',
          details: envTest,
        }
      }
    } catch (err) {
      results[0] = {
        ...results[0],
        status: 'error',
        message: (err as Error).message,
      }
    }
    setTestResults([...results])
    
    // Test 2: Server-side OAuth status
    results.push({ name: 'Server OAuth Status', status: 'testing' })
    setTestResults([...results])
    
    try {
      const response = await fetch('/api/auth/test?action=status')
      const data = await response.json()
      
      results[1] = {
        ...results[1],
        status: data.success ? 'success' : 'error',
        message: data.success ? 'Server configuration valid' : 'Server configuration invalid',
        details: data,
      }
    } catch (err) {
      results[1] = {
        ...results[1],
        status: 'error',
        message: 'Failed to check server status',
        details: (err as Error).message,
      }
    }
    setTestResults([...results])
    
    // Test 3: OAuth Initiation Test
    results.push({ name: 'OAuth Initiation', status: 'testing' })
    setTestResults([...results])
    
    try {
      const response = await fetch('/api/auth/test?action=initiate')
      const data = await response.json()
      
      if (data.success && data.url_analysis?.is_twitter_url) {
        results[2] = {
          ...results[2],
          status: 'success',
          message: 'Twitter OAuth properly configured',
          details: data.url_analysis,
        }
      } else if (data.success && data.url_analysis?.is_supabase_url) {
        results[2] = {
          ...results[2],
          status: 'error',
          message: 'Twitter provider not enabled in Supabase',
          details: {
            ...data.url_analysis,
            action_required: 'Enable Twitter provider in Supabase Dashboard',
          },
        }
      } else {
        results[2] = {
          ...results[2],
          status: 'error',
          message: data.error || 'OAuth initiation failed',
          details: data.details || data.troubleshooting,
        }
      }
    } catch (err) {
      results[2] = {
        ...results[2],
        status: 'error',
        message: 'Failed to test OAuth initiation',
        details: (err as Error).message,
      }
    }
    setTestResults([...results])
    
    // Test 4: Check all providers
    results.push({ name: 'Provider Configuration', status: 'testing' })
    setTestResults([...results])
    
    try {
      const response = await fetch('/api/auth/test?action=providers')
      const data = await response.json()
      
      if (data.success) {
        const twitterConfigured = data.providers?.twitter?.configured
        results[3] = {
          ...results[3],
          status: twitterConfigured ? 'success' : 'error',
          message: twitterConfigured 
            ? `Twitter enabled (${data.summary.configured_count} providers total)`
            : 'Twitter provider is NOT enabled',
          details: data.providers,
        }
      } else {
        results[3] = {
          ...results[3],
          status: 'error',
          message: 'Failed to check providers',
          details: data,
        }
      }
    } catch (err) {
      results[3] = {
        ...results[3],
        status: 'error',
        message: 'Failed to check provider configuration',
        details: (err as Error).message,
      }
    }
    setTestResults([...results])
    
    // Test 5: Comprehensive debug info
    results.push({ name: 'Debug Analysis', status: 'testing' })
    setTestResults([...results])
    
    try {
      const response = await fetch('/api/auth/test?action=debug')
      const data = await response.json()
      
      if (data.success) {
        const hasIssues = data.debug_info?.recommendations?.length > 0
        results[4] = {
          ...results[4],
          status: hasIssues ? 'error' : 'success',
          message: hasIssues 
            ? `Issues found: ${data.debug_info.recommendations.join(', ')}`
            : 'No issues detected',
          details: data.debug_info,
        }
      } else {
        results[4] = {
          ...results[4],
          status: 'error',
          message: 'Debug analysis failed',
          details: data,
        }
      }
    } catch (err) {
      results[4] = {
        ...results[4],
        status: 'error',
        message: 'Failed to run debug analysis',
        details: (err as Error).message,
      }
    }
    setTestResults([...results])
    
    setIsRunning(false)
  }
  
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'testing': return '🔄'
      case 'success': return '✅'
      case 'error': return '❌'
    }
  }
  
  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400'
      case 'testing': return 'text-yellow-400'
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
    }
  }
  
  return (
    <>
      {/* Diagnostic Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg z-50 text-sm font-mono"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔧 OAuth Diagnostics
      </motion.button>
      
      {/* Diagnostic Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-2xl z-50 flex flex-col max-w-4xl mx-auto my-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-purple-400">OAuth Diagnostic Tool</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* URL Error Display */}
              {(() => {
                const params = new URLSearchParams(window.location.search)
                const authError = params.get('auth_error')
                if (authError) {
                  return (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded">
                      <div className="text-red-400 font-bold mb-1">Authentication Error</div>
                      <div className="text-sm text-red-300">{authError}</div>
                    </div>
                  )
                }
                return null
              })()}
              
              {/* Run Diagnostics Button */}
              <div className="mb-4">
                <button
                  onClick={runDiagnostics}
                  disabled={isRunning}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-mono transition-colors"
                >
                  {isRunning ? 'Running Tests...' : 'Run Diagnostics'}
                </button>
              </div>
              
              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Test Results</h3>
                  {testResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/50 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getStatusIcon(result.status)}</span>
                        <span className={`font-mono ${getStatusColor(result.status)}`}>
                          {result.name}
                        </span>
                      </div>
                      {result.message && (
                        <div className="text-sm text-gray-300 ml-7">{result.message}</div>
                      )}
                      {result.details && (
                        <details className="ml-7 mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                            View Details
                          </summary>
                          <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold text-purple-300 mb-2">How to Fix Twitter OAuth</h3>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. Go to <a href="https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/auth/providers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase Auth Providers</a></li>
                  <li>2. Find "Twitter" (not Twitter Legacy) and enable it</li>
                  <li>3. Add your X API credentials (Client ID and Secret)</li>
                  <li>4. Save the configuration</li>
                  <li>5. Wait 30 seconds for changes to propagate</li>
                  <li>6. Run diagnostics again to verify</li>
                </ol>
              </div>
              
              {/* Edge Function Info */}
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Edge Function Testing</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Deploy the edge function to test OAuth directly from Supabase:
                </p>
                <code className="block p-2 bg-black rounded text-xs text-green-400">
                  supabase functions deploy test-twitter-oauth --project-ref xhcfjhzfyozzuicubqmh
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  Then test at: https://xhcfjhzfyozzuicubqmh.supabase.co/functions/v1/test-twitter-oauth
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
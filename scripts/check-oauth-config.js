#!/usr/bin/env node

/**
 * Check OAuth configuration in Supabase
 * This script checks various endpoints to understand OAuth setup
 */

async function checkOAuthConfig() {
  const PROJECT_URL = 'https://xhcfjhzfyozzuicubqmh.supabase.co'
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY2ZqaHpmeW96enVpY3VicW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjgyOTQsImV4cCI6MjA3MTQwNDI5NH0.YvXw2sAxjg28t5E8MXGArbFRRpFFdpjyBAE2APYlv7g'
  
  console.log('Checking OAuth Configuration...\n')
  
  // 1. Check auth settings endpoint
  console.log('1. Checking /auth/v1/settings:')
  try {
    const settingsResponse = await fetch(`${PROJECT_URL}/auth/v1/settings`, {
      headers: {
        'apikey': ANON_KEY,
      }
    })
    const settings = await settingsResponse.json()
    console.log('Auth Settings:', JSON.stringify(settings, null, 2))
    
    if (settings.external?.twitter) {
      console.log('✅ Twitter provider appears to be enabled')
    } else {
      console.log('❌ Twitter provider not found in settings')
    }
  } catch (error) {
    console.error('Error fetching settings:', error.message)
  }
  
  console.log('\n2. Testing OAuth URL generation:')
  // 2. Try to get OAuth URL
  try {
    const authUrl = `${PROJECT_URL}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}`
    console.log('OAuth URL would be:', authUrl)
    
    // Try to fetch with HEAD request to see response
    const response = await fetch(authUrl, {
      method: 'HEAD',
      redirect: 'manual'
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:')
    console.log('  Location:', response.headers.get('location'))
    
    const location = response.headers.get('location')
    if (location && (location.includes('twitter.com') || location.includes('x.com'))) {
      console.log('✅ Redirects to Twitter/X')
    } else if (location) {
      console.log('❌ Redirects to:', location)
    } else {
      console.log('❌ No redirect found')
    }
  } catch (error) {
    console.error('Error testing OAuth:', error.message)
  }
  
  console.log('\n3. Checking provider metadata:')
  // 3. Try to get provider info directly
  try {
    const providersUrl = `${PROJECT_URL}/auth/v1/providers`
    const response = await fetch(providersUrl, {
      headers: {
        'apikey': ANON_KEY,
      }
    })
    
    if (response.ok) {
      const providers = await response.json()
      console.log('Available providers:', providers)
    } else {
      console.log('Provider endpoint returned:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error fetching providers:', error.message)
  }
}

checkOAuthConfig().catch(console.error)
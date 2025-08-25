import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Twitter OAuth is enabled via Management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_MANAGEMENT_TOKEN || 'sbp_4dd96bebb1eb7b8c1232f5ef1ddf89848a86632d'}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch config',
        status: response.status 
      })
    }

    const config = await response.json()
    
    return NextResponse.json({
      twitter_enabled: config.external_twitter_enabled || false,
      twitter_client_id: config.external_twitter_client_id ? 'Configured' : 'Not configured',
      twitter_secret: config.external_twitter_secret ? 'Configured' : 'Not configured',
      raw_config: {
        external_twitter_enabled: config.external_twitter_enabled,
        has_client_id: !!config.external_twitter_client_id,
        has_secret: !!config.external_twitter_secret,
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check Twitter config',
      details: (error as Error).message 
    })
  }
}
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check public auth settings instead of Management API
    const response = await fetch(
      `https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/settings`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch settings',
        status: response.status 
      })
    }

    const settings = await response.json()
    
    // Check if twitter is in the external providers
    const twitterEnabled = settings?.external?.twitter === true
    
    return NextResponse.json({
      twitter_enabled: twitterEnabled,
      twitter_client_id: twitterEnabled ? 'Check Dashboard' : 'Not configured',
      twitter_secret: twitterEnabled ? 'Check Dashboard' : 'Not configured',
      public_settings: {
        providers: settings?.external || {},
        twitter_specifically: settings?.external?.twitter
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check Twitter config',
      details: (error as Error).message 
    })
  }
}
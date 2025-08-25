import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const state = requestUrl.searchParams.get('state')
  
  // Store detailed debug info in cookies for client-side debugging
  const cookieStore = await cookies()
  const debugInfo = {
    timestamp: new Date().toISOString(),
    hasCode: !!code,
    hasState: !!state,
    error,
    error_description,
    url: requestUrl.toString()
  }
  
  // Log callback parameters for debugging
  console.log('Auth callback received:', debugInfo)
  
  // Store debug info in cookie for client to read
  cookieStore.set('oauth_callback_debug', JSON.stringify(debugInfo), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 // expires in 1 minute
  })

  // Handle errors from OAuth provider
  if (error) {
    console.error('OAuth provider error:', error, error_description)
    
    // Common error checks
    if (error === 'access_denied') {
      console.log('User denied access to their X account')
    } else if (error === 'invalid_request') {
      console.error('Invalid OAuth request - check Twitter app configuration')
    }
    
    // Redirect to home with error in query params
    const redirectUrl = new URL('/', requestUrl.origin)
    redirectUrl.searchParams.set('auth_error', error_description || error)
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      // Create Supabase client with proper configuration for server-side
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            flowType: 'pkce',
            autoRefreshToken: false,
            detectSessionInUrl: false,
            persistSession: false
          }
        }
      )
      
      // Exchange code for session
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', {
          message: sessionError.message,
          status: sessionError.status,
          name: sessionError.name
        })
        
        const redirectUrl = new URL('/', requestUrl.origin)
        redirectUrl.searchParams.set('auth_error', `Session error: ${sessionError.message}`)
        return NextResponse.redirect(redirectUrl)
      }
      
      if (data?.session) {
        console.log('Session created successfully:', {
          user_id: data.session.user?.id,
          provider: data.session.user?.app_metadata?.provider,
          expires_at: data.session.expires_at
        })
        
        // Set session cookies for the client
        const response = NextResponse.redirect(new URL('/', requestUrl.origin))
        
        // Set both access token and refresh token as cookies
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        
        response.cookies.set('sb-refresh-token', data.session.refresh_token || '', {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        
        // Also store success info for debugging
        response.cookies.set('oauth_success', 'true', {
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 // expires in 1 minute
        })
        
        return response
      } else {
        console.error('No session returned from exchangeCodeForSession')
        const redirectUrl = new URL('/', requestUrl.origin)
        redirectUrl.searchParams.set('auth_error', 'No session created')
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('Unexpected error during auth:', err)
      const redirectUrl = new URL('/', requestUrl.origin)
      redirectUrl.searchParams.set('auth_error', `Authentication failed: ${(err as Error).message}`)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // No code provided - invalid callback
  console.error('No authorization code provided in callback')
  const redirectUrl = new URL('/', requestUrl.origin)
  redirectUrl.searchParams.set('auth_error', 'No authorization code received')
  return NextResponse.redirect(redirectUrl)
}
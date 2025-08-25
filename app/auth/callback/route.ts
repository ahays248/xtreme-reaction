import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  // Log callback parameters for debugging
  console.log('Auth callback received:', {
    hasCode: !!code,
    error,
    error_description,
    url: requestUrl.toString()
  })

  // Handle errors from OAuth provider
  if (error) {
    console.error('OAuth error:', error, error_description)
    // Redirect to home with error in query params
    const redirectUrl = new URL('/', requestUrl.origin)
    redirectUrl.searchParams.set('auth_error', error_description || error)
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      // Create Supabase client directly for server-side
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        const redirectUrl = new URL('/', requestUrl.origin)
        redirectUrl.searchParams.set('auth_error', 'Failed to create session')
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('Unexpected error during auth:', err)
      const redirectUrl = new URL('/', requestUrl.origin)
      redirectUrl.searchParams.set('auth_error', 'Authentication failed')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect back to the main page after successful auth
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
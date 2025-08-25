import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action') || 'status'
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing Supabase environment variables',
    }, { status: 500 })
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    }
  })
  
  switch (action) {
    case 'status': {
      // Check overall OAuth configuration status
      return NextResponse.json({
        success: true,
        environment: {
          supabase_url: supabaseUrl,
          has_anon_key: !!supabaseAnonKey,
          anon_key_preview: supabaseAnonKey.substring(0, 20) + '...',
          node_env: process.env.NODE_ENV,
        },
        urls: {
          callback_url: `${url.origin}/auth/callback`,
          supabase_callback: `${supabaseUrl}/auth/v1/callback`,
          test_url: url.href,
        },
        timestamp: new Date().toISOString(),
      })
    }
    
    case 'initiate': {
      // Try to initiate OAuth flow
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: `${url.origin}/auth/callback`,
            skipBrowserRedirect: true, // Get URL without redirecting
          },
        })
        
        if (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to initiate OAuth',
            details: {
              message: error.message,
              status: error.status,
              name: error.name,
            },
            troubleshooting: {
              check_1: 'Ensure Twitter provider is enabled in Supabase Dashboard',
              check_2: 'Verify API credentials are correct',
              check_3: 'Check callback URL is whitelisted in Twitter app',
            },
          }, { status: 400 })
        }
        
        // Analyze the OAuth URL
        const oauthUrl = data?.url || ''
        const urlAnalysis = {
          has_url: !!oauthUrl,
          is_twitter_url: oauthUrl.includes('twitter.com') || oauthUrl.includes('x.com'),
          is_supabase_url: oauthUrl.includes('supabase.co'),
          url_preview: oauthUrl.substring(0, 100) + '...',
        }
        
        return NextResponse.json({
          success: true,
          oauth_initiated: true,
          url_analysis: urlAnalysis,
          provider: data?.provider,
          full_url: oauthUrl,
        })
      } catch (err) {
        return NextResponse.json({
          success: false,
          error: 'Exception during OAuth initiation',
          details: (err as Error).message,
          stack: (err as Error).stack,
        }, { status: 500 })
      }
    }
    
    case 'providers': {
      // Test multiple providers to see which are configured
      const providers = ['twitter', 'google', 'github', 'facebook', 'discord']
      const results: Record<string, any> = {}
      
      for (const provider of providers) {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider as any,
            options: {
              redirectTo: `${url.origin}/auth/callback`,
              skipBrowserRedirect: true,
            },
          })
          
          results[provider] = {
            configured: !error && !!data?.url,
            has_url: !!data?.url,
            error: error?.message || null,
            url_type: data?.url ? (
              data.url.includes(provider) ? 'direct' : 
              data.url.includes('supabase.co') ? 'supabase' : 
              'unknown'
            ) : null,
          }
        } catch (err) {
          results[provider] = {
            configured: false,
            error: (err as Error).message,
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        providers: results,
        summary: {
          configured_count: Object.values(results).filter(r => r.configured).length,
          twitter_status: results.twitter?.configured ? 'enabled' : 'disabled',
        },
      })
    }
    
    case 'debug': {
      // Comprehensive debug information
      try {
        // Test Twitter OAuth
        const { data: twitterData, error: twitterError } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: `${url.origin}/auth/callback`,
            skipBrowserRedirect: true,
          },
        })
        
        // Test auth health endpoint
        let authHealth = null
        try {
          const healthResponse = await fetch(`${supabaseUrl}/auth/v1/health`)
          authHealth = {
            status: healthResponse.status,
            ok: healthResponse.ok,
            statusText: healthResponse.statusText,
          }
        } catch (err) {
          authHealth = { error: (err as Error).message }
        }
        
        return NextResponse.json({
          success: true,
          debug_info: {
            timestamp: new Date().toISOString(),
            environment: {
              node_env: process.env.NODE_ENV,
              vercel_env: process.env.VERCEL_ENV,
              deployment_url: process.env.VERCEL_URL,
            },
            supabase: {
              url: supabaseUrl,
              auth_health: authHealth,
            },
            twitter_oauth: {
              can_initiate: !twitterError,
              has_oauth_url: !!twitterData?.url,
              error: twitterError ? {
                message: twitterError.message,
                status: twitterError.status,
              } : null,
              url_analysis: twitterData?.url ? {
                starts_with_supabase: twitterData.url.startsWith(supabaseUrl),
                contains_twitter: twitterData.url.includes('twitter'),
                contains_x: twitterData.url.includes('x.com'),
                length: twitterData.url.length,
              } : null,
            },
            recommendations: [
              !twitterError ? null : 'Enable Twitter provider in Supabase Dashboard',
              twitterData?.url?.includes('supabase.co') && !twitterData?.url?.includes('twitter') 
                ? 'Twitter provider may not be properly configured' : null,
              authHealth?.ok === false ? 'Supabase auth service may be down' : null,
            ].filter(Boolean),
          },
        })
      } catch (err) {
        return NextResponse.json({
          success: false,
          error: 'Debug failed',
          details: (err as Error).message,
        }, { status: 500 })
      }
    }
    
    default: {
      return NextResponse.json({
        success: true,
        message: 'OAuth Test API',
        available_actions: [
          'status - Check configuration status',
          'initiate - Test OAuth initiation',
          'providers - Test all providers',
          'debug - Comprehensive debug info',
        ],
        usage: 'Add ?action=<action_name> to the URL',
        current_url: url.href,
      })
    }
  }
}
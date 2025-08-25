import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    
    // Get Supabase URL and anon key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    console.log('Edge Function Environment:', {
      has_url: !!supabaseUrl,
      url_preview: supabaseUrl.substring(0, 30),
      has_key: !!supabaseAnonKey,
      key_length: supabaseAnonKey.length,
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test different aspects of OAuth
    switch (action) {
      case 'test-provider': {
        console.log('Testing Twitter provider...')
        
        // Test if Twitter provider is enabled by attempting to initiate OAuth
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
              redirectTo: 'https://www.xtremereaction.lol/auth/callback',
              skipBrowserRedirect: true, // Don't redirect, just get the URL
              scopes: 'tweet.read users.read', // Twitter OAuth 2.0 scopes
            },
          })
          
          console.log('OAuth Response:', {
            has_data: !!data,
            has_url: !!data?.url,
            has_error: !!error,
            error_message: error?.message,
          })
          
          if (error) {
            // Check if it's a provider not found error
            const isProviderError = error.message?.toLowerCase().includes('provider') || 
                                  error.message?.toLowerCase().includes('not found') ||
                                  error.message?.toLowerCase().includes('not enabled')
            
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Provider error',
                is_provider_error: isProviderError,
                details: {
                  message: error.message,
                  status: error.status,
                  name: error.name,
                  __typename: error.__typename,
                },
                diagnostic: {
                  likely_cause: isProviderError ? 
                    'Twitter provider not enabled in Supabase' : 
                    'Configuration or credential issue',
                  action_required: isProviderError ?
                    'Enable Twitter provider in Supabase Dashboard' :
                    'Check API credentials and callback URLs',
                },
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
              }
            )
          }
          
          // Analyze the OAuth URL
          const oauthUrl = data?.url || ''
          const urlAnalysis = {
            has_url: !!oauthUrl,
            url_length: oauthUrl.length,
            starts_with_supabase: oauthUrl.startsWith(supabaseUrl),
            contains_twitter: oauthUrl.includes('twitter.com'),
            contains_x: oauthUrl.includes('x.com'),
            contains_api_twitter: oauthUrl.includes('api.twitter.com'),
            contains_authorize: oauthUrl.includes('authorize'),
            url_preview: oauthUrl.substring(0, 100),
          }
          
          // Check if it's a valid Twitter OAuth URL
          const isValidTwitterUrl = urlAnalysis.contains_twitter || 
                                  urlAnalysis.contains_x || 
                                  urlAnalysis.contains_api_twitter
          
          // If URL only contains Supabase, provider is not properly configured
          const isOnlySupabaseUrl = urlAnalysis.starts_with_supabase && !isValidTwitterUrl
          
          return new Response(
            JSON.stringify({
              success: !isOnlySupabaseUrl,
              provider_enabled: isValidTwitterUrl,
              url_analysis: urlAnalysis,
              oauth_url: oauthUrl,
              provider: data?.provider,
              diagnostic: {
                status: isValidTwitterUrl ? 'working' : 
                       isOnlySupabaseUrl ? 'not_configured' : 
                       'unknown',
                message: isValidTwitterUrl ? 
                  'Twitter OAuth is properly configured' :
                  isOnlySupabaseUrl ? 
                  'Twitter provider exists but not redirecting to Twitter - check credentials' :
                  'Unable to determine OAuth status',
              },
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (err) {
          console.error('Provider test error:', err)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to test provider',
              details: (err as Error).message,
              stack: (err as Error).stack,
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          )
        }
      }
      
      case 'direct-test': {
        // Try to make a direct request to Supabase auth endpoint
        console.log('Direct auth endpoint test...')
        
        const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=twitter&redirect_to=${encodeURIComponent('https://www.xtremereaction.lol/auth/callback')}`
        
        try {
          const response = await fetch(authUrl, {
            method: 'GET',
            headers: {
              'apikey': supabaseAnonKey,
            },
          })
          
          const responseText = await response.text()
          
          return new Response(
            JSON.stringify({
              success: response.ok,
              status: response.status,
              status_text: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              response_preview: responseText.substring(0, 500),
              is_404: response.status === 404,
              diagnostic: {
                message: response.status === 404 ? 
                  'Twitter provider endpoint not found - provider is NOT enabled' :
                  response.ok ? 
                  'Endpoint exists - check response for redirect' :
                  'Endpoint error - check status code',
              },
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (err) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Direct test failed',
              details: (err as Error).message,
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          )
        }
      }
      
      case 'check-health': {
        // Check auth service health
        console.log('Checking auth service health...')
        
        try {
          const healthUrl = `${supabaseUrl}/auth/v1/health`
          const response = await fetch(healthUrl)
          const healthData = await response.text()
          
          return new Response(
            JSON.stringify({
              success: true,
              auth_healthy: response.ok,
              status: response.status,
              health_response: healthData,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (err) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Health check failed',
              details: (err as Error).message,
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            }
          )
        }
      }
      
      case 'test-all-providers': {
        // Test all common providers
        console.log('Testing all providers...')
        
        const providers = ['twitter', 'google', 'github', 'facebook', 'discord', 'linkedin']
        const results: Record<string, any> = {}
        
        for (const provider of providers) {
          try {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: provider as any,
              options: {
                redirectTo: 'https://www.xtremereaction.lol/auth/callback',
                skipBrowserRedirect: true,
              },
            })
            
            const url = data?.url || ''
            results[provider] = {
              enabled: !error && !!url,
              has_url: !!url,
              redirects_to_provider: url.includes(provider) || 
                                    (provider === 'twitter' && (url.includes('x.com') || url.includes('twitter.com'))),
              error: error?.message,
              url_preview: url.substring(0, 50),
            }
          } catch (err) {
            results[provider] = {
              enabled: false,
              error: (err as Error).message,
            }
          }
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            providers: results,
            summary: {
              total_configured: Object.values(results).filter(r => r.enabled).length,
              twitter_status: results.twitter?.enabled ? 'enabled' : 'disabled',
              twitter_redirects: results.twitter?.redirects_to_provider ? 'yes' : 'no',
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default: {
        // Return available actions
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Twitter OAuth Edge Function Test',
            available_actions: [
              'test-provider - Test if Twitter provider is enabled and working',
              'direct-test - Direct auth endpoint test',
              'check-health - Check auth service health',
              'test-all-providers - Test all OAuth providers',
            ],
            usage: 'Add ?action=<action_name> to the URL',
            example: `${url.origin}${url.pathname}?action=test-provider`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
        stack: (error as Error).stack,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
# OAuth Fix - New Approach

**Date**: August 27, 2025
**Status**: Configuration method identified

## Problem Identified

The Twitter provider shows as enabled (`"twitter": true`) but the OAuth credentials are not configured. When accessing the OAuth URL, it redirects to "/" instead of Twitter/X.

## Solution: Use Environment Variables

The OAuth configuration needs to be set using GoTrue environment variables via Supabase secrets:

```bash
# Set the OAuth configuration via Supabase CLI secrets
~/.local/bin/supabase secrets set \
  GOTRUE_EXTERNAL_TWITTER_ENABLED=true \
  GOTRUE_EXTERNAL_TWITTER_CLIENT_ID=iN3FERNVeWJ24G6fvgn1meSzj \
  GOTRUE_EXTERNAL_TWITTER_SECRET=[YOUR_SECRET_HERE] \
  --project-ref xhcfjhzfyozzuicubqmh
```

## Steps to Complete

1. **Get your Twitter Client Secret**
   - Go to https://developer.twitter.com/en/apps
   - Find your app
   - Copy the API Secret Key

2. **Set the secret via CLI**
   ```bash
   ~/.local/bin/supabase secrets set \
     GOTRUE_EXTERNAL_TWITTER_SECRET=[YOUR_SECRET] \
     --project-ref xhcfjhzfyozzuicubqmh
   ```

3. **Restart the Auth service** (might happen automatically)
   - The secrets need to be picked up by the GoTrue service
   - This may take a few minutes

4. **Test the OAuth flow**
   - Go to `/test-oauth` page
   - Click "Test OAuth URL Generation"
   - The URL should now redirect to Twitter/X

## Test Page Created

A test page has been created at `/test-oauth` with three test buttons:
1. **Test OAuth URL Generation** - Tests if Supabase generates the correct OAuth URL
2. **Check Auth Settings** - Shows current auth configuration
3. **Attempt Direct Auth** - Tries to manually construct and redirect to OAuth URL

## What We Learned

1. The Dashboard UI isn't saving OAuth credentials properly
2. The `auth.flow_state` table is not used for OAuth provider configuration
3. OAuth providers are configured via environment variables in the GoTrue service
4. The correct environment variables are:
   - `GOTRUE_EXTERNAL_TWITTER_ENABLED`
   - `GOTRUE_EXTERNAL_TWITTER_CLIENT_ID`
   - `GOTRUE_EXTERNAL_TWITTER_SECRET`

## Verification

Once configured, you can verify it's working by:

1. Check the OAuth URL:
   ```bash
   curl -i "https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/authorize?provider=twitter"
   ```
   Should redirect to `https://api.twitter.com/oauth/authenticate`

2. Use the test page at `/test-oauth`

3. Try signing in with the AuthButton component

## Alternative If This Doesn't Work

If setting secrets doesn't work, we may need to:
1. Create a new Supabase project
2. Use a different OAuth provider (GitHub, Google)
3. Contact Supabase support about the configuration issue
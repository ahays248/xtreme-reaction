# Fix Twitter OAuth - The Real Issue

## The Problem
Your Management API token (`sbp_4dd96bebb1eb7b8c1232f5ef1ddf89848a86632d`) is returning "Unauthorized". This means either:
1. The token has been revoked
2. The token doesn't have the right permissions
3. There's an issue with the token itself

## The Solution

### Option 1: Get a NEW Token and Apply Config

1. Go to: https://supabase.com/dashboard/account/tokens
2. Look for your existing token - is it still there?
3. If not, or if it doesn't work, create a NEW one:
   - Click "Generate new token"
   - Name it "OAuth Config"
   - Copy the new token

4. Test the new token:
```bash
curl -X GET "https://api.supabase.com/v1/profile" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN"
```

5. If it works, apply the Twitter config:
```bash
curl -X PATCH "https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_twitter_enabled": true,
    "external_twitter_client_id": "iN3FERNVeWJ24G6fvgn1meSzj",
    "external_twitter_secret": "YOUR_TWITTER_API_SECRET"
  }'
```

### Option 2: Use Supabase Dashboard Directly

Since the Management API token isn't working, try the Dashboard:

1. Go to: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/auth/providers
2. Scroll to "Twitter"
3. Toggle it ON
4. Enter:
   - Client ID: `iN3FERNVeWJ24G6fvgn1meSzj`
   - Client Secret: Your Twitter API Secret (50 chars)
5. Click "Save"

### Option 3: Use Supabase CLI with Login

```bash
# Login to Supabase CLI
~/.local/bin/supabase login

# This will open a browser for authentication
# After logging in, try to update the config via CLI
```

## How to Verify It's Working

Once configured, the OAuth URL should change from:
```
https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/authorize?provider=twitter
```

To something like:
```
https://api.twitter.com/oauth/authenticate?oauth_token=...
```

Check at: https://xtreme-reaction.vercel.app/twitter-status

## Why This Happened

The token you shared was likely:
- Created with limited permissions
- Revoked after being shared publicly
- Or expired despite being set to "never expire"

The fact that it returns "Unauthorized" for even basic profile requests confirms it's not valid.
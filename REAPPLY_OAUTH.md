# Re-Apply Twitter OAuth Configuration

The Management API token has expired. You need to get a new one and re-apply the configuration.

## Step 1: Get a NEW Access Token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a name like "OAuth Config"
4. Copy the token (starts with `sbp_`)

## Step 2: Run This Command

Replace the placeholders with your actual values:

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "external_twitter_enabled": true,
    "external_twitter_client_id": "YOUR_TWITTER_API_KEY",
    "external_twitter_secret": "YOUR_TWITTER_API_SECRET"
  }'
```

### Your Twitter Credentials (from before):
- API Key: `iN3FERNVeWJ24G6fvgn1meSzj`
- API Secret: (you have this saved)

## Step 3: Verify

1. Wait 60 seconds for propagation
2. Visit: https://xtreme-reaction.vercel.app/twitter-status
3. Check if OAuth URL now points to Twitter

## Alternative: Use Supabase Dashboard

If the API approach isn't working:

1. Go to: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/auth/providers
2. Click on Twitter
3. Enable it
4. Enter your API Key and Secret
5. Click Save

## Why This Happened

- Management API tokens expire for security
- The token we used earlier (`sbp_4dd96bebb1eb7b8c1232f5ef1ddf89848a86632d`) is no longer valid
- You need a fresh token to make API changes

## Current Status

✅ Twitter shows as enabled in public settings
❌ But OAuth URLs still point to Supabase (not Twitter)
❌ This means credentials aren't configured properly

The issue is that while Twitter is "enabled", the actual API credentials aren't saved. This needs to be fixed via Management API or Dashboard.
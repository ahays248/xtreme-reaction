# URGENT: Configure Twitter OAuth via Management API

## ⚠️ SECURITY ALERT
If you shared your token anywhere, revoke it immediately at:
https://supabase.com/dashboard/account/tokens

## Quick Configuration Steps

### 1. Get a NEW Access Token
- Go to: https://supabase.com/dashboard/account/tokens
- Generate a new token
- Keep it SECRET

### 2. Run This Command (Replace the placeholders)

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth" \
  -H "Authorization: Bearer YOUR_NEW_SUPABASE_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "external_twitter_enabled": true,
    "external_twitter_client_id": "YOUR_TWITTER_API_KEY",
    "external_twitter_secret": "YOUR_TWITTER_API_SECRET_KEY"
  }'
```

### 3. What to Replace:
- `YOUR_NEW_SUPABASE_TOKEN_HERE` - Your NEW Supabase access token
- `YOUR_TWITTER_API_KEY` - Your Twitter API Key (about 25 characters)
- `YOUR_TWITTER_API_SECRET_KEY` - Your Twitter API Secret (about 50 characters)

### 4. Expected Response
If successful, you'll get a JSON response with the updated configuration.

### 5. Test
- Wait 30-60 seconds
- Go to https://xtreme-reaction.vercel.app
- Click "Sign in with X"
- Should redirect to Twitter/X!

## If Using Windows PowerShell

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_NEW_SUPABASE_TOKEN_HERE"
    "Content-Type" = "application/json"
}

$body = @{
    external_twitter_enabled = $true
    external_twitter_client_id = "YOUR_TWITTER_API_KEY"
    external_twitter_secret = "YOUR_TWITTER_API_SECRET_KEY"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth" `
                  -Method PATCH `
                  -Headers $headers `
                  -Body $body
```

## Remember
- NEVER share your access tokens
- Tokens are like passwords
- Always revoke compromised tokens immediately
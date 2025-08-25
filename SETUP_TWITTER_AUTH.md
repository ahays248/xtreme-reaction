# Setting Up Twitter/X OAuth in Supabase

## CRITICAL: Enable Twitter Provider in Supabase Dashboard

The OAuth flow is failing because the Twitter provider needs to be enabled in your Supabase project. Follow these steps:

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/auth/providers
2. Or navigate manually:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Click on "Authentication" in the left sidebar
   - Click on "Providers" under Configuration

### Step 2: Enable Twitter Provider
1. Find **Twitter** in the list of providers (NOT "Twitter (Legacy)")
2. Click on it to expand the settings
3. **Toggle "Enable Twitter" to ON** (this is the critical missing step!)

### Step 3: Add Your X API Credentials
You already have these from your X Developer Portal:

1. **Client ID (API Key)**: Enter your X API Key from the Developer Portal
2. **Client Secret (API Secret Key)**: Enter your X API Secret Key from the Developer Portal

These are the credentials from your X OAuth 2.0 app that you showed me earlier.

### Step 4: Verify Settings
Make sure these are set correctly:
- **Callback URL**: Should already be set to `https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/callback`
- **Enable Twitter**: Must be toggled ON
- **Client ID**: Your X API Key
- **Client Secret**: Your X API Secret Key

### Step 5: Save Changes
Click the **Save** button at the bottom of the Twitter provider settings.

## Verification Steps

After enabling the provider:

1. **Clear your browser cache** or use an incognito window
2. Go to https://xtreme-reaction.vercel.app
3. Click "Sign in with X"
4. You should now be redirected to X.com for authorization (not the Supabase URL)

## Troubleshooting

If you still see the error after enabling the provider:

1. **Double-check the provider is enabled**: The toggle must be ON
2. **Verify your API credentials**: Make sure you're using the OAuth 2.0 credentials, not OAuth 1.0a
3. **Check the callback URL**: It should match exactly what's in your X Developer Portal
4. **Wait a minute**: Sometimes Supabase needs a moment to propagate the changes

## What Was Wrong

The issue was that the Twitter provider wasn't enabled in Supabase. Even though you had:
- Configured the X Developer Portal correctly
- Set up the callback URLs
- Added environment variables

The actual Twitter authentication provider wasn't turned on in Supabase, so when the OAuth flow tried to start, it couldn't find the provider configuration and returned a 404 error.

## Next Steps

Once the Twitter provider is enabled and you can successfully sign in:
1. The app will create a user profile automatically
2. You'll be able to save game scores
3. Leaderboards will work with authenticated users

---

**Note**: The singleton Supabase client fix has already been applied to prevent the "Multiple GoTrueClient instances" warning.
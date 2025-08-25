#!/bin/bash

echo "Fixing Twitter OAuth Configuration"
echo "==================================="
echo ""

# Get a new Management API token
echo "Please go to: https://supabase.com/dashboard/account/tokens"
echo "Generate a NEW access token and paste it here:"
read -s NEW_TOKEN
echo ""

# Your Twitter credentials
echo "Enter your Twitter API Key (about 25 characters):"
read TWITTER_API_KEY

echo "Enter your Twitter API Secret (about 50 characters):"
read -s TWITTER_API_SECRET
echo ""

# Apply the configuration
echo "Applying configuration..."
curl -X PATCH "https://api.supabase.com/v1/projects/xhcfjhzfyozzuicubqmh/config/auth" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"external_twitter_enabled\": true,
    \"external_twitter_client_id\": \"$TWITTER_API_KEY\",
    \"external_twitter_secret\": \"$TWITTER_API_SECRET\"
  }"

echo ""
echo "Configuration applied! Wait 60 seconds then check:"
echo "https://xtreme-reaction.vercel.app/twitter-status"
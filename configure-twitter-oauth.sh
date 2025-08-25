#!/bin/bash

# Supabase Twitter OAuth Configuration Script
# This uses the Supabase Management API to bypass Dashboard issues

echo "==================================="
echo "Supabase Twitter OAuth Configuration"
echo "==================================="
echo ""

# Instructions
echo "Before running this script, you need:"
echo "1. Your Supabase Access Token from: https://supabase.com/dashboard/account/tokens"
echo "2. Your Twitter API Key (from X Developer Portal)"
echo "3. Your Twitter API Secret Key (from X Developer Portal)"
echo ""
echo "Press Enter to continue..."
read

# Get credentials
echo -n "Enter your Supabase Access Token: "
read -s SUPABASE_ACCESS_TOKEN
echo ""

echo -n "Enter your Twitter API Key: "
read TWITTER_API_KEY

echo -n "Enter your Twitter API Secret Key: "
read -s TWITTER_API_SECRET
echo ""

# Set project reference
PROJECT_REF="xhcfjhzfyozzuicubqmh"

echo ""
echo "Configuring Twitter OAuth for project: $PROJECT_REF"
echo ""

# Make the API call
response=$(curl -s -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"external_twitter_enabled\": true,
    \"external_twitter_client_id\": \"$TWITTER_API_KEY\",
    \"external_twitter_secret\": \"$TWITTER_API_SECRET\"
  }")

# Check if successful
if echo "$response" | grep -q "error"; then
    echo "❌ Configuration failed!"
    echo "Response: $response"
else
    echo "✅ Twitter OAuth configuration updated successfully!"
    echo ""
    echo "Please wait 30-60 seconds for changes to propagate."
    echo ""
    echo "Then test at: https://xtreme-reaction.vercel.app"
fi
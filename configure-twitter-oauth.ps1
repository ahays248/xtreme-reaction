# Supabase Twitter OAuth Configuration Script for Windows
# This uses the Supabase Management API to bypass Dashboard issues

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Supabase Twitter OAuth Configuration" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Instructions
Write-Host "Before running this script, you need:" -ForegroundColor Yellow
Write-Host "1. Your Supabase Access Token from: https://supabase.com/dashboard/account/tokens"
Write-Host "2. Your Twitter API Key (from X Developer Portal)"
Write-Host "3. Your Twitter API Secret Key (from X Developer Portal)"
Write-Host ""
Write-Host "Press Enter to continue..."
Read-Host

# Get credentials
$SUPABASE_ACCESS_TOKEN = Read-Host "Enter your Supabase Access Token" -AsSecureString
$TWITTER_API_KEY = Read-Host "Enter your Twitter API Key"
$TWITTER_API_SECRET = Read-Host "Enter your Twitter API Secret Key" -AsSecureString

# Convert secure strings to plain text
$ACCESS_TOKEN_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SUPABASE_ACCESS_TOKEN))
$API_SECRET_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($TWITTER_API_SECRET))

# Set project reference
$PROJECT_REF = "xhcfjhzfyozzuicubqmh"

Write-Host ""
Write-Host "Configuring Twitter OAuth for project: $PROJECT_REF" -ForegroundColor Green
Write-Host ""

# Create the JSON body
$body = @{
    external_twitter_enabled = $true
    external_twitter_client_id = $TWITTER_API_KEY
    external_twitter_secret = $API_SECRET_PLAIN
} | ConvertTo-Json

# Make the API call
$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN_PLAIN"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" `
                                  -Method PATCH `
                                  -Headers $headers `
                                  -Body $body

    Write-Host "✅ Twitter OAuth configuration updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please wait 30-60 seconds for changes to propagate." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then test at: https://xtreme-reaction.vercel.app" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Configuration failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
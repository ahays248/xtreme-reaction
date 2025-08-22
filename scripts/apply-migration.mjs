import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    // Try alternate endpoint
    const altResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (!altResponse.ok) {
      throw new Error(`SQL execution failed: ${response.status}`)
    }
  }
  
  return true
}

async function applyMigration() {
  try {
    console.log('📦 Applying database migration...')
    
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Since we can't execute SQL directly via REST API without a special endpoint,
    // we'll test the connection and provide instructions
    
    console.log('\n✅ Migration file found!')
    console.log('\n📋 To apply the migration, please:')
    console.log('\n1. Go to your Supabase Dashboard:')
    console.log(`   https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/sql\n`)
    console.log('2. Copy the migration from:')
    console.log(`   ${migrationPath}\n`)
    console.log('3. Paste it into the SQL editor and click "Run"\n')
    
    // Test if tables exist
    console.log('🔍 Checking if tables already exist...')
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    })
    
    if (testResponse.ok) {
      console.log('✅ Tables already exist! Migration may have been applied.')
    } else if (testResponse.status === 404 || testResponse.status === 406) {
      console.log('❌ Tables do not exist yet. Please apply the migration.')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

applyMigration()
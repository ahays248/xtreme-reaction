const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection configurations to try
const configs = [
  {
    name: 'Direct Connection',
    host: 'db.xhcfjhzfyozzuicubqmh.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'XtremeReaction123!@#',
    ssl: { rejectUnauthorized: false },
    // Force IPv4
    connectionString: 'postgresql://postgres:XtremeReaction123!@%23@db.xhcfjhzfyozzuicubqmh.supabase.co:5432/postgres?sslmode=require'
  },
  {
    name: 'Pooler Connection (Transaction Mode)',
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.xhcfjhzfyozzuicubqmh',
    password: 'XtremeReaction123!@#',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Pooler Connection (Port 5432)',
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.xhcfjhzfyozzuicubqmh',
    password: 'XtremeReaction123!@#',
    ssl: { rejectUnauthorized: false }
  }
]

async function testConnection(config) {
  console.log(`\nTrying ${config.name}...`)
  const client = new Client(config)
  
  try {
    await client.connect()
    console.log(`✅ Connected successfully!`)
    
    // Test query
    const result = await client.query('SELECT current_database(), current_user, version()')
    console.log('Database:', result.rows[0].current_database)
    console.log('User:', result.rows[0].current_user)
    console.log('Version:', result.rows[0].version.split(',')[0])
    
    return client
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`)
    if (error.code) console.log(`   Error code: ${error.code}`)
    if (error.errno) console.log(`   Error number: ${error.errno}`)
    if (error.syscall) console.log(`   System call: ${error.syscall}`)
    return null
  }
}

async function applyMigration(client) {
  try {
    console.log('\n📦 Applying migration...')
    
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let skipCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      // Skip if it's just a comment
      if (statement.trim().startsWith('--')) continue
      
      try {
        await client.query(statement)
        successCount++
        process.stdout.write('.')
      } catch (error) {
        if (error.code === '42P07' || error.code === '42710') {
          // Table/index already exists
          skipCount++
          process.stdout.write('s')
        } else if (error.code === '23505') {
          // Duplicate key (for inserts)
          skipCount++
          process.stdout.write('d')
        } else {
          console.log(`\n⚠️ Error in statement ${i + 1}: ${error.message}`)
          console.log('Statement preview:', statement.substring(0, 100) + '...')
        }
      }
    }
    
    console.log(`\n\n✅ Migration complete!`)
    console.log(`   Executed: ${successCount} statements`)
    console.log(`   Skipped: ${skipCount} statements (already exist)`)
    
    // Verify tables
    console.log('\n🔍 Verifying tables...')
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)
    
    console.log('Tables created:')
    tables.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`)
    })
    
    // Check views
    const views = await client.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    if (views.rows.length > 0) {
      console.log('\nViews created:')
      views.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`)
      })
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

async function main() {
  let client = null
  
  // Try each connection config
  for (const config of configs) {
    client = await testConnection(config)
    if (client) break
  }
  
  if (!client) {
    console.log('\n❌ Could not connect to database with any configuration')
    console.log('\nPlease verify:')
    console.log('1. The database password is correct')
    console.log('2. The project is not paused in Supabase Dashboard')
    console.log('3. Network connectivity to Supabase servers')
    process.exit(1)
  }
  
  // Apply migration
  await applyMigration(client)
  
  // Close connection
  await client.end()
  console.log('\n✨ Done!')
}

main().catch(console.error)
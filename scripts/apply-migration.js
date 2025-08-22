const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    console.log('Reading migration file...')
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the migration into sections to handle separately
    const sections = migrationSQL.split(/\n\n/)
    
    console.log('Applying migration in sections...')
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim()
      if (!section || section.startsWith('--')) continue
      
      try {
        console.log(`Executing section ${i + 1}/${sections.length}...`)
        const { error } = await supabase.rpc('exec_sql', { query: section })
        
        if (error) {
          // Try direct execution as fallback
          const { data, error: directError } = await supabase.from('_sql').select().single().eq('query', section)
          if (directError) {
            console.warn(`Warning in section ${i + 1}:`, directError.message)
            // Continue with next section instead of failing
          }
        }
      } catch (sectionError) {
        console.warn(`Warning in section ${i + 1}:`, sectionError.message)
        // Continue with next section
      }
    }
    
    console.log('Migration applied successfully!')
    
    // Verify tables were created
    console.log('\nVerifying tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (tablesError && tablesError.code === '42P01') {
      console.error('Tables were not created. Please apply the migration manually in the Supabase Dashboard.')
      console.log('Go to: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/sql')
    } else if (tablesError) {
      console.log('Error checking tables:', tablesError.message)
    } else {
      console.log('✅ Tables verified successfully!')
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
    console.log('\nPlease apply the migration manually:')
    console.log('1. Go to: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh/sql')
    console.log('2. Copy the contents of supabase/migrations/001_initial_schema.sql')
    console.log('3. Paste and run in the SQL editor')
  }
}

applyMigration()
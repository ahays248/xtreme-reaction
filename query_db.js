// Quick database inspection script
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xhcfjhzfyozzuicubqmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY2ZqaHpmeW96enVpY3VicW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjgyOTQsImV4cCI6MjA3MTQwNDI5NH0.YvXw2sAxjg28t5E8MXGArbFRRpFFdpjyBAE2APYlv7g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
  console.log('🔍 Inspecting Xtreme Reaction Database\n');

  // 1. List all tables in the public schema
  console.log('1. Tables in public schema:');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (tablesError) {
    console.log('   Error fetching tables:', tablesError.message);
  } else {
    tables.forEach(table => console.log(`   - ${table.table_name}`));
  }

  console.log('\n2. Structure of profiles table:');
  const { data: profilesStructure, error: profilesError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_schema', 'public')
    .eq('table_name', 'profiles')
    .order('ordinal_position');

  if (profilesError) {
    console.log('   Error fetching profiles structure:', profilesError.message);
  } else {
    profilesStructure.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
  }

  console.log('\n3. Structure of game_sessions table:');
  const { data: sessionsStructure, error: sessionsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_schema', 'public')
    .eq('table_name', 'game_sessions')
    .order('ordinal_position');

  if (sessionsError) {
    console.log('   Error fetching game_sessions structure:', sessionsError.message);
  } else {
    sessionsStructure.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
  }

  console.log('\n4. Count records in achievements table:');
  const { count: achievementsCount, error: achievementsError } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true });

  if (achievementsError) {
    console.log('   Error counting achievements:', achievementsError.message);
  } else {
    console.log(`   Total achievements: ${achievementsCount}`);
  }

  // Get actual achievement records
  const { data: achievements, error: achievementsDataError } = await supabase
    .from('achievements')
    .select('name, description, icon');

  if (!achievementsDataError) {
    achievements.forEach(ach => {
      console.log(`   - ${ach.icon} ${ach.name}: ${ach.description}`);
    });
  }

  console.log('\n5. Views in public schema:');
  const { data: views, error: viewsError } = await supabase
    .from('information_schema.views')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (viewsError) {
    console.log('   Error fetching views:', viewsError.message);
  } else {
    views.forEach(view => console.log(`   - ${view.table_name}`));
  }

  console.log('\n✅ Database inspection complete!');
}

inspectDatabase().catch(console.error);
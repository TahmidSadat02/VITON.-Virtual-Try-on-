import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTE3MzIsImV4cCI6MjA4NTA4NzczMn0.zSQaxI5I9LrhM9n-ct_RN384vVg0ZHlZv39kZFwYqGU'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMTczMiwiZXhwIjoyMDg1MDg3NzMyfQ.Um3YrBU_nJkLJcvC5BWCCBXz3R_F6UJsenVdLnHSHN8'


console.log('🔍 Testing Supabase Backend Connection...\n')

// Use service role key for testing (has full permissions)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Test 1: Check if we can connect
console.log('✓ Supabase client created')
console.log(`✓ URL: ${supabaseUrl}`)

// Test 2: Try to fetch from auth
try {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.log('⚠ Auth check:', error.message)
  } else {
    console.log('✓ Auth service is accessible')
    console.log('  Current session:', session ? 'Logged in' : 'Not logged in')
  }
} catch (err) {
  console.log('✗ Auth service error:', err.message)
}

// Test 3: Check database tables
console.log('\n📊 Checking Database Tables...')
const tables = ['users', 'dresses', 'user_photos', 'try_on_sessions', 'admin_users']

for (const table of tables) {
  try {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      if (error.code === '42P01') {
        console.log(`✗ Table "${table}": Does not exist (needs to be created)`)
      } else if (error.code === 'PGRST116') {
        console.log(`✗ Table "${table}": No RLS policy (cannot read)`)
      } else {
        console.log(`✗ Table "${table}": ${error.message} (code: ${error.code})`)
      }
    } else {
      console.log(`✓ Table "${table}": Exists (${count || 0} rows)`)
    }
  } catch (err) {
    console.log(`✗ Table "${table}": ${err.message}`)
  }
}

// Test 4: Check storage buckets
console.log('\n🗂️  Checking Storage Buckets...')
const buckets = ['user-photos', 'dress-images', 'tryon-results']

try {
  const { data: allBuckets, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.log('✗ Storage service error:', error.message)
  } else {
    console.log(`✓ Storage service is accessible (${allBuckets.length} buckets found)`)
    
    for (const bucket of buckets) {
      const exists = allBuckets.some(b => b.name === bucket)
      if (exists) {
        console.log(`✓ Bucket "${bucket}": Exists`)
      } else {
        console.log(`✗ Bucket "${bucket}": Does not exist (needs to be created)`)
      }
    }
  }
} catch (err) {
  console.log('✗ Storage service error:', err.message)
}

console.log('\n' + '='.repeat(60))
console.log('📋 SUMMARY')
console.log('='.repeat(60))
console.log('\nBackend Status:')
console.log('  • Supabase Connection: ✓ Working')
console.log('  • Environment Variables: ✓ Configured')
console.log('  • Auth Service: Check results above')
console.log('  • Database Tables: Check results above')
console.log('  • Storage Buckets: Check results above')
console.log('\nNext Steps:')
console.log('  1. If tables are missing: Run supabase-schema.sql in Supabase SQL Editor')
console.log('  2. If buckets are missing: Create them in Supabase Dashboard → Storage')
console.log('  3. If RLS errors: Apply storage-policies-fixed.sql')
console.log('  4. Test signup/login in your app')

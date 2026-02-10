import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env.local file
const envFile = readFileSync('.env.local', 'utf-8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=')
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim()
  }
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function debugAdminAccess() {
  console.log('\n🔍 Debugging Admin Access...\n')
  
  // Try logging in with admin credentials
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: '723280'
  })

  if (authError) {
    console.error('❌ Login failed:', authError.message)
    return
  }

  console.log('✅ Login successful!')
  console.log('User ID:', authData.user.id)
  console.log('User Email:', authData.user.email)
  console.log('Email Confirmed:', authData.user.email_confirmed_at ? 'Yes' : 'No')
  
  // Check admin status
  const ADMIN_EMAILS = ['admin@gmail.com', 'tahmidsadat2002@gmail.com']
  const isAdmin = ADMIN_EMAILS.some(email => 
    authData.user.email?.toLowerCase() === email.toLowerCase()
  )
  
  console.log('\n📋 Admin Check:')
  console.log('Admin Emails List:', ADMIN_EMAILS)
  console.log('User Email (lowercase):', authData.user.email?.toLowerCase())
  console.log('Is Admin?', isAdmin ? '✅ YES' : '❌ NO')
  
  if (isAdmin) {
    console.log('\n✅ User SHOULD have access to /admin')
  } else {
    console.log('\n❌ User SHOULD NOT have access to /admin')
  }
}

debugAdminAccess()

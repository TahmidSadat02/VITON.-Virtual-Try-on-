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

async function checkColumns() {
  console.log('\n🔍 Checking dresses table columns...\n')
  
  const { data: dresses, error } = await supabase
    .from('dresses')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (dresses && dresses.length > 0) {
    console.log('📋 Current columns:')
    console.log(Object.keys(dresses[0]))
    console.log('\n📊 Sample data:')
    console.log(dresses[0])
  } else {
    console.log('⚠️  No dresses found in database')
  }
  
  // Fetch all dresses
  const { data: allDresses } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_visible', true)
  
  console.log('\n📈 Total visible dresses:', allDresses?.length || 0)
  
  if (allDresses && allDresses.length > 0) {
    console.log('\n🎨 Dress names:')
    allDresses.forEach((d, i) => {
      console.log(`${i + 1}. ${d.name} - Featured: ${d.is_featured ? '⭐' : '❌'} - Visible: ${d.is_visible ? '✅' : '❌'}`)
    })
  }
}

checkColumns()

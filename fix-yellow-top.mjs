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

async function updateYellowTop() {
  console.log('🔄 Updating Yellow Top with proper details...\n')
  
  const { data, error } = await supabase
    .from('dresses')
    .update({
      price: 79.00,
      description: 'Vibrant yellow cropped hoodie set. Bold and comfortable streetwear style.',
      color: 'Yellow',
      size: 'S-L',
      category: 'Tops'
    })
    .eq('name', 'Yellow Top')
    .select()
  
  if (error) {
    console.error('❌ Error:', error.message)
  } else if (data && data.length > 0) {
    console.log('✅ Updated Yellow Top:')
    console.log(JSON.stringify(data[0], null, 2))
  } else {
    console.log('⚠️  Yellow Top not found')
  }
}

updateYellowTop()

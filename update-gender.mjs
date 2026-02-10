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

async function updateGender() {
  console.log('🔄 Updating gender for existing dresses...\n')
  
  // Men's items - Outerwear, Pants, some Jackets
  const menCategories = ['Outerwear', 'Bottoms', 'Knitwear', 'Tops']
  
  // Update men's items
  const { data: menData, error: menError } = await supabase
    .from('dresses')
    .update({ gender: 'men' })
    .in('category', menCategories)
    .select()
  
  if (menError) {
    console.error('❌ Error updating men items:', menError.message)
  } else {
    console.log(`✅ Updated ${menData.length} items to MEN`)
  }
  
  // Update women's items (Dresses and remaining items)
  const { data: womenData, error: womenError } = await supabase
    .from('dresses')
    .update({ gender: 'women' })
    .eq('category', 'Dresses')
    .select()
  
  if (womenError) {
    console.error('❌ Error updating women items:', womenError.message)
  } else {
    console.log(`✅ Updated ${womenData.length} items to WOMEN`)
  }
  
  // Show final state
  const { data: allDresses } = await supabase
    .from('dresses')
    .select('name, category, gender')
    .order('name')
  
  console.log('\n📊 Current Database State:')
  console.log('═══════════════════════════════════════════════════')
  allDresses?.forEach(d => {
    const genderEmoji = d.gender === 'men' ? '👔' : '👗'
    console.log(`${genderEmoji} ${d.name} - ${d.category} (${d.gender})`)
  })
}

updateGender()

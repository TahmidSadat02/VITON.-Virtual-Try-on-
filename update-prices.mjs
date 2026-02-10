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

const priceUpdates = [
  { name: 'Oversized Wool Coat', price: 299.00, description: 'Premium wool blend coat with oversized fit. Perfect for layering in colder months.', color: 'Camel', size: 'One Size' },
  { name: 'Silk Shirt Dress', price: 189.00, description: 'Elegant silk shirt dress with button-down front. Effortlessly sophisticated.', color: 'Beige', size: 'S-L' },
  { name: 'Tailored Blazer', price: 259.00, description: 'Classic tailored blazer with structured shoulders. A wardrobe essential.', color: 'Black', size: 'S-XL' },
  { name: 'Linen Trousers', price: 149.00, description: 'Relaxed-fit linen trousers. Breathable and comfortable for all-day wear.', color: 'Natural', size: 'S-L' },
  { name: 'Cashmere Sweater', price: 219.00, description: 'Luxurious cashmere knit sweater. Soft, warm, and timeless.', color: 'Cream', size: 'XS-L' },
  { name: 'Pleated Midi Skirt', price: 169.00, description: 'Flowing pleated midi skirt with elastic waistband. Elegant and versatile.', color: 'Navy', size: 'S-L' },
  { name: 'Leather Jacket', price: 449.00, description: 'Premium leather moto jacket with asymmetric zipper. Edgy and timeless.', color: 'Black', size: 'S-L' },
  { name: 'Cotton Shirt', price: 129.00, description: 'Classic white cotton shirt with clean lines. A closet staple.', color: 'White', size: 'XS-XL' },
]

async function updatePrices() {
  console.log('🔄 Updating dress prices and details...\n')
  
  for (const update of priceUpdates) {
    const { data, error } = await supabase
      .from('dresses')
      .update({
        price: update.price,
        description: update.description,
        color: update.color,
        size: update.size
      })
      .eq('name', update.name)
      .select()
    
    if (error) {
      console.error(`❌ Error updating ${update.name}:`, error.message)
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${update.name} - $${update.price}`)
    } else {
      console.log(`⚠️  Not found: ${update.name}`)
    }
  }
  
  console.log('\n✅ All prices updated!')
  
  // Verify
  const { data: allDresses } = await supabase
    .from('dresses')
    .select('name, price, color, size, description')
    .order('name')
  
  console.log('\n📊 Current Database State:')
  console.log('═══════════════════════════════════════════════════')
  allDresses?.forEach(d => {
    console.log(`${d.name}`)
    console.log(`  Price: $${d.price || 'NOT SET'}`)
    console.log(`  Color: ${d.color || 'NOT SET'} | Size: ${d.size || 'NOT SET'}`)
    console.log(`  Description: ${d.description ? d.description.substring(0, 50) + '...' : 'NOT SET'}`)
    console.log('─────────────────────────────────────────────────')
  })
}

updatePrices()

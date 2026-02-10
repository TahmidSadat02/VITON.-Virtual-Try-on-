import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMTczMiwiZXhwIjoyMDg1MDg3NzMyfQ.Um3YrBU_nJkLJcvC5BWCCBXz3R_F6UJsenVdLnHSHN8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const dresses = [
  {
    name: 'Oversized Wool Coat',
    description: 'Premium wool blend coat with oversized fit. Perfect for layering in colder months.',
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
    category: 'Outerwear',
    price: 299.00,
    is_visible: true,
    is_featured: true
  },
  {
    name: 'Silk Shirt Dress',
    description: 'Elegant silk shirt dress with button-down front. Effortlessly sophisticated.',
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    category: 'Dresses',
    price: 189.00,
    is_visible: true,
    is_featured: true
  },
  {
    name: 'Tailored Blazer',
    description: 'Classic tailored blazer with structured shoulders. A wardrobe essential.',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    category: 'Outerwear',
    price: 259.00,
    is_visible: true,
    is_featured: true
  },
  {
    name: 'Linen Trousers',
    description: 'Relaxed-fit linen trousers. Breathable and comfortable for all-day wear.',
    image_url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=800&auto=format&fit=crop',
    category: 'Bottoms',
    price: 149.00,
    is_visible: true,
    is_featured: false
  },
  {
    name: 'Cashmere Sweater',
    description: 'Luxurious cashmere knit sweater. Soft, warm, and timeless.',
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
    category: 'Knitwear',
    price: 219.00,
    is_visible: true,
    is_featured: false
  },
  {
    name: 'Pleated Midi Skirt',
    description: 'Flowing pleated midi skirt with elastic waistband. Elegant and versatile.',
    image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    category: 'Bottoms',
    price: 169.00,
    is_visible: true,
    is_featured: false
  },
  {
    name: 'Leather Jacket',
    description: 'Premium leather moto jacket with asymmetric zipper. Edgy and timeless.',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    category: 'Outerwear',
    price: 449.00,
    is_visible: true,
    is_featured: true
  },
  {
    name: 'Cotton Shirt',
    description: 'Classic white cotton shirt with clean lines. A closet staple.',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    category: 'Tops',
    price: 129.00,
    is_visible: true,
    is_featured: false
  }
];

async function addDresses() {
  console.log('Checking database schema...\n');
  
  // First, let's see what columns exist
  const { data: testData, error: testError } = await supabase
    .from('dresses')
    .select('*')
    .limit(1);
  
  if (testError) {
    console.error('Error accessing dresses table:', testError.message);
    return;
  }
  
  console.log('Adding dresses to database...\n');

  for (const dress of dresses) {
    const { data, error } = await supabase
      .from('dresses')
      .insert([dress])
      .select();

    if (error) {
      console.error(`❌ Error adding ${dress.name}:`, error.message);
      // Try with minimal fields
      const { data: retry, error: retryError } = await supabase
        .from('dresses')
        .insert([{
          name: dress.name,
          image_url: dress.image_url,
          category: dress.category,
          price: dress.price
        }])
        .select();
      
      if (retryError) {
        console.error(`   Still failed with minimal fields:`, retryError.message);
      } else {
        console.log(`✅ Added with minimal fields: ${dress.name}`);
      }
    } else {
      console.log(`✅ Added: ${dress.name} ($${dress.price})`);
    }
  }

  console.log('\n✅ All dresses processed!');
  
  // Verify
  const { data: allDresses, error: fetchError } = await supabase
    .from('dresses')
    .select('*');

  if (!fetchError) {
    console.log(`\n📊 Total dresses in database: ${allDresses.length}`);
    if (allDresses.length > 0) {
      console.log('\nSample dress:');
      console.log(JSON.stringify(allDresses[0], null, 2));
    }
  }
}

addDresses().catch(console.error);

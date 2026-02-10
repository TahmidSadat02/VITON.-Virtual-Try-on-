import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTE3MzIsImV4cCI6MjA4NTA4NzczMn0.zSQaxI5I9LrhM9n-ct_RN384vVg0ZHlZv39kZFwYqGU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDresses() {
  console.log('Checking dresses table...\n');
  
  const { data, error, count } = await supabase
    .from('dresses')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTable might not exist or has wrong schema.');
    console.log('Please add dresses via Supabase dashboard or SQL.');
    return;
  }
  
  console.log(`✅ Found ${count || 0} dresses in database\n`);
  
  if (data && data.length > 0) {
    console.log('Sample dress:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\nAll dresses:');
    data.forEach((dress, i) => {
      console.log(`${i + 1}. ${dress.name} - Category: ${dress.category} - Visible: ${dress.is_visible} - Featured: ${dress.is_featured}`);
    });
  } else {
    console.log('❌ No dresses in database!');
    console.log('\nTo add dresses:');
    console.log('1. Go to: https://supabase.com/dashboard/project/ogsjitiuhcsrnkxkqeji');
    console.log('2. Click "SQL Editor"');
    console.log('3. Run this SQL:\n');
    console.log(`INSERT INTO dresses (name, image_url, category, is_visible, is_featured)
VALUES 
  ('Oversized Wool Coat', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800', 'Outerwear', true, true),
  ('Silk Shirt Dress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800', 'Dresses', true, true),
  ('Tailored Blazer', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800', 'Outerwear', true, true),
  ('Linen Trousers', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=800', 'Bottoms', true, false);`);
  }
}

checkDresses().catch(console.error);

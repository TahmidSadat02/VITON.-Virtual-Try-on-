import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzvtuevigsnodsyfbkxp.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnR1ZXZpZ3Nub2RzeWZia3hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU0NTI3MCwiZXhwIjoyMDY1MTIxMjcwfQ.LxNNOT_VIKqNvW0g0TnpLr5VT4x-oSGK9cQTj27BbxQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBanners() {
  console.log('Setting up banners table...\n')

  // Create banners table
  const { error: createError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.banners (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT NOT NULL,
        link_url TEXT,
        gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'both')) DEFAULT 'both',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  if (createError) {
    // Try direct SQL if rpc doesn't work
    console.log('RPC not available, trying direct table creation via REST...')
    
    // Check if table exists by trying to select from it
    const { error: selectError } = await supabase.from('banners').select('id').limit(1)
    
    if (selectError && selectError.code === '42P01') {
      console.log('Table does not exist. Please run this SQL in Supabase SQL Editor:\n')
      console.log(`
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'both')) DEFAULT 'both',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active banners
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

-- Allow admins to manage banners  
CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );
      `)
    } else {
      console.log('Banners table already exists!')
    }
  } else {
    console.log('Banners table created!')
  }

  // Insert default banners
  console.log('\nInserting default banners...')
  
  const defaultBanners = [
    {
      title: 'New Season Arrivals',
      subtitle: 'Discover the latest trends in men\'s fashion',
      image_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop',
      gender: 'men',
      is_active: true,
      sort_order: 1,
    },
    {
      title: 'Premium Essentials',
      subtitle: 'Timeless pieces for the modern man',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
      gender: 'men',
      is_active: true,
      sort_order: 2,
    },
    {
      title: 'Summer Collection',
      subtitle: 'Light. Fresh. Effortless.',
      image_url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2070&auto=format&fit=crop',
      gender: 'men',
      is_active: true,
      sort_order: 3,
    },
    {
      title: 'Elegant New Collection',
      subtitle: 'Refined style for the modern woman',
      image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
      gender: 'women',
      is_active: true,
      sort_order: 1,
    },
    {
      title: 'Spring Essentials',
      subtitle: 'Elegance in every detail',
      image_url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=2070&auto=format&fit=crop',
      gender: 'women',
      is_active: true,
      sort_order: 2,
    },
    {
      title: 'Exclusive Pieces',
      subtitle: 'Curated styles just for you',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop',
      gender: 'women',
      is_active: true,
      sort_order: 3,
    },
  ]

  // Check if banners already exist
  const { data: existing } = await supabase.from('banners').select('id')
  
  if (!existing || existing.length === 0) {
    const { error: insertError } = await supabase.from('banners').insert(defaultBanners)
    if (insertError) {
      console.log('Error inserting banners:', insertError.message)
    } else {
      console.log(`Inserted ${defaultBanners.length} default banners!`)
    }
  } else {
    console.log(`${existing.length} banners already exist, skipping insert.`)
  }

  // Verify
  const { data: allBanners } = await supabase.from('banners').select('*').order('sort_order')
  console.log('\nAll banners:')
  allBanners?.forEach(b => {
    console.log(`  [${b.gender}] ${b.title} - ${b.is_active ? 'Active' : 'Inactive'}`)
  })
  
  console.log('\nDone!')
}

setupBanners()

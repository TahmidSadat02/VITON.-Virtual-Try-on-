import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMTczMiwiZXhwIjoyMDg1MDg3NzMyfQ.Um3YrBU_nJkLJcvC5BWCCBXz3R_F6UJsenVdLnHSHN8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const email = 'tahmidsadat2002@gmail.com';
  
  console.log('Setting up admin access...\n');
  
  // Get user by email
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.error('❌ User not found');
    return;
  }
  
  console.log('✅ User found:', user.email);
  console.log('User ID:', user.id);
  
  // Check if admin_users table exists and insert
  const { data: existingAdmin, error: checkError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (existingAdmin) {
    console.log('\n✅ Already an admin!');
    return;
  }
  
  // Insert admin user
  const { data: newAdmin, error: insertError } = await supabase
    .from('admin_users')
    .insert([
      {
        user_id: user.id,
        email: user.email,
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ])
    .select();
  
  if (insertError) {
    console.error('❌ Error creating admin:', insertError.message);
    console.log('\nTable might not exist. Creating it via SQL...');
  } else {
    console.log('\n✅ Admin access granted!');
    console.log('You can now access: http://localhost:3000/admin');
  }
}

setupAdmin().catch(console.error);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMTczMiwiZXhwIjoyMDg1MDg3NzMyfQ.Um3YrBU_nJkLJcvC5BWCCBXz3R_F6UJsenVdLnHSHN8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '723280'; // Changed to 6 characters
  
  console.log('Creating admin account...\n');
  
  // Check if admin already exists
  const { data: users } = await supabase.auth.admin.listUsers();
  const existingAdmin = users.users.find(u => u.email === adminEmail);
  
  if (existingAdmin) {
    console.log('✅ Admin already exists:', adminEmail);
    console.log('User ID:', existingAdmin.id);
    
    // Update password
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      existingAdmin.id,
      { password: adminPassword }
    );
    
    if (passwordError) {
      console.error('❌ Error updating password:', passwordError.message);
    } else {
      console.log('✅ Password updated successfully!');
    }
  } else {
    // Create new admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true // Auto-confirm email
    });
    
    if (createError) {
      console.error('❌ Error creating admin:', createError.message);
      return;
    }
    
    console.log('✅ Admin created successfully!');
    console.log('User ID:', newUser.user.id);
  }
  
  console.log('\n📋 Admin Login Credentials:');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
  console.log('\nAccess admin panel at: http://localhost:3000/admin');
  
  // Test login
  console.log('\n🧪 Testing admin login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });
  
  if (loginError) {
    console.error('❌ Login test failed:', loginError.message);
  } else {
    console.log('✅ Login test successful!');
  }
}

createAdmin().catch(console.error);

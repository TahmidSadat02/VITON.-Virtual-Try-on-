import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMTczMiwiZXhwIjoyMDg1MDg3NzMyfQ.Um3YrBU_nJkLJcvC5BWCCBXz3R_F6UJsenVdLnHSHN8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixAuth() {
  const email = 'tahmidsadat2002@gmail.com';
  
  console.log('Checking user status...');
  
  // Get user by email using admin API
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found. Creating new user...');
    
    // Create user with auto-confirm
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: 'admin123',
      email_confirm: true // Auto-confirm email
    });
    
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    
    console.log('✅ User created and confirmed:', newUser.user.email);
    console.log('You can now login with:');
    console.log('Email:', email);
    console.log('Password: admin123');
    
  } else {
    console.log('User found:', user.email);
    console.log('Email confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
    console.log('Created at:', user.created_at);
    
    if (!user.email_confirmed_at) {
      console.log('\nManually confirming email...');
      
      const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      
      if (updateError) {
        console.error('Error confirming email:', updateError);
        return;
      }
      
      console.log('✅ Email confirmed successfully!');
    }
    
    // Update password to known value
    console.log('\nSetting password to: admin123');
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: 'admin123' }
    );
    
    if (passwordError) {
      console.error('Error updating password:', passwordError);
      return;
    }
    
    console.log('✅ Password updated successfully!');
    console.log('\nYou can now login with:');
    console.log('Email:', email);
    console.log('Password: admin123');
  }
  
  // Test login
  console.log('\nTesting login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: email,
    password: 'admin123'
  });
  
  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
  } else {
    console.log('✅ Login successful!');
    console.log('User ID:', loginData.user.id);
    console.log('Session created:', !!loginData.session);
  }
}

fixAuth().catch(console.error);

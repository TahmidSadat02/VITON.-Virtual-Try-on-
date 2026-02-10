import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogsjitiuhcsrnkxkqeji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2ppdGl1aGNzcm5reGtxZWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTE3MzIsImV4cCI6MjA4NTA4NzczMn0.zSQaxI5I9LrhM9n-ct_RN384vVg0ZHlZv39kZFwYqGU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  // Login first
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: '723280'
  });
  
  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    return;
  }
  
  console.log('✅ Login successful!');
  console.log('User email:', loginData.user.email);
  console.log('User ID:', loginData.user.id);
  
  // Check admin access
  const ADMIN_EMAILS = ['admin@gmail.com', 'tahmidsadat2002@gmail.com'];
  const isAdmin = ADMIN_EMAILS.some(email => 
    loginData.user.email?.toLowerCase() === email.toLowerCase()
  );
  
  console.log('\n🔐 Admin Check:');
  console.log('Is Admin?', isAdmin);
  console.log('Should have access to /admin:', isAdmin ? 'YES ✅' : 'NO ❌');
}

testAuth().catch(console.error);

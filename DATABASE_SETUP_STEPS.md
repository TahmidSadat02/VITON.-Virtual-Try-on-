# 🗄️ Database Setup Guide - Step by Step

Follow these steps **IN ORDER** to set up your Supabase database.

---

## Step 1: Run Database Schema (2 minutes)

### Instructions:

1. **Open Supabase Dashboard**:
   - Go to: https://ogsjitiuhcsrnkxkqeji.supabase.co

2. **Open SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"+ New query"** button

3. **Copy the Schema**:
   - Open the file: `supabase-schema.sql` in your project
   - Select ALL content (Cmd+A)
   - Copy (Cmd+C)

4. **Paste and Run**:
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or press Cmd+Enter)
   - Wait for completion

5. **Verify Success**:
   - You should see: ✅ **"Success. No rows returned"**
   - If you see errors, copy them and let me know

---

## Step 2: Verify Tables Created (1 minute)

1. **Go to Table Editor**:
   - Click **"Table Editor"** in the left sidebar

2. **Check for these 5 tables**:
   - ✅ `users`
   - ✅ `dresses`
   - ✅ `user_photos`
   - ✅ `try_on_sessions`
   - ✅ `admin_users`

3. **If tables are missing**:
   - Go back to SQL Editor
   - Check for any error messages
   - Try running the schema again

---

## Step 3: Create Storage Buckets (3 minutes)

### Bucket 1: user-photos

1. Click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Fill in:
   - Name: `user-photos`
   - Public bucket: **UNCHECKED** (keep it private)
4. Click **"Create bucket"**

### Bucket 2: dress-images

1. Click **"Create a new bucket"** again
2. Fill in:
   - Name: `dress-images`
   - Public bucket: **CHECKED** (make it public)
3. Click **"Create bucket"**

### Bucket 3: tryon-results

1. Click **"Create a new bucket"** again
2. Fill in:
   - Name: `tryon-results`
   - Public bucket: **UNCHECKED** (keep it private)
3. Click **"Create bucket"**

### Verify All Buckets:

You should now see 3 buckets:
- ✅ user-photos (🔒 Private)
- ✅ dress-images (🌐 Public)
- ✅ tryon-results (🔒 Private)

---

## Step 4: Apply Storage Policies (2 minutes)

1. **Go back to SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"+ New query"**

2. **Copy Storage Policies**:
   - Open the file: `storage-policies-fixed.sql` in your project
   - Select ALL content (Cmd+A)
   - Copy (Cmd+C)

3. **Paste and Run**:
   - Paste into Supabase SQL Editor
   - Click **"Run"** (or press Cmd+Enter)
   - Wait for completion

4. **Verify Success**:
   - You should see: ✅ **"Success. No rows returned"**

---

## Step 5: Configure Authentication (1 minute)

1. **Go to Authentication**:
   - Click **"Authentication"** in the left sidebar
   - Click **"URL Configuration"**

2. **Add Site URL**:
   - Site URL: `http://localhost:3000`
   - Click **"Save"**

3. **Add Redirect URLs**:
   - Click **"Add URL"** under Redirect URLs
   - Add: `http://localhost:3000/**`
   - Add: `http://localhost:3000/auth/callback`
   - Click **"Save"**

---

## ✅ Database Setup Complete!

Your Supabase database is now ready. You have:

- ✅ 5 database tables with relationships
- ✅ Row Level Security (RLS) enabled
- ✅ 3 storage buckets configured
- ✅ Storage policies applied
- ✅ Authentication URLs configured

---

## 🧪 Next: Test Your App

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open your app**: http://localhost:3000

3. **Sign up** with a test account:
   - Email: test@example.com
   - Password: Test123456!

4. **Verify in Supabase**:
   - Go to Authentication → Users
   - You should see your new account

5. **Try uploading a photo**:
   - Upload a test image
   - Go to Storage → user-photos
   - You should see your uploaded file

---

## 🔑 Create Your First Admin User

After signing up:

1. **Get your User ID**:
   - Go to Supabase → Authentication → Users
   - Click on your user
   - Copy the UUID (looks like: `123e4567-e89b-12d3-a456-426614174000`)

2. **Run this SQL**:
   - Go to SQL Editor
   - Run this query (replace the UUID):

   ```sql
   INSERT INTO public.admin_users (user_id, role)
   VALUES ('paste-your-uuid-here', 'super_admin');
   ```

3. **Access Admin Panel**:
   - Visit: http://localhost:3000/admin
   - You should now have admin access!

---

## 🚨 Troubleshooting

**"relation does not exist" error**:
→ Tables weren't created. Run `supabase-schema.sql` again.

**"bucket does not exist" error**:
→ Storage buckets missing. Create them manually in Storage.

**Can't sign up**:
→ Check Authentication URLs are configured correctly.

**Photos won't upload**:
→ Verify storage policies were applied successfully.

---

**Ready to test? Go to http://localhost:3000 and sign up! 🚀**

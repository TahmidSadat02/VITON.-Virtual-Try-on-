# 🚀 Quick Setup Guide - Supabase & Netlify

Follow these steps in order to get your Virtual Try-On app live!

---

## Step 1: Create Supabase Project (10 minutes)

### 1.1 Create Account & Project
1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended)
4. Click **"New project"**
5. Fill in:
   - **Name:** virtual-tryon (or your choice)
   - **Database Password:** Generate a strong password (save it somewhere safe!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
6. Click **"Create new project"**
7. ⏱️ Wait 2-3 minutes for database to provision

### 1.2 Get Your API Keys
1. In your Supabase dashboard, click **"Project Settings"** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 1.3 Update Environment Variables
1. Open `d:\sadat's Project\virtual-tryon\.env.local`
2. Replace these values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

---

## Step 2: Set Up Database (5 minutes)

### 2.1 Run SQL Schema
1. In Supabase dashboard, click **"SQL Editor"** in sidebar
2. Click **"New query"**
3. Open the file `supabase-schema.sql` in your project
4. Copy ALL contents (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. ✅ You should see "Success. No rows returned"

### 2.2 Verify Tables Created
1. Click **"Table Editor"** in sidebar
2. You should see these tables:
   - ✅ users
   - ✅ dresses
   - ✅ user_photos
   - ✅ try_on_sessions
   - ✅ admin_users

---

## Step 3: Create Storage Buckets (5 minutes)

### 3.1 Create Buckets
1. In Supabase dashboard, click **"Storage"** in sidebar
2. Click **"Create a new bucket"**

**Create Bucket 1:**
- Name: `user-photos`
- Public bucket: **OFF** (unchecked)
- Click **"Create bucket"**

**Create Bucket 2:**
- Name: `dress-images`
- Public bucket: **ON** (checked)
- Click **"Create bucket"**

**Create Bucket 3:**
- Name: `tryon-results`
- Public bucket: **OFF** (unchecked)
- Click **"Create bucket"**

### 3.2 Configure Storage Policies
1. Click on **"user-photos"** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Click **"Create a policy from scratch"**
5. Copy and paste the policies from `storage-policies.sql` file
6. Repeat for other buckets (see storage-policies.sql for all policies)

---

## Step 4: Test Locally (3 minutes)

1. Open terminal in `d:\sadat's Project\virtual-tryon`
2. Run:
   ```bash
   npm run dev
   ```
3. Open browser: **http://localhost:3000**
4. Click **"Sign Up"**
5. Create a test account
6. ✅ If you can sign up and see the dashboard, Supabase is working!

---

## Step 5: Get AI API Key (5 minutes)

### Option A: Hugging Face (Recommended - FREE)
1. Go to **https://huggingface.co**
2. Click **"Sign Up"** (can use GitHub)
3. After login, click your profile picture → **"Settings"**
4. Click **"Access Tokens"** in left menu
5. Click **"New token"**
   - Name: `virtual-tryon-api`
   - Role: **Read**
6. Click **"Generate a token"**
7. Copy the token (starts with `hf_...`)
8. Update `.env.local`:
   ```env
   AI_API_KEY=hf_your_token_here
   AI_API_URL=https://api-inference.huggingface.co/models/yisol/IDM-VTON
   ```

### Option B: Replicate (Limited Free)
1. Go to **https://replicate.com**
2. Sign up with GitHub
3. Go to Account → API tokens
4. Copy your API token
5. Update `.env.local`:
   ```env
   AI_API_KEY=r8_your_token_here
   AI_API_URL=https://api.replicate.com/v1/predictions
   ```

---

## Step 6: Push to GitHub (5 minutes)

### 6.1 Create GitHub Repository
1. Go to **https://github.com/new**
2. Repository name: `virtual-tryon`
3. Privacy: **Public** or **Private** (your choice)
4. **DO NOT** initialize with README (we already have one)
5. Click **"Create repository"**

### 6.2 Push Code
Open terminal in `d:\sadat's Project\virtual-tryon` and run:

```bash
git init
git add .
git commit -m "Initial commit - Virtual Try-On Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/virtual-tryon.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 7: Deploy to Netlify (10 minutes)

### 7.1 Connect Repository
1. Go to **https://app.netlify.com**
2. Sign up/Login with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"GitHub"**
5. Authorize Netlify if prompted
6. Search for `virtual-tryon` repository
7. Click on it

### 7.2 Configure Build Settings
Netlify will auto-detect settings from `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `.next`

Just click **"Deploy"** (we'll add env vars next)

⏱️ **First deployment will FAIL** - that's expected! We need to add environment variables.

### 7.3 Add Environment Variables
1. After deployment fails, click **"Site settings"**
2. Click **"Environment variables"** in left menu
3. Click **"Add a variable"** → **"Add a single variable"**

Add these one by one:

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: (paste your Supabase URL)

Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (paste your Supabase anon key)

Key: AI_API_KEY
Value: (paste your Hugging Face or Replicate key)

Key: AI_API_URL
Value: https://api-inference.huggingface.co/models/yisol/IDM-VTON

Key: NEXT_PUBLIC_APP_URL
Value: (your Netlify URL, e.g., https://your-app.netlify.app)

Key: NEXT_PUBLIC_MAX_FILE_SIZE
Value: 5242880

Key: NEXT_PUBLIC_DAILY_TRYON_LIMIT
Value: 5
```

### 7.4 Redeploy
1. Click **"Deploys"** in top menu
2. Click **"Trigger deploy"** → **"Deploy site"**
3. ⏱️ Wait 2-3 minutes for build
4. ✅ Once "Published", click the URL to view your site!

---

## Step 8: Configure Auth Redirect URLs

### 8.1 Update Supabase Auth Settings
1. Go to Supabase dashboard
2. Click **"Authentication"** in sidebar
3. Click **"URL Configuration"**
4. Set:
   - **Site URL:** `https://your-app.netlify.app`
   - **Redirect URLs:** Add both:
     - `https://your-app.netlify.app/**`
     - `http://localhost:3000/**`
5. Click **"Save"**

---

## Step 9: Create Your Admin Account

### 9.1 Sign Up
1. Go to your deployed site
2. Click **"Sign Up"**
3. Create your account

### 9.2 Make Yourself Admin
1. Go to Supabase dashboard
2. Click **"Authentication"** → **"Users"**
3. Find your user and copy the **UUID** (user ID)
4. Go to **"SQL Editor"**
5. Run this query (replace `YOUR_USER_ID`):
   ```sql
   INSERT INTO public.admin_users (user_id, role)
   VALUES ('YOUR_USER_ID', 'super_admin');
   ```
6. ✅ You now have admin access!

---

## Step 10: Test Everything! ✅

### Test Checklist:
- [ ] Can visit your live site
- [ ] Can sign up for an account
- [ ] Can log in
- [ ] Can see dashboard
- [ ] Can log out
- [ ] Local development still works

---

## 🎉 You're Done!

Your Virtual Try-On platform is now:
- ✅ Database configured on Supabase
- ✅ Storage buckets created
- ✅ Deployed on Netlify
- ✅ Authentication working
- ✅ Admin access configured

### Your URLs:
- **Live Site:** https://your-app.netlify.app
- **Supabase Dashboard:** https://supabase.com/dashboard/project/YOUR_PROJECT
- **Netlify Dashboard:** https://app.netlify.com

---

## 🆘 Troubleshooting

### "Auth error" when signing up:
- Check environment variables in Netlify
- Verify redirect URLs in Supabase Auth settings
- Make sure Site URL is set correctly

### Build fails on Netlify:
- Check build logs for specific error
- Verify all environment variables are set
- Make sure Next.js version is compatible

### Can't log in locally:
- Check `.env.local` has correct values
- Run `npm run dev` again
- Clear browser cookies for localhost

### Storage upload fails:
- Verify storage buckets are created
- Check bucket names match code exactly
- Ensure storage policies are applied

---

## Need Help?
- Check `SETUP_GUIDE.md` for detailed information
- Review Supabase docs: https://supabase.com/docs
- Review Netlify docs: https://docs.netlify.com

---

## Next Steps
Once everything is working, continue building:
1. Dress catalog pages
2. Photo upload feature
3. Virtual try-on interface
4. AI integration
5. Admin panel

Let me know when you're ready to continue development!

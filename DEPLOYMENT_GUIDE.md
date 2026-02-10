# 🚀 Complete Setup Guide: Supabase + Netlify Deployment


This guide will help you connect your Virtual Try-On app to Supabase and deploy it to Netlify.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Supabase account (free)
- Netlify account (free)

---

## Part 1: Supabase Setup (15 minutes)

### Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign in** with GitHub
3. **Create New Project**:
   - Click "New Project"
   - Project Name: `virtual-tryon`
   - Database Password: Generate and save securely
   - Region: Choose closest to you
   - Plan: Free tier
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

### Step 2: Get API Credentials

1. In Supabase Dashboard → **Settings** (gear icon)
2. Click **API** section
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: The long key under "Project API keys"
   - **service_role key**: (optional, for admin operations)

### Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Set Up Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql` from your project
4. Paste and click **Run** (or Ctrl+Enter)
5. Verify success: "Success. No rows returned"

### Step 5: Verify Tables

Go to **Table Editor** and confirm these tables exist:
- ✅ users
- ✅ dresses
- ✅ user_photos
- ✅ try_on_sessions
- ✅ admin_users

### Step 6: Create Storage Buckets

Go to **Storage** section and create 3 buckets:

**Bucket 1: user-photos**
- Name: `user-photos`
- Public: **NO** (private)
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp

**Bucket 2: dress-images**
- Name: `dress-images`
- Public: **YES** (public)
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp

**Bucket 3: tryon-results**
- Name: `tryon-results`
- Public: **NO** (private)
- File size limit: 10MB
- Allowed MIME types: image/jpeg, image/png, image/webp

### Step 7: Configure Storage Policies

1. Run the SQL from `storage-policies.sql` or `storage-policies-fixed.sql`
2. Or manually create policies in Storage → Select bucket → Policies tab

### Step 8: Create First Admin User (Optional)

After signing up through the app:

```sql
-- In SQL Editor, run this with your user ID
INSERT INTO public.admin_users (user_id, role)
VALUES ('your-user-uuid-here', 'super_admin');
```

To find your user ID:
1. Sign up in the app
2. Go to Supabase → Authentication → Users
3. Copy your user's UUID
4. Run the SQL above with that UUID

---

## Part 2: Local Testing (5 minutes)

### Test the Connection

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open browser**: http://localhost:3000

4. **Test features**:
   - Sign up with email/password
   - Upload a photo
   - Browse dresses
   - Try virtual try-on

5. **Verify in Supabase**:
   - Check Authentication → Users (should see your account)
   - Check Table Editor → users (should see your profile)
   - Check Storage → user-photos (should see uploaded photos)

---

## Part 3: Deploy to Netlify (10 minutes)

### Step 1: Prepare for Deployment

1. **Create `.gitignore`** (if not exists) and ensure it includes:
```
.env.local
.env
node_modules
.next
```

2. **Commit your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/virtual-tryon.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. **Sign in** with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** and authorize
5. Select your `virtual-tryon` repository

### Step 3: Configure Build Settings

**Build settings**:
- Base directory: (leave empty)
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: (leave empty)

**Install Next.js plugin**:
- Netlify will auto-detect Next.js and suggest the plugin
- Click "Yes" to install `@netlify/plugin-nextjs`

### Step 4: Add Environment Variables

In Netlify:
1. Go to **Site configuration** → **Environment variables**
2. Click **"Add a variable"** and add each:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
```

**Important**: Set scope to "All scopes" or "Production, Deploy Previews, and Branch deploys"

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait 2-5 minutes for build to complete
3. Your site will be live at: `https://random-name.netlify.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to:
   - Buy a domain through Netlify, or
   - Use your existing domain

---

## Part 4: Update Supabase URL Settings

### Configure Authentication URLs

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Netlify URL:

**Site URL**: `https://your-app.netlify.app`

**Redirect URLs** (add all):
- `https://your-app.netlify.app/*`
- `https://your-app.netlify.app/auth/callback`
- `http://localhost:3000/*` (for local development)

3. Click **Save**

---

## Part 5: Verify Deployment

### Test Production Site

1. Visit your Netlify URL
2. Test these features:
   - ✅ Sign up / Login
   - ✅ Upload photos
   - ✅ Browse dresses
   - ✅ Virtual try-on
   - ✅ Profile page
   - ✅ Admin panel (if admin)

### Common Issues & Solutions

**Issue: "Invalid API key" error**
- Solution: Check environment variables in Netlify are correct
- Redeploy after updating env vars

**Issue: "Failed to fetch" errors**
- Solution: Check Supabase URL configuration includes Netlify domain

**Issue: Authentication not working**
- Solution: Verify redirect URLs in Supabase include your Netlify domain

**Issue: Images not loading**
- Solution: Check storage bucket policies are set correctly

**Issue: Build fails on Netlify**
- Solution: Check build logs, ensure all dependencies are in `package.json`

---

## 🎉 Deployment Complete!

Your Virtual Try-On app is now live! Share your Netlify URL with users.

### Next Steps:

1. **Add sample dresses** through admin panel
2. **Invite beta testers** to try the app
3. **Monitor usage** in Supabase Dashboard
4. **Set up monitoring** (optional):
   - Netlify Analytics
   - Sentry for error tracking
   - Google Analytics

### Useful Commands:

```bash
# Local development
npm run dev

# Build for production (test locally)
npm run build
npm start

# Check for errors
npm run lint

# View Netlify logs
netlify logs

# Redeploy manually
git push origin main
```

### Support Resources:

- **Supabase Docs**: https://supabase.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 📊 Monitor Your App

### Supabase Dashboard
- **Database**: Monitor table sizes and queries
- **Auth**: Track user signups and logins
- **Storage**: Check storage usage
- **Logs**: View real-time logs

### Netlify Dashboard
- **Deploys**: View build history
- **Analytics**: Track visitors (if enabled)
- **Functions**: Monitor serverless functions
- **Forms**: Track form submissions

---

## 🔒 Security Checklist

- ✅ Never commit `.env.local` to GitHub
- ✅ Use environment variables for all secrets
- ✅ Enable RLS policies on all Supabase tables
- ✅ Set up proper storage bucket policies
- ✅ Use HTTPS only (Netlify provides this automatically)
- ✅ Regularly update dependencies: `npm update`
- ✅ Monitor Supabase logs for suspicious activity

---

**Congratulations! Your app is deployed! 🚀**

If you encounter any issues, refer to the troubleshooting section or check the documentation links above.

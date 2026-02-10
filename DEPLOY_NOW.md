# 🚀 Quick Start - Deploy in 3 Steps

**Goal**: Get your Virtual Try-On app live on Netlify with Supabase backend

---

## Step 1: Setup Supabase (5 minutes)

1. **Create account**: https://supabase.com → Sign in with GitHub
2. **Create project**: "New Project" → Name it `virtual-tryon` → Wait 2 min
3. **Get credentials**: Settings → API → Copy:
   - Project URL
   - anon public key
4. **Setup database**: SQL Editor → Paste `supabase-schema.sql` → Run
5. **Create storage**: Storage → Create 3 buckets:
   - `user-photos` (private)
   - `dress-images` (public)  
   - `tryon-results` (private)
6. **Add policies**: SQL Editor → Paste `storage-policies-fixed.sql` → Run

---

## Step 2: Configure Locally (2 minutes)

1. **Run setup script**:
   ```bash
   ./setup.sh
   ```
   (or `.\setup.ps1` on Windows)

2. **Edit `.env.local`** and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

3. **Test locally**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and test signup

---

## Step 3: Deploy to Netlify (5 minutes)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect Netlify**: 
   - https://app.netlify.com → "Add new site" → Import from GitHub
   - Select your repo → Netlify auto-detects Next.js

3. **Add environment variables** in Netlify:
   - Site settings → Environment variables → Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**: Click "Deploy site" → Wait 3 minutes

5. **Configure Supabase redirect**: 
   - Supabase → Authentication → URL Configuration
   - Add: `https://your-app.netlify.app/*`

---

## ✅ Done!

Your app is live at: `https://your-app.netlify.app`

**Test it**: Sign up → Upload photo → Try on dresses

---

## 📚 Need More Details?

- **Full guide**: Read `DEPLOYMENT_GUIDE.md`
- **Checklist**: Use `PRE_DEPLOYMENT_CHECKLIST.md`
- **Issues**: Check troubleshooting in `DEPLOYMENT_GUIDE.md`

---

## 🎯 Create First Admin User

After signing up:

1. Get your user ID from Supabase → Authentication → Users
2. Run in SQL Editor:
   ```sql
   INSERT INTO public.admin_users (user_id, role)
   VALUES ('your-uuid-here', 'super_admin');
   ```
3. Visit `/admin` to access admin panel

---

## 🔧 Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# Redeploy
git push
```

---

**Questions?** Check the full guides or Supabase/Netlify documentation.

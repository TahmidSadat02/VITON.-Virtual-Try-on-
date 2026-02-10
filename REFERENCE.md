# 📋 Copy-Paste Reference Sheet

Quick reference for values you'll need during setup.

---

## 🔑 Environment Variables Template

### For .env.local (Local Development)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Service (Hugging Face)
AI_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AI_API_URL=https://api-inference.huggingface.co/models/yisol/IDM-VTON

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DAILY_TRYON_LIMIT=5
```

### For Netlify (Production)

Same as above, but change the APP_URL:
```env
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

---

## 🗄️ Storage Bucket Names

When creating buckets in Supabase, use EXACTLY these names:

1. **user-photos** (Private)
2. **dress-images** (Public)
3. **tryon-results** (Private)

---

## 📝 Git Commands

### Initialize and Push to GitHub

```bash
# Navigate to project
cd "d:\sadat's Project\virtual-tryon"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Virtual Try-On Platform"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/virtual-tryon.git

# Push to GitHub
git push -u origin main
```

---

## 🔗 Important URLs

### Supabase
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

### Netlify
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com

### AI Services
- Hugging Face: https://huggingface.co
- Replicate: https://replicate.com

### GitHub
- New Repo: https://github.com/new

---

## 💾 SQL Queries for Setup

### Make User Admin (After Signup)

```sql
-- Replace YOUR_USER_ID with your actual UUID from Supabase Auth
INSERT INTO public.admin_users (user_id, role)
VALUES ('YOUR_USER_ID', 'super_admin');
```

### Verify Tables Exist

```sql
-- Run this to check if all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check Your Admin Status

```sql
-- Verify you're an admin
SELECT * FROM public.admin_users;
```

---

## 🎨 Netlify Build Settings

These are auto-detected from `netlify.toml`, but if asked:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18 or higher

---

## 📁 File Locations Reference

### Files You'll Edit:
- `.env.local` - Add your credentials here

### Files You'll Copy From:
- `supabase-schema.sql` - Database schema (copy to Supabase SQL Editor)
- `storage-policies.sql` - Storage policies (copy to Supabase Storage)

### Files You'll Read:
- `START_HERE.md` - Overview and quick start
- `QUICK_SETUP.md` - Detailed step-by-step guide
- `SETUP_CHECKLIST.md` - Progress tracking

---

## 🧪 Test Commands

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (test)
npm run build

# Start production build locally
npm start
```

### Git Status Check
```bash
# Check current status
git status

# View remote
git remote -v

# View branches
git branch
```

---

## ⚠️ Common Values to Replace

When you see these in guides, replace with your actual values:

| Placeholder | Replace With | Where to Find |
|-------------|--------------|---------------|
| `YOUR_USERNAME` | Your GitHub username | github.com (top right) |
| `YOUR_USER_ID` | Your Supabase user UUID | Supabase → Auth → Users |
| `xxxxx.supabase.co` | Your project URL | Supabase → Settings → API |
| `your-site-name.netlify.app` | Your Netlify URL | Netlify dashboard |
| `hf_xxx...` | Your HuggingFace token | HuggingFace → Settings → Tokens |

---

## 🎯 Quick Verification

### After Supabase Setup:
```bash
# Your .env.local should have real values (not "your_xxx_here")
# Tables should be visible in Supabase Table Editor
# Buckets should be visible in Supabase Storage
```

### After Local Test:
```bash
# npm run dev should start without errors
# Can access localhost:3000
# Can sign up for account
# Can see dashboard
```

### After Deployment:
```bash
# Netlify build should succeed
# Can access your .netlify.app URL
# Can sign up on production
# Can log in on production
```

---

## 📞 Support Resources

- **Supabase Issues:** https://github.com/supabase/supabase/discussions
- **Next.js Docs:** https://nextjs.org/docs
- **Netlify Support:** https://answers.netlify.com

---

## ✅ Pre-Flight Checklist

Before starting, make sure you have:
- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] Text editor (VS Code recommended)
- [ ] Modern web browser

---

## 🚀 Ready?

**Next Step:** Open `START_HERE.md` and follow the instructions!

This file is just a reference - keep it open in a tab for quick copy-paste access.

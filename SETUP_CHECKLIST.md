# ✅ Setup Verification Checklist

Use this checklist to verify your setup is complete and working correctly.

---

## 📋 Pre-Deployment Checklist

### Supabase Configuration
- [ ] Supabase project created
- [ ] Project URL copied to `.env.local`
- [ ] Anon key copied to `.env.local`
- [ ] SQL schema executed successfully (supabase-schema.sql)
- [ ] All 5 tables visible in Table Editor:
  - [ ] users
  - [ ] dresses
  - [ ] user_photos
  - [ ] try_on_sessions
  - [ ] admin_users
- [ ] Storage buckets created:
  - [ ] user-photos (private)
  - [ ] dress-images (public)
  - [ ] tryon-results (private)
- [ ] Storage policies applied (from storage-policies.sql)

### AI Service Configuration
- [ ] Hugging Face OR Replicate account created
- [ ] API token generated
- [ ] API key added to `.env.local`
- [ ] API URL configured in `.env.local`

### Local Development
- [ ] All dependencies installed (`npm install` completed)
- [ ] `.env.local` file exists with all values filled
- [ ] Development server runs (`npm run dev` works)
- [ ] Can access http://localhost:3000
- [ ] No console errors in browser

---

## 🧪 Local Testing Checklist

### Authentication Tests
- [ ] Sign up page loads (/signup)
- [ ] Can create new account
- [ ] Receives success message
- [ ] Redirects to dashboard
- [ ] Dashboard shows user email/name
- [ ] Can log out
- [ ] Login page loads (/login)
- [ ] Can log in with created account
- [ ] Can't access dashboard when logged out (redirects to login)

### Database Connection Tests
- [ ] No Supabase connection errors in console
- [ ] User profile created in database (check Supabase Table Editor → users)
- [ ] Auth middleware working (protected routes redirect)

---

## 🌐 Deployment Checklist

### GitHub
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] `.env.local` is NOT in repository (should be in .gitignore)

### Netlify Setup
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Site deployed (even if failed initially)
- [ ] All environment variables added:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] AI_API_KEY
  - [ ] AI_API_URL
  - [ ] NEXT_PUBLIC_APP_URL
  - [ ] NEXT_PUBLIC_MAX_FILE_SIZE
  - [ ] NEXT_PUBLIC_DAILY_TRYON_LIMIT
- [ ] Build completed successfully
- [ ] Site is published
- [ ] Can access live URL

### Supabase Production Config
- [ ] Site URL updated in Supabase Auth settings
- [ ] Redirect URLs added:
  - [ ] https://your-app.netlify.app/**
  - [ ] http://localhost:3000/**

---

## ✅ Production Testing Checklist

### Live Site Tests
- [ ] Can access deployed site URL
- [ ] Home page loads correctly
- [ ] Sign up page works
- [ ] Can create account on production
- [ ] Receives confirmation
- [ ] Redirects to dashboard
- [ ] Dashboard loads properly
- [ ] Navigation works
- [ ] Can log out
- [ ] Can log back in

### Admin Access
- [ ] Admin user record created in database
- [ ] UUID correctly copied from Supabase Authentication
- [ ] SQL insert query executed successfully
- [ ] Can verify admin record exists in admin_users table

---

## 🔍 Verification Commands

Run these in your terminal to verify setup:

```bash
# Check if all required files exist
dir .env.local
dir netlify.toml
dir supabase-schema.sql
dir storage-policies.sql

# Check if dependencies are installed
dir node_modules

# Test local build
npm run build

# Check git status
git status

# Check git remote
git remote -v
```

---

## 🎯 Success Criteria

Your setup is complete when:
- ✅ Local development server runs without errors
- ✅ Can sign up and log in locally
- ✅ Can sign up and log in on production
- ✅ Database tables visible in Supabase
- ✅ Storage buckets created
- ✅ Site deployed on Netlify
- ✅ Admin account configured

---

## 📊 Environment Variables Reference

### Required in `.env.local` (local development):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
AI_API_KEY=hf_xxx... or r8_xxx...
AI_API_URL=https://api-inference.huggingface.co/models/yisol/IDM-VTON
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DAILY_TRYON_LIMIT=5
```

### Required in Netlify (production):
Same as above, but change:
```env
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key" error
**Solution:** Double-check API keys in environment variables, ensure no extra spaces

### Issue: Can't sign up
**Solution:** Check Supabase Auth URL configuration, verify redirect URLs

### Issue: Build fails on Netlify
**Solution:** Check build logs, verify all environment variables are set

### Issue: Database queries fail
**Solution:** Verify SQL schema ran successfully, check RLS policies

### Issue: Can't upload images
**Solution:** Verify storage buckets created, check storage policies applied

---

## 📞 Getting Help

If you're stuck:
1. Check the error message in browser console
2. Check Netlify build logs
3. Check Supabase logs
4. Review QUICK_SETUP.md
5. Review SETUP_GUIDE.md

---

## ✨ Next Steps

Once all checkboxes are checked:
- [ ] Continue with feature development (dress catalog, photo upload, etc.)
- [ ] Add sample dresses to database
- [ ] Test AI integration
- [ ] Build admin panel

Congratulations! Your platform is ready for development! 🎉

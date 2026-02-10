# 🎯 Pre-Deployment Checklist

Use this checklist before deploying to Netlify.

---

## ✅ Supabase Setup

### Account & Project
- [ ] Created Supabase account at https://supabase.com
- [ ] Created new project
- [ ] Saved database password securely
- [ ] Project is fully provisioned (no loading indicators)

### API Configuration
- [ ] Copied Project URL from Settings → API
- [ ] Copied anon/public key from Settings → API
- [ ] Copied service_role key (optional, for admin features)
- [ ] Updated `.env.local` with all credentials

### Database Schema
- [ ] Opened SQL Editor in Supabase
- [ ] Ran entire `supabase-schema.sql` file
- [ ] Verified "Success. No rows returned" message
- [ ] Confirmed all tables exist in Table Editor:
  - [ ] users
  - [ ] dresses
  - [ ] user_photos
  - [ ] try_on_sessions
  - [ ] admin_users

### Storage Buckets
- [ ] Created `user-photos` bucket (private)
- [ ] Created `dress-images` bucket (public)
- [ ] Created `tryon-results` bucket (private)
- [ ] Ran storage policies from `storage-policies.sql` or `storage-policies-fixed.sql`
- [ ] Verified policies are active for each bucket

### Authentication
- [ ] Email provider enabled (Settings → Authentication → Providers)
- [ ] Set Site URL to production domain (or localhost for testing)
- [ ] Added redirect URLs for both localhost and production

---

## ✅ Local Testing

### Environment Setup
- [ ] Ran `npm install` to install dependencies
- [ ] Verified `.env.local` has correct Supabase credentials
- [ ] No errors during `npm run build`

### Feature Testing
- [ ] Ran `npm run dev` successfully
- [ ] Opened http://localhost:3000
- [ ] Signed up with test account
- [ ] Verified user appears in Supabase Authentication
- [ ] Uploaded test photo
- [ ] Verified photo appears in Supabase Storage → user-photos
- [ ] Browsed dresses page (add test dresses if needed)
- [ ] Tested virtual try-on feature
- [ ] Checked profile page
- [ ] Logged out and logged back in

### Admin Testing (if applicable)
- [ ] Created admin user in Supabase (INSERT INTO admin_users...)
- [ ] Accessed /admin route
- [ ] Verified admin dashboard loads
- [ ] Tested adding a dress
- [ ] Verified dress appears in Storage → dress-images

---

## ✅ Code Preparation

### Version Control
- [ ] Code is committed to Git
- [ ] `.env.local` is in `.gitignore` (should NOT be committed)
- [ ] `.env.local.example` exists as template
- [ ] Pushed code to GitHub

### Configuration Files
- [ ] `next.config.ts` is properly configured
- [ ] `netlify.toml` exists and is configured
- [ ] `package.json` has all required dependencies
- [ ] No TypeScript errors (`npm run build` succeeds)

### Cleanup
- [ ] Removed any test/debug console.logs
- [ ] Removed any hardcoded credentials
- [ ] All TODO comments addressed or documented

---

## ✅ Netlify Setup

### Account & Project
- [ ] Created Netlify account at https://netlify.com
- [ ] Signed in with GitHub
- [ ] Connected GitHub repository
- [ ] Netlify auto-detected Next.js

### Build Configuration
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Next.js plugin installed automatically

### Environment Variables
Added to Site settings → Environment variables:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (optional)
- [ ] All variables set to "All scopes"

### Deployment
- [ ] Triggered first deploy
- [ ] Build completed successfully
- [ ] No build errors in deploy log
- [ ] Site is accessible at Netlify URL

---

## ✅ Post-Deployment Verification

### Supabase Configuration
- [ ] Updated Site URL in Supabase to production URL
- [ ] Added production URL to Redirect URLs
- [ ] Format: `https://your-app.netlify.app/*`

### Production Testing
- [ ] Visited production URL
- [ ] Sign up works on production
- [ ] Login works on production
- [ ] Photo upload works on production
- [ ] Can browse dresses
- [ ] Virtual try-on works
- [ ] Profile page accessible
- [ ] Admin panel works (if applicable)

### Performance & Security
- [ ] All images load correctly
- [ ] No console errors in browser
- [ ] HTTPS is working (automatic with Netlify)
- [ ] Authentication redirects work properly

---

## ✅ Optional Enhancements

### Custom Domain
- [ ] Added custom domain in Netlify
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Updated Supabase URLs to use custom domain

### Monitoring
- [ ] Set up Netlify Analytics (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enabled Supabase logs monitoring

### Data Population
- [ ] Added sample dresses through admin panel
- [ ] Uploaded high-quality dress images
- [ ] Created test user accounts

---

## 🚨 Common Issues to Check

### Authentication Issues
- [ ] Supabase redirect URLs include production domain
- [ ] Environment variables are exactly correct (no extra spaces)
- [ ] Email confirmation is disabled for testing (or configured for production)

### Storage Issues
- [ ] Storage policies allow authenticated users to upload
- [ ] Bucket permissions are correct (public vs private)
- [ ] File size limits are appropriate (5-10MB)

### Build Issues
- [ ] All dependencies in `package.json`
- [ ] No missing environment variables
- [ ] TypeScript compiles without errors
- [ ] Next.js version compatible with Netlify

---

## 📝 Notes

**Deployment Date**: _________________

**Production URL**: _________________

**Supabase Project**: _________________

**Known Issues**: 
_________________________________
_________________________________
_________________________________

**Next Steps**:
_________________________________
_________________________________
_________________________________

---

## ✨ Deployment Complete!

Once all boxes are checked, your app should be fully functional in production!

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Check Supabase logs
4. Refer to DEPLOYMENT_GUIDE.md for troubleshooting

**Need help?** Check the documentation:
- Supabase: https://supabase.com/docs
- Netlify: https://docs.netlify.com
- Next.js: https://nextjs.org/docs

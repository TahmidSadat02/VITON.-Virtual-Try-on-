# Virtual Try-On Platform - Setup Guide

## Project Status

✅ **Completed:**
- Next.js 14 project initialization with TypeScript and Tailwind CSS
- Supabase client configuration and middleware
- Authentication pages (Login, Signup)
- Home page with landing UI
- Dashboard layout with navigation
- Environment configuration files
- Netlify deployment configuration
- Database schema SQL file

🚧 **Next Steps:**
1. Set up Supabase project
2. Create dress catalog pages
3. Implement photo upload functionality
4. Build virtual try-on interface
5. Integrate AI service
6. Create admin panel

---

## Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details
   - Wait for database to provision

2. **Get Your API Credentials:**
   - Go to Project Settings → API
   - Copy `Project URL` and `anon public` key
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Run Database Schema:**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents from `supabase-schema.sql`
   - Execute the SQL script
   - This creates all tables, indexes, RLS policies, and triggers

4. **Create Storage Buckets:**
   - Go to Storage in Supabase dashboard
   - Create three buckets:
     
     **Bucket 1: user-photos**
     - Name: `user-photos`
     - Public: ❌ (Private)
     - File size limit: 5MB
     - Allowed MIME types: `image/jpeg`, `image/png`, `image/jpg`
     
     **Bucket 2: dress-images**
     - Name: `dress-images`
     - Public: ✅ (Public)
     - File size limit: 5MB
     - Allowed MIME types: `image/jpeg`, `image/png`, `image/jpg`
     
     **Bucket 3: tryon-results**
     - Name: `tryon-results`
     - Public: ❌ (Private)
     - File size limit: 10MB
     - Allowed MIME types: `image/jpeg`, `image/png`, `image/jpg`

5. **Configure Storage Policies:**
   
   For `user-photos`:
   ```sql
   -- Users can upload their own photos
   CREATE POLICY "Users can upload own photos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Users can view their own photos
   CREATE POLICY "Users can view own photos"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Users can delete their own photos
   CREATE POLICY "Users can delete own photos"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

   For `dress-images`:
   ```sql
   -- Anyone can view dress images
   CREATE POLICY "Public access to dress images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'dress-images');

   -- Only admins can upload dress images
   CREATE POLICY "Admins can upload dress images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'dress-images' AND
     EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
   );
   ```

   For `tryon-results`:
   ```sql
   -- Users can view their own results
   CREATE POLICY "Users can view own results"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'tryon-results' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- System can insert results
   CREATE POLICY "Authenticated users can create results"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'tryon-results' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

6. **Create First Admin User:**
   ```sql
   -- After you sign up through the app, run this SQL to make yourself admin
   INSERT INTO public.admin_users (user_id, role)
   VALUES ('your-user-id-here', 'super_admin');
   ```

### 2. AI Service Setup

Choose one of these FREE options:

#### Option A: Hugging Face Inference API (Recommended for Free Tier)

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for free account
3. Go to Settings → Access Tokens
4. Create new token with "Read" permissions
5. Update `.env.local`:
   ```
   AI_API_KEY=hf_your_token_here
   AI_API_URL=https://api-inference.huggingface.co/models/
   ```

**Best Free Models:**
- `yisol/IDM-VTON` - Virtual try-on model
- `levihsu/OOTDiffusion` - Outfit try-on
- `stabilityai/stable-diffusion-2-1` - General image generation

#### Option B: Replicate (Limited Free Tier)

1. Go to [replicate.com](https://replicate.com)
2. Sign up and get API token
3. Update `.env.local`:
   ```
   AI_API_KEY=r8_your_token_here
   AI_API_URL=https://api.replicate.com/v1/predictions
   ```

**Note:** Replicate free tier is very limited. Consider implementing daily user limits.

### 3. Local Development

1. **Install Dependencies:**
   ```bash
   cd virtual-tryon
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Test signup/login functionality
   - Verify Supabase connection

### 4. Netlify Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings are auto-detected from `netlify.toml`

3. **Add Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `AI_API_KEY`
     - `AI_API_URL`
     - `NEXT_PUBLIC_APP_URL` (your netlify URL)
     - `NEXT_PUBLIC_MAX_FILE_SIZE`
     - `NEXT_PUBLIC_DAILY_TRYON_LIMIT`

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `your-site-name.netlify.app`

### 5. Post-Deployment Setup

1. **Update Supabase Auth Settings:**
   - Go to Authentication → URL Configuration in Supabase
   - Add your Netlify URL to "Site URL"
   - Add redirect URLs:
     - `https://your-site.netlify.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

2. **Test Production:**
   - Sign up with new account
   - Test all features
   - Monitor Supabase logs for any issues

---

## Free Tier Limits & Management

### Supabase Free Tier:
- **Database:** 500MB
- **Storage:** 1GB
- **Bandwidth:** Unlimited

**Optimization Strategies:**
- Compress images before upload (use next/image optimization)
- Auto-delete old try-on results after 30 days
- Limit user uploads (e.g., max 10 photos per user)

### Netlify Free Tier:
- **Bandwidth:** 100GB/month
- **Build minutes:** 300/month
- **Serverless functions:** 125K requests/month

**Optimization Strategies:**
- Enable caching headers
- Use Netlify CDN for static assets
- Minimize unnecessary deploys

### AI API Free Tier:
- **Hugging Face:** Limited requests (rate-limited, not hard cap)
- **Replicate:** Very limited free credits

**Optimization Strategies:**
- Implement daily user limits (5 try-ons/day)
- Add request queuing
- Cache common results
- Show usage counter to users

---

## File Structure

```
virtual-tryon/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Signup page
│   │   └── layout.tsx              # Auth layout
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx      # Main dashboard
│   │   ├── dresses/                # Dress catalog (TO BE CREATED)
│   │   ├── try-on/                 # Try-on interface (TO BE CREATED)
│   │   ├── history/                # User history (TO BE CREATED)
│   │   ├── profile/                # User profile (TO BE CREATED)
│   │   └── layout.tsx              # Dashboard layout
│   ├── admin/                       # Admin panel (TO BE CREATED)
│   ├── api/                         # API routes (TO BE CREATED)
│   └── page.tsx                     # Home/landing page
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── middleware.ts           # Auth middleware
│   ├── types/
│   │   └── database.types.ts       # TypeScript types
│   ├── validations/
│   │   └── schemas.ts              # Zod schemas
│   ├── store/
│   │   └── index.ts                # Zustand stores
│   └── utils.ts                    # Utility functions
├── components/                      # React components (TO BE CREATED)
├── .env.local                       # Environment variables (not committed)
├── .env.example                     # Example env file
├── netlify.toml                     # Netlify configuration
├── supabase-schema.sql             # Database schema
├── middleware.ts                    # Next.js middleware
└── README.md                        # Project documentation
```

---

## Next Implementation Steps

1. **Dress Catalog Pages:**
   - Create dress listing page with grid/list views
   - Add filters (category, color, size, search)
   - Implement pagination
   - Create dress detail modal

2. **Photo Upload:**
   - Build upload component with react-dropzone
   - Add image preview and cropping
   - Integrate with Supabase storage
   - Create photo management page

3. **Try-On Interface:**
   - Create photo + dress selection UI
   - Add text prompt input
   - Build result display component
   - Implement save to favorites

4. **AI Integration:**
   - Create API route for try-on generation
   - Implement Hugging Face API calls
   - Add error handling and retries
   - Create status polling system

5. **Admin Panel:**
   - Build analytics dashboard
   - Create dress CRUD interface
   - Add user management table
   - Implement bulk operations

6. **Polish & Optimization:**
   - Add loading states
   - Implement error boundaries
   - Add toast notifications
   - Optimize images
   - Add SEO meta tags

---

## Troubleshooting

### Supabase Connection Issues:
- Verify API keys in `.env.local`
- Check Supabase project is not paused
- Verify middleware is running correctly

### Authentication Not Working:
- Check redirect URLs in Supabase Auth settings
- Verify cookies are enabled
- Clear browser cookies and try again

### Storage Upload Fails:
- Verify storage policies are created
- Check file size limits
- Ensure bucket names match code

### Build Fails on Netlify:
- Check environment variables are set
- Verify Node version compatibility
- Review build logs for specific errors

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Netlify Docs:** https://docs.netlify.com
- **Hugging Face API:** https://huggingface.co/docs/api-inference

---

Ready to continue implementation? Let me know which feature to build next!

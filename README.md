# Virtual Try-On Platform

A full-stack AI-powered virtual try-on web application where users can upload photos, select dresses from a catalog, and generate realistic try-on previews using AI.

## Features

### User Features
- 🔐 Secure authentication (Email/Password)
- 📸 Photo upload with preview
- 👗 Browse dress catalog with filters
- 🤖 AI-powered virtual try-on
- 💬 Custom text prompts for try-on generation
- ⭐ Save favorites and view history
- 📱 Fully responsive design

### Admin Features
- 📊 Analytics dashboard
- 👗 Dress CRUD operations
- 👥 User management
- 📈 Try-on statistics
- 🎨 Content moderation

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Auth + Storage)
- **AI**: Hugging Face / Replicate API
- **Hosting**: Netlify
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- AI API key (Hugging Face or Replicate)

### Installation

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase URL and Anon Key
- AI API key
- App configuration

3. Set up Supabase
   - Create a new Supabase project
   - Run the SQL script from `supabase-schema.sql` in the SQL Editor
   - Create storage buckets:
     - `user-photos` (private, 5MB limit)
     - `dress-images` (public, 5MB limit)
     - `tryon-results` (private, 10MB limit)

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
virtual-tryon/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and configs
│   ├── supabase/         # Supabase client & middleware
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## Deployment

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## Free Tier Limits

- **Supabase**: 500MB database, 1GB storage
- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **AI API**: Limited free calls (implement rate limiting)

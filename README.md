# Virtual Try-On -- Premium Fashion E-Commerce

A modern luxury fashion web application with AI-powered virtual try-on technology. Built with Next.js 16, React 19, TypeScript, and Supabase.

## Features

- Gender-based shopping with separate curated collections for Men and Women
- Luxury minimal UI inspired by Zara and H&M aesthetics
- Smooth animations and transitions powered by Framer Motion
- Admin dashboard with full CRUD for product management
- Secure authentication with role-based access control
- Fully responsive, mobile-first design
- Real-time product catalog powered by Supabase

## Tech Stack

- Frontend: Next.js 16.1.6 (App Router), React 19, TypeScript, Tailwind CSS
- Animations: Framer Motion
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Fonts: Playfair Display + Inter

## Design

Clean, sophisticated interface with a neutral color palette (black, white, beige). Split-screen gender selection landing page, premium product cards with hover effects, sticky navbar with profile dropdown, and elegant page transitions throughout.

## Getting Started

```
git clone https://github.com/TahmidSadat02/VITON.-Virtual-Try-on-.git
cd VITON.-Virtual-Try-on-
npm install
```

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run the dev server:

```
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
app/
  page.tsx              -- Gender selection landing page
  men/                  -- Men's shopping page
  women/                -- Women's shopping page
  admin/                -- Admin panel for product management
  (auth)/               -- Login and signup pages
  api/                  -- API routes
components/
  Navbar.tsx            -- Premium sticky navbar with profile dropdown
  HeroSection.tsx       -- Full-width hero with overlay text
  ProductCard.tsx       -- Animated product cards
lib/
  supabase/             -- Supabase client, server, and middleware
  types/                -- TypeScript type definitions
  validations/          -- Zod validation schemas
```

## Admin

Admin panel available at `/admin` with email-based role verification. Manage products with image upload, pricing, categories, and gender assignment.

## Currency

All prices displayed in BDT (Bangladeshi Taka).

## License

MIT

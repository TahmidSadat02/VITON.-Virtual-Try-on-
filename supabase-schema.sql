-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dresses/Products table
CREATE TABLE public.dresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10, 2),
  is_visible BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User photos table
CREATE TABLE public.user_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Try-on sessions table
CREATE TABLE public.try_on_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  user_photo_id UUID REFERENCES public.user_photos(id) ON DELETE CASCADE NOT NULL,
  dress_id UUID REFERENCES public.dresses(id) ON DELETE CASCADE NOT NULL,
  result_url TEXT,
  text_prompt TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('super_admin', 'moderator')) DEFAULT 'moderator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_dresses_category ON public.dresses(category);
CREATE INDEX idx_dresses_color ON public.dresses(color);
CREATE INDEX idx_dresses_visible ON public.dresses(is_visible);
CREATE INDEX idx_dresses_featured ON public.dresses(is_featured);
CREATE INDEX idx_user_photos_user_id ON public.user_photos(user_id);
CREATE INDEX idx_try_on_sessions_user_id ON public.try_on_sessions(user_id);
CREATE INDEX idx_try_on_sessions_status ON public.try_on_sessions(status);
CREATE INDEX idx_try_on_sessions_created_at ON public.try_on_sessions(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.try_on_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Dresses table policies (public read, admin write)
CREATE POLICY "Anyone can view visible dresses" ON public.dresses
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Admins can insert dresses" ON public.dresses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update dresses" ON public.dresses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete dresses" ON public.dresses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

-- User photos policies
CREATE POLICY "Users can view their own photos" ON public.user_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" ON public.user_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" ON public.user_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Try-on sessions policies
CREATE POLICY "Users can view their own sessions" ON public.try_on_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.try_on_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.try_on_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.try_on_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_dresses_updated_at
  BEFORE UPDATE ON public.dresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage buckets setup (run these commands in Supabase dashboard)
-- 1. Create 'user-photos' bucket (public: false, file size limit: 5MB)
-- 2. Create 'dress-images' bucket (public: true, file size limit: 5MB)
-- 3. Create 'tryon-results' bucket (public: false, file size limit: 10MB)

-- Storage policies will be added via Supabase dashboard UI

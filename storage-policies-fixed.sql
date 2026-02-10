-- FIXED Storage Policies (No recursion issues)
-- Run this in Supabase SQL Editor to replace existing policies

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public access to dress images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload dress images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete dress images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload tryon results" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own tryon results" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own tryon results" ON storage.objects;

-- ========================================
-- USER-PHOTOS BUCKET (Private, user-scoped)
-- ========================================

-- Policy 1: Users can upload their own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can view their own photos
CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own photos
CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ========================================
-- DRESS-IMAGES BUCKET (Public read, authenticated write)
-- ========================================

-- Policy 5: Anyone can view dress images (public)
CREATE POLICY "Public access to dress images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dress-images');

-- Policy 6: Authenticated users can upload dress images
-- (Admin check will be done in application layer, not RLS)
CREATE POLICY "Authenticated can upload dress images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dress-images');

-- Policy 7: Authenticated users can update dress images
CREATE POLICY "Authenticated can update dress images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'dress-images');

-- Policy 8: Authenticated users can delete dress images
CREATE POLICY "Authenticated can delete dress images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dress-images');

-- ========================================
-- TRYON-RESULTS BUCKET (Private, user-scoped)
-- ========================================

-- Policy 9: Users can upload tryon results
CREATE POLICY "Users can upload tryon results"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 10: Users can view their own tryon results
CREATE POLICY "Users can view own tryon results"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 11: Users can update their own tryon results
CREATE POLICY "Users can update own tryon results"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 12: Users can delete their own tryon results
CREATE POLICY "Users can delete own tryon results"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

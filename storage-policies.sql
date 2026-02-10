-- Storage Policies for user-photos bucket

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

-- Policy 3: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policies for dress-images bucket

-- Policy 4: Anyone can view dress images (public bucket)
CREATE POLICY "Public access to dress images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dress-images');

-- Policy 5: Admins can upload dress images
CREATE POLICY "Admins can upload dress images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dress-images' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Policy 6: Admins can delete dress images
CREATE POLICY "Admins can delete dress images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dress-images' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Storage Policies for tryon-results bucket

-- Policy 7: Users can view their own try-on results
CREATE POLICY "Users can view own results"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 8: Users can create their own try-on results
CREATE POLICY "Users can create own results"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 9: Users can delete their own try-on results
CREATE POLICY "Users can delete own results"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 10: Admins can view all try-on results
CREATE POLICY "Admins can view all results"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tryon-results' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

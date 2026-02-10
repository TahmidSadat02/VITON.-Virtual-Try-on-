-- FIX: Add RLS policy to allow users to check if they are admin

-- Allow authenticated users to check if THEY are admin (not others)
CREATE POLICY "Users can check if they are admin"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

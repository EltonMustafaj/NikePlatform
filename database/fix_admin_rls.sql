-- ============================================
-- FIX: Allow public login for admins
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can read admins" ON admins;

-- Create new policy to allow public read for login verification
-- This is needed because we're using custom authentication (not Supabase Auth)
CREATE POLICY "Public can read admins for login" 
ON admins 
FOR SELECT 
USING (true);

-- Note: In production, you should use Supabase Auth or implement proper RLS
-- This allows anyone to read admin data, but passwords should be hashed

COMMIT;

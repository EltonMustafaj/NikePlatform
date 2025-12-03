-- ============================================
-- FIX: Allow public registration for postal workers
-- ============================================

-- Enable RLS on the table (if not already enabled)
ALTER TABLE postal_workers ENABLE ROW LEVEL SECURITY;

-- 1. Allow anyone to INSERT (register) a new postal worker
CREATE POLICY "Public can register as postal worker" 
ON postal_workers 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow postal workers to read their own data (based on username/password login)
-- Note: Since we don't have auth.uid() for custom auth, we allow public read for login check
-- Ideally, this should be more restricted, but for this custom auth implementation:
CREATE POLICY "Public can read postal workers for login" 
ON postal_workers 
FOR SELECT 
USING (true);

-- 3. Allow admins to do everything (if using Supabase Auth for admins)
-- If admins are also custom auth, the above SELECT policy covers them too.

COMMIT;

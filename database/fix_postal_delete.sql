-- ============================================
-- FIX: Allow admin to delete postal workers
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can delete postal workers" ON postal_workers;

-- Allow DELETE for postal workers (for admin use)
-- Since we're using custom auth (not Supabase Auth), we allow public delete
-- In production, you should implement proper admin authentication
CREATE POLICY "Allow delete postal workers" 
ON postal_workers 
FOR DELETE 
USING (true);

-- Also ensure UPDATE is allowed (in case needed)
DROP POLICY IF EXISTS "Allow update postal workers" ON postal_workers;

CREATE POLICY "Allow update postal workers" 
ON postal_workers 
FOR UPDATE 
USING (true);

COMMIT;

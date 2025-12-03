-- ============================================
-- UPDATE: Add status and approval system for postal workers
-- ============================================

-- Add status column to postal_workers
ALTER TABLE postal_workers 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
CHECK (status IN ('pending', 'active', 'inactive'));

-- Add approved_by column to track which admin approved
ALTER TABLE postal_workers 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES admins(id) ON DELETE SET NULL;

-- Add approved_at timestamp
ALTER TABLE postal_workers 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Update existing postal workers to 'active' status
UPDATE postal_workers 
SET status = 'active' 
WHERE status IS NULL OR status = 'pending';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_postal_workers_status ON postal_workers(status);

-- Update RLS policies for postal workers
ALTER TABLE postal_workers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can register as postal worker" ON postal_workers;
DROP POLICY IF EXISTS "Public can read postal workers for login" ON postal_workers;
DROP POLICY IF EXISTS "Active postal workers can login" ON postal_workers;
DROP POLICY IF EXISTS "Admins can see all postal workers" ON postal_workers;
DROP POLICY IF EXISTS "Admins can update postal workers" ON postal_workers;
DROP POLICY IF EXISTS "Admins can insert postal workers" ON postal_workers;
DROP POLICY IF EXISTS "Admins can delete postal workers" ON postal_workers;

-- 1. Allow registration (pending) AND Admin creation (active with approval)
CREATE POLICY "Insert postal workers" 
ON postal_workers 
FOR INSERT 
WITH CHECK (
  status = 'pending' OR 
  (status = 'active' AND approved_by IS NOT NULL)
);

-- 2. Allow public read for login (only active workers)
CREATE POLICY "Active postal workers can login" 
ON postal_workers 
FOR SELECT 
USING (status = 'active');

-- 3. Allow admins to see all postal workers
CREATE POLICY "Admins can see all postal workers" 
ON postal_workers 
FOR SELECT 
USING (true);

-- 4. Allow admins to update postal workers (approve/reject)
CREATE POLICY "Admins can update postal workers" 
ON postal_workers 
FOR UPDATE 
USING (true);

-- 5. Allow admins to delete postal workers
CREATE POLICY "Admins can delete postal workers" 
ON postal_workers 
FOR DELETE 
USING (true);

COMMIT;

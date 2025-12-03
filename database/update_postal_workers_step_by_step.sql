-- ============================================
-- ALTERNATIVË: Nëse update_postal_workers.sql nuk funksionon
-- ============================================
-- Ekzekuto këto queries një nga një në Supabase SQL Editor

-- HAPI 1: Kontrollo porositë ekzistuese
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- HAPI 2: Përditëso porositë me "E Përfunduar" në "E Dorëzuar"
UPDATE orders SET status = 'E Dorëzuar' WHERE status = 'E Përfunduar';

-- HAPI 3: Verifiko që u përditësuan
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- HAPI 4: Fshi constraint-in e vjetër
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- HAPI 5: Shto constraint-in e ri
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('E Papërpunuar', 'Në Dërgesë', 'E Dorëzuar'));

-- HAPI 6: Krijo tabelën postal_workers
CREATE TABLE IF NOT EXISTS postal_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HAPI 7: Shto kolonat në orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES postal_workers(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- HAPI 8: Krijo index
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON orders(assigned_to);

-- HAPI 9: Aktivizo RLS
ALTER TABLE postal_workers ENABLE ROW LEVEL SECURITY;

-- HAPI 10: Fshi policies të vjetra (nëse ka)
DROP POLICY IF EXISTS "Postal workers can read their assigned orders" ON orders;
DROP POLICY IF EXISTS "Postal workers can update their assigned orders" ON orders;
DROP POLICY IF EXISTS "Postal workers can read postal workers" ON postal_workers;

-- HAPI 11: Krijo policies
CREATE POLICY "Postal workers can read their assigned orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Postal workers can update their assigned orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Postal workers can read postal workers" ON postal_workers FOR SELECT USING (true);

-- HAPI 12: Shto postal workers
INSERT INTO postal_workers (username, password, full_name, phone) 
VALUES ('posta', 'posta123', 'Postari Kryesor', '+383 44 123 456')
ON CONFLICT (username) DO NOTHING;

INSERT INTO postal_workers (username, password, full_name, phone) 
VALUES ('posta2', 'posta123', 'Postari i Dytë', '+383 44 789 012')
ON CONFLICT (username) DO NOTHING;

-- VERIFIKIMI FINAL
SELECT * FROM postal_workers;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders' AND column_name IN ('assigned_to', 'delivery_notes');
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- ✅ GATI!

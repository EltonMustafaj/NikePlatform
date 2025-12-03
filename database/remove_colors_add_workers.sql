-- ============================================
-- LARGIMI I NGJYRAVE - FIX FINAL
-- ============================================
-- Ky file bashkon variantet me të njëjtën madhësi dhe largo ngjyrën

-- HAPI 1: Fshi constraint-in e vjetër për statuset
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- HAPI 2: Përditëso statuset
UPDATE orders SET status = 'E Dorëzuar' WHERE status IN ('E Përfunduar', 'E Dorzuar');
UPDATE orders SET status = 'Në Dërgesë' WHERE status = 'Në Dergesë';
UPDATE orders SET status = 'E Papërpunuar' WHERE status = 'E Paperpunuar';

-- HAPI 3: Shto constraint-in e ri për statuset
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('E Papërpunuar', 'Në Dërgesë', 'E Dorëzuar'));

-- HAPI 4: Bashko variantet me të njëjtën madhësi
-- Krijo një tabelë të re me stokun e bashkuar
CREATE TEMP TABLE merged_variants AS
SELECT 
    product_id,
    size,
    SUM(stock) as total_stock,
    MIN(id) as keep_id
FROM product_variants
GROUP BY product_id, size;

-- HAPI 5: Fshi të gjitha variantet
DELETE FROM product_variants;

-- HAPI 6: Shto variantet e bashkuara (pa color)
INSERT INTO product_variants (id, product_id, size, stock, created_at, updated_at)
SELECT 
    keep_id,
    product_id,
    size,
    total_stock,
    NOW(),
    NOW()
FROM merged_variants;

-- HAPI 7: Fshi constraint-in e vjetër që përmban color
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_size_color_key;

-- HAPI 8: Largo kolonën color
ALTER TABLE product_variants DROP COLUMN IF EXISTS color;

-- HAPI 9: Shto unique constraint të ri (vetëm product_id dhe size)
ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_size_key 
UNIQUE (product_id, size);

-- HAPI 10: Krijo tabelën postal_workers
CREATE TABLE IF NOT EXISTS postal_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HAPI 11: Shto kolonat në orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES postal_workers(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- HAPI 12: Krijo index
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON orders(assigned_to);

-- HAPI 13: Aktivizo RLS
ALTER TABLE postal_workers ENABLE ROW LEVEL SECURITY;

-- HAPI 14: Fshi policies të vjetra
DROP POLICY IF EXISTS "Postal workers can read their assigned orders" ON orders;
DROP POLICY IF EXISTS "Postal workers can update their assigned orders" ON orders;
DROP POLICY IF EXISTS "Postal workers can read postal workers" ON postal_workers;

-- HAPI 15: Krijo policies
CREATE POLICY "Postal workers can read their assigned orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Postal workers can update their assigned orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Postal workers can read postal workers" ON postal_workers FOR SELECT USING (true);

-- HAPI 16: Shto postal workers (çdo postar ka llogarinë e vet)
INSERT INTO postal_workers (username, password, full_name, phone) VALUES
('agim.krasniqi', 'agim123', 'Agim Krasniqi', '+383 44 111 222'),
('besnik.hoxha', 'besnik123', 'Besnik Hoxha', '+383 44 333 444'),
('driton.shala', 'driton123', 'Driton Shala', '+383 44 555 666'),
('enis.berisha', 'enis123', 'Enis Berisha', '+383 44 777 888')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- VERIFIKIMI
-- ============================================

-- Shiko postal workers
SELECT username, full_name, phone FROM postal_workers ORDER BY full_name;

-- Shiko product_variants (pa color, me stok të bashkuar)
SELECT 
    p.name as product_name,
    pv.size,
    pv.stock
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
ORDER BY p.name, pv.size;

-- Shiko kolonat e product_variants
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_variants'
ORDER BY ordinal_position;

-- Shiko statuset
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;

-- ✅ GATI! Ngjyrat u larguan, stoku u bashkua, dhe postal workers u shtuan!

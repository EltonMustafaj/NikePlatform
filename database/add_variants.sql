-- ============================================
-- SHTIMI I VARIANTEVE PËR PRODUKTET EKZISTUESE
-- ============================================
-- Ekzekuto këtë SQL PASI të kesh ekzekutuar schema.sql kryesor
-- Ky script shton madhësi dhe ngjyra për të gjitha 11 produktet

-- ============================================
-- VARIANTE PËR NIKE AIR MAX 90
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Air Max 90' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '38', 'Bardh', 10),
    (product_uuid, '39', 'Bardh', 15),
    (product_uuid, '40', 'Bardh', 20),
    (product_uuid, '41', 'Bardh', 18),
    (product_uuid, '42', 'Bardh', 12),
    (product_uuid, '43', 'Bardh', 8),
    (product_uuid, '44', 'Bardh', 5),
    -- Ngjyra Zi
    (product_uuid, '38', 'Zi', 8),
    (product_uuid, '39', 'Zi', 12),
    (product_uuid, '40', 'Zi', 15),
    (product_uuid, '41', 'Zi', 10),
    (product_uuid, '42', 'Zi', 7),
    (product_uuid, '43', 'Zi', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE AIR FORCE 1
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Air Force 1' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '38', 'Bardh', 12),
    (product_uuid, '39', 'Bardh', 18),
    (product_uuid, '40', 'Bardh', 25),
    (product_uuid, '41', 'Bardh', 20),
    (product_uuid, '42', 'Bardh', 15),
    (product_uuid, '43', 'Bardh', 10),
    -- Ngjyra Zi
    (product_uuid, '39', 'Zi', 10),
    (product_uuid, '40', 'Zi', 15),
    (product_uuid, '41', 'Zi', 12),
    (product_uuid, '42', 'Zi', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE DUNK LOW
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Dunk Low' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Kuq
    (product_uuid, '38', 'Kuq', 8),
    (product_uuid, '39', 'Kuq', 12),
    (product_uuid, '40', 'Kuq', 15),
    (product_uuid, '41', 'Kuq', 10),
    (product_uuid, '42', 'Kuq', 6),
    -- Ngjyra Blu
    (product_uuid, '39', 'Blu', 10),
    (product_uuid, '40', 'Blu', 14),
    (product_uuid, '41', 'Blu', 12),
    (product_uuid, '42', 'Blu', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE JORDAN 1 HIGH
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Jordan 1 High' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Zi
    (product_uuid, '39', 'Zi', 8),
    (product_uuid, '40', 'Zi', 12),
    (product_uuid, '41', 'Zi', 15),
    (product_uuid, '42', 'Zi', 10),
    (product_uuid, '43', 'Zi', 6),
    -- Ngjyra Kuq
    (product_uuid, '40', 'Kuq', 10),
    (product_uuid, '41', 'Kuq', 12),
    (product_uuid, '42', 'Kuq', 8),
    (product_uuid, '43', 'Kuq', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE BLAZER MID 77
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Blazer Mid 77' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '38', 'Bardh', 10),
    (product_uuid, '39', 'Bardh', 14),
    (product_uuid, '40', 'Bardh', 18),
    (product_uuid, '41', 'Bardh', 12),
    (product_uuid, '42', 'Bardh', 8),
    -- Ngjyra Gri
    (product_uuid, '39', 'Gri', 8),
    (product_uuid, '40', 'Gri', 12),
    (product_uuid, '41', 'Gri', 10),
    (product_uuid, '42', 'Gri', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE AIR MAX 270
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Air Max 270' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Zi
    (product_uuid, '39', 'Zi', 12),
    (product_uuid, '40', 'Zi', 16),
    (product_uuid, '41', 'Zi', 14),
    (product_uuid, '42', 'Zi', 10),
    (product_uuid, '43', 'Zi', 7),
    -- Ngjyra Blu
    (product_uuid, '40', 'Blu', 10),
    (product_uuid, '41', 'Blu', 12),
    (product_uuid, '42', 'Blu', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE REACT INFINITY
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike React Infinity' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '39', 'Bardh', 10),
    (product_uuid, '40', 'Bardh', 15),
    (product_uuid, '41', 'Bardh', 12),
    (product_uuid, '42', 'Bardh', 10),
    (product_uuid, '43', 'Bardh', 6),
    -- Ngjyra Zi
    (product_uuid, '40', 'Zi', 12),
    (product_uuid, '41', 'Zi', 14),
    (product_uuid, '42', 'Zi', 10),
    (product_uuid, '43', 'Zi', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE CORTEZ CLASSIC
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Cortez Classic' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '38', 'Bardh', 8),
    (product_uuid, '39', 'Bardh', 12),
    (product_uuid, '40', 'Bardh', 15),
    (product_uuid, '41', 'Bardh', 10),
    (product_uuid, '42', 'Bardh', 7),
    -- Ngjyra Kuq
    (product_uuid, '39', 'Kuq', 8),
    (product_uuid, '40', 'Kuq', 10),
    (product_uuid, '41', 'Kuq', 8),
    (product_uuid, '42', 'Kuq', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE AIR MAX 97
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Air Max 97' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Gri
    (product_uuid, '39', 'Gri', 10),
    (product_uuid, '40', 'Gri', 14),
    (product_uuid, '41', 'Gri', 12),
    (product_uuid, '42', 'Gri', 9),
    (product_uuid, '43', 'Gri', 6),
    -- Ngjyra Zi
    (product_uuid, '40', 'Zi', 12),
    (product_uuid, '41', 'Zi', 10),
    (product_uuid, '42', 'Zi', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE PEGASUS 40
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Pegasus 40' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Bardh
    (product_uuid, '39', 'Bardh', 12),
    (product_uuid, '40', 'Bardh', 16),
    (product_uuid, '41', 'Bardh', 14),
    (product_uuid, '42', 'Bardh', 10),
    (product_uuid, '43', 'Bardh', 7),
    -- Ngjyra Blu
    (product_uuid, '40', 'Blu', 10),
    (product_uuid, '41', 'Blu', 12),
    (product_uuid, '42', 'Blu', 9),
    (product_uuid, '43', 'Blu', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VARIANTE PËR NIKE ZOOM FREAK
-- ============================================
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Zoom Freak' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    -- Ngjyra Zi
    (product_uuid, '40', 'Zi', 10),
    (product_uuid, '41', 'Zi', 14),
    (product_uuid, '42', 'Zi', 12),
    (product_uuid, '43', 'Zi', 8),
    (product_uuid, '44', 'Zi', 5),
    -- Ngjyra Gjelbër
    (product_uuid, '41', 'Gjelbër', 8),
    (product_uuid, '42', 'Gjelbër', 10),
    (product_uuid, '43', 'Gjelbër', 7),
    (product_uuid, '44', 'Gjelbër', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VERIFIKO REZULTATET
-- ============================================

-- Shiko sa variante u shtuan për çdo produkt
SELECT 
  p.name as "Produkti",
  COUNT(pv.id) as "Numri i Varianteve",
  SUM(pv.stock) as "Stoku Total"
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;

-- Mesazh suksesi
DO $$
BEGIN
  RAISE NOTICE 'Variantet u shtuan me sukses për të gjitha produktet!';
  RAISE NOTICE 'Kontrollo tabelën product_variants për të parë të gjitha madhësitë.';
END $$;

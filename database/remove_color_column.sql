-- ============================================
-- MIGRATION: Simplify product_variants - remove stock, keep only size
-- ============================================

-- Step 1: Remove constraints
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_size_color_key;
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_size_key;

-- Step 2: Drop columns we don't need
ALTER TABLE product_variants DROP COLUMN IF EXISTS color;
ALTER TABLE product_variants DROP COLUMN IF EXISTS stock;

-- Step 3: Add new unique constraint (only product_id and size)
ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_size_key UNIQUE (product_id, size);

-- Step 4: Delete all existing variants
DELETE FROM product_variants;

COMMIT;

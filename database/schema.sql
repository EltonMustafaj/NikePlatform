-- ============================================
-- NIKE SNEAKERS E-COMMERCE DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCT VARIANTS TABLE (Sizes & Colors)
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size, color)
);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES postal_workers(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'E Papërpunuar' CHECK (status IN ('E Papërpunuar', 'Në Dërgesë', 'E Dorëzuar')),
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- POSTAL WORKERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS postal_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE postal_workers ENABLE ROW LEVEL SECURITY;

-- Public read access for products and variants
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read product variants" ON product_variants FOR SELECT USING (true);

-- Public can insert customers (for registration)
CREATE POLICY "Public can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read own customer data" ON customers FOR SELECT USING (true);
CREATE POLICY "Public can update own customer data" ON customers FOR UPDATE USING (true);

-- Public can create orders
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read orders" ON orders FOR SELECT USING (true);

-- Public can create order items
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read order items" ON order_items FOR SELECT USING (true);

-- Admin policies (full access)
CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (true);
CREATE POLICY "Admins can do everything on variants" ON product_variants FOR ALL USING (true);
CREATE POLICY "Admins can do everything on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admins can read admins" ON admins FOR SELECT USING (true);

-- Postal worker policies
CREATE POLICY "Postal workers can read their assigned orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Postal workers can update their assigned orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Postal workers can read postal workers" ON postal_workers FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert default admin (password: admin123)
INSERT INTO admins (email, password, name) 
VALUES ('admin@nike.com', 'admin123', 'Administrator')
ON CONFLICT (email) DO NOTHING;

-- Insert default postal worker (username: posta, password: posta123)
INSERT INTO postal_workers (username, password, full_name, phone) 
VALUES ('posta', 'posta123', 'Postari Kryesor', '+383 44 123 456')
ON CONFLICT (username) DO NOTHING;

-- Sample products (të gjitha 11 produktet)
INSERT INTO products (name, description, price, image_url) VALUES
('Nike Air Max 90', 'Patika klasike Nike Air Max 90 me dizajn ikonike dhe komfort maksimal për përdorim të përditshëm.', 120.00, '/images/Nike1.jpg'),
('Nike Air Force 1', 'Patika legjendare Nike Air Force 1, perfekte për çdo ditë. Stil klasik që nuk kalon kurrë nga moda.', 110.00, '/images/Nike2.jpg'),
('Nike Dunk Low', 'Nike Dunk Low me ngjyra të ndezura dhe stil të shkëlqyer. Ideale për look casual.', 115.00, '/images/Nike3.jpg'),
('Nike Jordan 1 High', 'Air Jordan 1 High - ikona e basketbollit dhe kulturës urbane. Dizajn legjendare.', 150.00, '/images/Nike4.jpg'),
('Nike Blazer Mid 77', 'Nike Blazer Mid me dizajn retro dhe komfort modern. Stil vintage me teknologji të re.', 105.00, '/images/Nike5.jpg'),
('Nike Air Max 270', 'Nike Air Max 270 me jastëk ajri maksimal. Komfort i jashtëzakonshëm për të gjithë ditën.', 130.00, '/images/Nike6.jpg'),
('Nike React Infinity', 'Nike React Infinity Run - patika për vrapim me mbështetje të shkëlqyer dhe qëndrueshmëri.', 140.00, '/images/Nike7.jpg'),
('Nike Cortez Classic', 'Nike Cortez Classic - dizajn ikonike retro që ka shënuar historinë e Nike.', 95.00, '/images/nike8.jpg'),
('Nike Air Max 97', 'Nike Air Max 97 me linja të vazhdueshme dhe stil futuristik. Komfort dhe stil në një.', 145.00, '/images/Nike9.jpg'),
('Nike Pegasus 40', 'Nike Pegasus 40 - patika universale për vrapim. E preferuara e atletëve në të gjithë botën.', 125.00, '/images/Nike10.jpg'),
('Nike Zoom Freak', 'Nike Zoom Freak - patika basketbolli me performancë të lartë dhe dizajn modern.', 135.00, '/images/Nike11.jpg')
ON CONFLICT DO NOTHING;

-- Shembuj të varianteve (madhësi dhe ngjyra me stok)
-- Këto do të funksionojnë vetëm pasi produktet të jenë krijuar
-- Mund t'i shtoni manualisht përmes admin panel ose duke përdorur UUID-të aktuale

-- Shembull për të shtuar variante (zëvendëso 'PRODUCT_UUID' me UUID-në aktuale nga tabela products):
-- INSERT INTO product_variants (product_id, size, color, stock) VALUES
-- ('PRODUCT_UUID', '38', 'Bardh', 10),
-- ('PRODUCT_UUID', '39', 'Bardh', 15),
-- ('PRODUCT_UUID', '40', 'Bardh', 20),
-- ('PRODUCT_UUID', '41', 'Bardh', 12),
-- ('PRODUCT_UUID', '42', 'Bardh', 8);

-- Për të shtuar variante automatikisht për produktin e parë (Air Max 90):
DO $$
DECLARE
  product_uuid UUID;
BEGIN
  -- Merr UUID-në e produktit të parë
  SELECT id INTO product_uuid FROM products WHERE name = 'Nike Air Max 90' LIMIT 1;
  
  IF product_uuid IS NOT NULL THEN
    -- Shto variante për Air Max 90
    INSERT INTO product_variants (product_id, size, color, stock) VALUES
    (product_uuid, '38', 'Bardh', 10),
    (product_uuid, '39', 'Bardh', 15),
    (product_uuid, '40', 'Bardh', 20),
    (product_uuid, '41', 'Bardh', 18),
    (product_uuid, '42', 'Bardh', 12),
    (product_uuid, '43', 'Bardh', 8),
    (product_uuid, '44', 'Bardh', 5),
    (product_uuid, '38', 'Zi', 8),
    (product_uuid, '39', 'Zi', 12),
    (product_uuid, '40', 'Zi', 15),
    (product_uuid, '41', 'Zi', 10),
    (product_uuid, '42', 'Zi', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

COMMIT;

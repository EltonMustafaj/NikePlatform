# 🗄️ Udhëzues: Konfigurimi i Bazës së të Dhënave në Supabase

## Hapi 1: Hap Supabase Dashboard

1. Hap shfletuesin
2. Shko te: **https://rfjkrwiqgmlgjkimzrla.supabase.co**
3. Kyçu me llogarinë tënde Supabase

## Hapi 2: Hap SQL Editor

1. Nga menu-ja anësore (majtas), kliko **"SQL Editor"**
2. Kliko **"New query"** për të hapur një editor të ri

## Hapi 3: Kopjo dhe Ngjit SQL-në

1. Hap file-in `database/schema.sql` në VS Code ose editor tjetër
2. Përzgjidh të gjithë përmbajtjen (Ctrl+A)
3. Kopjo (Ctrl+C)
4. Kthehu te Supabase SQL Editor
5. Ngjit përmbajtjen (Ctrl+V)

## Hapi 4: Ekzekuto SQL-në

1. Kliko butonin **"Run"** (ose shtyp Ctrl+Enter)
2. Prit disa sekonda
3. Nëse shikon mesazhin **"Success. No rows returned"**, gjithçka është OK!

## Hapi 5: Verifiko Tabelat

### Metoda 1: Table Editor

1. Kliko **"Table Editor"** nga menu-ja anësore
2. Duhet të shohësh 6 tabela:
   - ✅ admins
   - ✅ customers
   - ✅ order_items
   - ✅ orders
   - ✅ product_variants
   - ✅ products

### Metoda 2: SQL Query

Ekzekuto këtë query në SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Duhet të shohësh të gjitha 6 tabelat.

## Hapi 6: Verifiko Produktet

1. Kliko **"Table Editor"** → **"products"**
2. Duhet të shohësh **11 produkte**:
   - Nike Air Max 90
   - Nike Air Force 1
   - Nike Dunk Low
   - Nike Jordan 1 High
   - Nike Blazer Mid 77
   - Nike Air Max 270
   - Nike React Infinity
   - Nike Cortez Classic
   - Nike Air Max 97
   - Nike Pegasus 40
   - Nike Zoom Freak

## Hapi 7: Verifiko Variantet

1. Kliko **"Table Editor"** → **"product_variants"**
2. Duhet të shohësh variante për **Nike Air Max 90**:
   - Madhësi 38-44 në ngjyrë Bardh
   - Madhësi 38-42 në ngjyrë Zi

## Hapi 8: Verifiko Admin-in

1. Kliko **"Table Editor"** → **"admins"**
2. Duhet të shohësh një admin:
   - Email: admin@nike.com
   - Password: admin123
   - Name: Administrator

## Çfarë Bën SQL Schema?

### 1. Krijon Tabelat

- **products**: Informacionet bazë të produkteve
- **product_variants**: Madhësitë, ngjyrat dhe stoku
- **customers**: Të dhënat e klientëve
- **orders**: Porositë
- **order_items**: Artikujt në çdo porosi
- **admins**: Përdoruesit admin

### 2. Vendos Constraints

- UUID primary keys
- Foreign keys me CASCADE delete
- CHECK constraints (p.sh. stoku ≥ 0)
- UNIQUE constraints (p.sh. email)

### 3. Krijon Indexes

Për performancë më të mirë në queries:
- product_variants → product_id
- orders → customer_id, status
- order_items → order_id, variant_id

### 4. Vendos Triggers

Azhurnim automatik të `updated_at` kur ndryshohen të dhënat

### 5. Aktivizon RLS (Row Level Security)

Politika sigurie për të kontrolluar akseset:
- Të gjithë mund të lexojnë produkte
- Vetëm admins mund të modifikojnë produkte
- Klientët mund të krijojnë porosi

### 6. Shton Të Dhëna Shembull

- 11 produkte NIKE
- 12 variante për Air Max 90
- 1 admin account

## Probleme të Mundshme

### ❌ "relation already exists"

**Shkaku**: Tabelat ekzistojnë tashmë

**Zgjidhja**: 
1. Fshi tabelat ekzistuese:
```sql
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
```
2. Ekzekuto përsëri schema.sql

### ❌ "permission denied"

**Shkaku**: Nuk ke të drejta për të krijuar tabela

**Zgjidhja**: Verifiko që je i kyçur si owner i projektit

### ❌ "syntax error"

**Shkaku**: SQL nuk është kopjuar saktë

**Zgjidhja**: 
1. Kopjo përsëri të gjithë file-in
2. Sigurohu që nuk mungon asgjë

## Komanda të Dobishme SQL

### Shiko të gjitha tabelat
```sql
\dt
```

### Numro produktet
```sql
SELECT COUNT(*) FROM products;
```

### Shiko produktet me variante
```sql
SELECT 
  p.name,
  COUNT(pv.id) as variant_count,
  SUM(pv.stock) as total_stock
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;
```

### Shiko porositë
```sql
SELECT 
  o.id,
  o.status,
  c.first_name || ' ' || c.last_name as customer,
  o.total_amount,
  o.created_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC;
```

### Fshi të gjitha porositë (për testing)
```sql
DELETE FROM orders;
DELETE FROM customers;
```

## Backup i Bazës

Për të ruajtur një backup:

1. Shko te **Database** → **Backups**
2. Kliko **"Create backup"**
3. Jep një emër (p.sh. "Initial setup")
4. Kliko **"Create"**

## Restore nga Backup

Nëse diçka shkon keq:

1. Shko te **Database** → **Backups**
2. Gjej backup-in që dëshiron
3. Kliko **"Restore"**
4. Konfirmo

---

**✅ Baza e të dhënave është gati për përdorim!**

Tani mund të fillosh aplikacionin me `npm run dev` dhe të testosh të gjitha funksionalitetet.

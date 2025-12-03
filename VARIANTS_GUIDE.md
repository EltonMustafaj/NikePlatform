# 📝 Si të Shtosh Variantet (Madhësitë dhe Ngjyrat)

## Mënyra 1: Automatike (E Rekomanduar)

### Hapi 1: Hap Supabase SQL Editor
1. Shko te: https://rfjkrwiqgmlgjkimzrla.supabase.co
2. Kliko **SQL Editor** nga menu-ja anësore
3. Kliko **New query**

### Hapi 2: Kopjo SQL-në
1. Hap file-in `database/add_variants.sql`
2. Përzgjidh të gjithë përmbajtjen (Ctrl+A)
3. Kopjo (Ctrl+C)

### Hapi 3: Ekzekuto
1. Ngjit në SQL Editor (Ctrl+V)
2. Kliko **Run** (ose Ctrl+Enter)
3. Prit disa sekonda

### Hapi 4: Verifiko
Në fund të rezultateve do të shohësh një tabelë që tregon:
- Emrin e produktit
- Numrin e varianteve
- Stokun total

**Shembull:**
```
Nike Air Max 90        | 13 variante | 135 copë
Nike Air Force 1       | 10 variante | 125 copë
Nike Dunk Low          | 9 variante  | 85 copë
...
```

## Mënyra 2: Manualisht (Përmes Admin Panel)

Nëse preferon të shtosh variante manualisht:

### Për çdo produkt:
1. Hyr si admin (admin@nike.com / admin123)
2. Shko te **Menaxho Produktet**
3. Gjej produktin
4. Në seksionin **"Madhësitë dhe Stoku"**, nuk do të ketë asgjë
5. Mund t'i shtosh duke klikuar **"Shto Produkt të Ri"** dhe duke krijuar produkt të njëjtë me variante

**SHËNIM**: Kjo mënyrë është më e gjatë. Më mirë përdor SQL-në automatike.

## Çfarë Shton SQL-ja?

Për çdo produkt shtohen madhësi dhe ngjyra të ndryshme:

### Nike Air Max 90
- **Bardh**: 38, 39, 40, 41, 42, 43, 44
- **Zi**: 38, 39, 40, 41, 42, 43

### Nike Air Force 1
- **Bardh**: 38, 39, 40, 41, 42, 43
- **Zi**: 39, 40, 41, 42

### Nike Dunk Low
- **Kuq**: 38, 39, 40, 41, 42
- **Blu**: 39, 40, 41, 42

### Nike Jordan 1 High
- **Zi**: 39, 40, 41, 42, 43
- **Kuq**: 40, 41, 42, 43

### Nike Blazer Mid 77
- **Bardh**: 38, 39, 40, 41, 42
- **Gri**: 39, 40, 41, 42

### Nike Air Max 270
- **Zi**: 39, 40, 41, 42, 43
- **Blu**: 40, 41, 42

### Nike React Infinity
- **Bardh**: 39, 40, 41, 42, 43
- **Zi**: 40, 41, 42, 43

### Nike Cortez Classic
- **Bardh**: 38, 39, 40, 41, 42
- **Kuq**: 39, 40, 41, 42

### Nike Air Max 97
- **Gri**: 39, 40, 41, 42, 43
- **Zi**: 40, 41, 42

### Nike Pegasus 40
- **Bardh**: 39, 40, 41, 42, 43
- **Blu**: 40, 41, 42, 43

### Nike Zoom Freak
- **Zi**: 40, 41, 42, 43, 44
- **Gjelbër**: 41, 42, 43, 44

## Stoku për Çdo Madhësi

Stoku është i ndryshëm për çdo madhësi:
- Madhësitë më të kërkuara (40, 41) kanë stok më të lartë (12-20 copë)
- Madhësitë më të vogla/të mëdha kanë stok më të ulët (5-10 copë)

## Kontrollo Rezultatet

### Në Supabase:
1. Shko te **Table Editor**
2. Kliko **product_variants**
3. Do të shohësh të gjitha madhësitë dhe ngjyrat

### Në Aplikacion:
1. Hap http://localhost:3000
2. Kliko në çfarëdo produkti
3. Do të shohësh madhësitë e disponueshme
4. Madhësitë me stok do të jenë aktive
5. Mund t'i zgjedhësh dhe të shtosh në shportë

## Probleme të Mundshme

### ❌ "duplicate key value violates unique constraint"

**Shkaku**: Variantet ekzistojnë tashmë

**Zgjidhja**: Kjo është normale! SQL-ja ka `ON CONFLICT DO NOTHING`, kështu që nuk do të ketë problem.

### ❌ "null value in column product_id"

**Shkaku**: Produktet nuk ekzistojnë ende

**Zgjidhja**: 
1. Sigurohu që ke ekzekutuar `schema.sql` më parë
2. Verifiko që ka 11 produkte në tabelën `products`

### ❌ Nuk shfaqen variante në aplikacion

**Shkaku**: Aplikacioni nuk është rifreskuar

**Zgjidhja**: Rifresko faqen (F5) ose rifillo aplikacionin

## Komanda SQL për Kontroll

### Shiko sa variante ka çdo produkt:
```sql
SELECT 
  p.name,
  COUNT(pv.id) as variante,
  SUM(pv.stock) as stoku_total
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.name
ORDER BY p.name;
```

### Shiko të gjitha variantet për një produkt:
```sql
SELECT 
  p.name,
  pv.size,
  pv.color,
  pv.stock
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
WHERE p.name = 'Nike Air Max 90'
ORDER BY pv.color, pv.size;
```

### Fshi të gjitha variantet (nëse duhet të fillosh përsëri):
```sql
DELETE FROM product_variants;
```

---

**✅ Pas ekzekutimit të SQL-së, të gjitha produktet do të kenë madhësi dhe ngjyra!**

Tani klientët mund të zgjedhin madhësinë dhe ngjyrën kur blejnë patika.

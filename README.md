# 👟 NIKE Patika - Aplikacion E-Commerce

Aplikacion i plotë për menaxhimin e stokut dhe porosive të patikave NIKE.

## 🚀 Fillimi i Shpejtë

### 1. Instalo Varësitë
```bash
npm install
```

### 2. Konfiguro Bazën e të Dhënave

**Hap Supabase Dashboard**: https://rfjkrwiqgmlgjkimzrla.supabase.co

**Ekzekuto SQL-në**:
1. Shko te **SQL Editor**
2. Kopjo të gjithë përmbajtjen e `database/schema.sql`
3. Ekzekuto SQL-në
4. Verifiko që u krijuan 11 produkte

### 3. Fillo Aplikacionin
```bash
npm run dev
```

Hap: **http://localhost:3000**

## 🔑 Kredencialet e Admin-it

- **URL**: http://localhost:3000/admin
- **Email**: admin@nike.com
- **Password**: admin123

## ✨ Karakteristikat Kryesore

### Për Klientët
- ✅ Shfleto 11 produkte NIKE
- ✅ Zgjedh madhësi dhe ngjyrë
- ✅ Shto në shportë
- ✅ Porosi me pagesa CASH
- ✅ Animacione të bukura

### Për Admin-in
- ✅ **Shto produkte të reja** (me zgjedhës imazhesh)
- ✅ **Menaxho madhësitë dhe ngjyrat**
- ✅ **Azhurno stokun** në kohë reale
- ✅ **Përpuno porositë** (E Papërpunuar → Në Dërgesë → E Përfunduar)
- ✅ **Njoftime real-time** për porosi të reja
- ✅ Dashboard me statistika

## 📦 Imazhet e Disponueshme

Aplikacioni përmban 11 imazhe të gatshme:
- Nike1.jpg - Nike11.jpg (në `public/images/`)

Kur shton produkt të ri, mund të zgjedhësh nga këto imazhe.

## 🎯 Si të Shtosh Produkt të Ri

1. Hyr si admin
2. Shko te **Menaxho Produktet**
3. Kliko **"+ Shto Produkt të Ri"**
4. Plotëso:
   - Emri (p.sh. "Nike Air Max 95")
   - Përshkrimi
   - Çmimi (p.sh. 125.00)
   - Zgjedh imazhin nga galeria
5. Shto madhësitë:
   - Zgjedh madhësinë (36-46)
   - Zgjedh ngjyrën (Bardh, Zi, Kuq, etj.)
   - Vendos stokun
   - Kliko "+" për të shtuar më shumë madhësi
6. Kliko **"Ruaj Produktin"**

## 🔄 Rrjedha e Porosisë

**Klienti**:
1. Zgjedh produkt → Madhësi → Ngjyrë
2. Shton në shportë
3. Vazhdon me checkout
4. Plotëson informacionet
5. Konfirmon porosinë

**Admini**:
1. Merr njoftim për porosi të re
2. Verifikon produktin
3. Ndryshon statusin: **Në Dërgesë**
4. Pas dorëzimit: **E Përfunduar**

## 📊 Teknologjitë

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (Glassmorphism)
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime

## 🎨 Dizajni

- 🌑 Dark mode me glassmorphism
- 🎨 Gradients vibrant Nike
- ✨ Animacione smooth
- 📱 Responsive (mobile-first)

## 📝 Shënime

- Pagesa bëhet **CASH në dorëzim**
- Dërgesa është **FALAS**
- Stoku azhurnohet **automatikisht**
- Madhësitë pa stok shfaqen **të zbehura**

## 🐛 Probleme të Mundshme

**Produktet nuk shfaqen?**
- Verifiko që SQL schema është ekzekutuar
- Kontrollo console për gabime

**Nuk mund të bëj login?**
- Përdor: admin@nike.com / admin123
- Verifiko që tabela `admins` ekziston

**Stoku nuk azhurnohet?**
- Kontrollo RLS policies në Supabase
- Verifiko që je i kyçur si admin

## 📖 Dokumentacion i Plotë

Shiko `walkthrough.md` për dokumentacion të detajuar.

---

**Zhvilluar me ❤️ për NIKE Patika**

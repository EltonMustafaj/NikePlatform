# 📖 Udhëzues: Si të Shtosh Produkte të Reja

## Hyrja në Admin Panel

1. Hap shfletuesin dhe shko te: **http://localhost:3000/admin**
2. Fut kredencialet:
   - **Email**: admin@nike.com
   - **Password**: admin123
3. Kliko **"Hyr"**

## Shtimi i Produktit të Ri

### Hapi 1: Hap Formularin

1. Nga Dashboard, kliko **"Menaxho Produktet"**
2. Kliko butonin **"+ Shto Produkt të Ri"** (butoni i gjelbër në krye)
3. Do të hapet një modal (dritare e re)

### Hapi 2: Plotëso Informacionet Bazë

**Emri i Produktit** (i detyrueshëm):
- Shkruaj emrin e plotë të patikes
- Shembull: "Nike Air Max 95 Premium"

**Përshkrimi** (opsional):
- Shkruaj një përshkrim të shkurtër
- Shembull: "Patika klasike me dizajn të njohur dhe komfort maksimal për përdorim të përditshëm."

**Çmimi** (i detyrueshëm):
- Shkruaj çmimin në euro
- Shembull: 125.00
- Mund të përdorësh edhe decimal (p.sh. 119.99)

### Hapi 3: Zgjedh Imazhin

1. Shiko grid-in me 11 imazhe
2. Kliko mbi imazhin që dëshiron
3. Imazhi i zgjedhur do të ketë border portokalli dhe një ✓ në qoshe

**Imazhet e disponueshme**:
- Nike1.jpg deri Nike11.jpg
- Të gjitha janë në `public/images/`

### Hapi 4: Shto Madhësitë dhe Ngjyrat

Aplikacioni vjen me 7 madhësi të paracaktuara (38-44), por mund t'i ndryshosh:

**Për çdo madhësi**:

1. **Madhësia**: Zgjedh nga dropdown (36-46)
2. **Ngjyra**: Zgjedh nga dropdown
   - Bardh
   - Zi
   - Kuq
   - Blu
   - Gri
   - Portokalli
   - Gjelbër
3. **Stoku**: Shkruaj sa copë ke në stok
   - Shembull: 15

**Për të shtuar më shumë madhësi**:
- Kliko butonin **"+ Shto Madhësi"** poshtë listës
- Do të shtohet një rresht i ri

**Për të fshirë një madhësi**:
- Kliko butonin **✕** (i kuq) në të djathtë të rreshtit

### Hapi 5: Ruaj Produktin

1. Kontrollo që të gjitha fushat janë plotësuar saktë
2. Kliko **"Ruaj Produktin"** (butoni i gjelbër poshtë)
3. Prit disa sekonda
4. Do të shfaqet mesazhi "Produkti u shtua me sukses!"
5. Modali do të mbyllet automatikisht
6. Produkti i ri do të shfaqet në listë

## Shembull i Plotë

```
Emri: Nike Air Max 95 Essential
Përshkrimi: Dizajn klasik me linja të dukshme dhe komfort të shkëlqyer. Perfekte për çdo ditë.
Çmimi: 129.00
Imazhi: Nike6.jpg (zgjedh nga galeria)

Madhësitë:
- 38, Bardh, Stoku: 10
- 39, Bardh, Stoku: 15
- 40, Bardh, Stoku: 20
- 41, Bardh, Stoku: 18
- 42, Bardh, Stoku: 12
- 43, Bardh, Stoku: 8
- 38, Zi, Stoku: 8
- 39, Zi, Stoku: 12
- 40, Zi, Stoku: 15
```

## Azhurnimi i Stokut

Nëse dëshiron të ndryshosh stokun për një produkt ekzistues:

1. Gjej produktin në listë
2. Shiko seksionin **"Madhësitë dhe Stoku"**
3. Ndryshoje numrin në fushën **"Stoku"**
4. Stoku do të ruhet automatikisht kur të largohesh nga fusha

**Ngjyrat e fushave**:
- **E kuqe**: Stoku është 0 (jashtë stoku)
- **E verdhë**: Stoku është < 5 (stok i ulët)
- **Normale**: Stoku është ≥ 5

## Fshirja e Produktit

1. Gjej produktin që dëshiron të fshish
2. Kliko butonin **🗑️ Fshij** në të djathtë
3. Konfirmo fshirjen
4. Produkti dhe të gjitha madhësitë e tij do të fshihen

⚠️ **Kujdes**: Fshirja është e përhershme!

## Këshilla

✅ **Shto stok realist**: Mos vendos stok shumë të lartë nëse nuk e ke fizikisht

✅ **Përdor përshkrime të mira**: Përshkrimet ndihmojnë klientët të vendosin

✅ **Kontrollo çmimet**: Sigurohu që çmimet janë të sakta para se të ruash

✅ **Shto shumë ngjyra**: Nëse ke të njëjtën patike në ngjyra të ndryshme, shtoji të gjitha

✅ **Azhurno stokun rregullisht**: Mbaje stokun të azhurnuar për të shmangur probleme

## Probleme të Mundshme

**Nuk mund të ruaj produktin?**
- Kontrollo që emri dhe çmimi janë plotësuar
- Sigurohu që ke zgjedhur një imazh
- Shiko console për gabime

**Imazhi nuk shfaqet?**
- Verifiko që imazhi ekziston në `public/images/`
- Kontrollo emrin e saktë të file-it

**Stoku nuk azhurnohet?**
- Verifiko që je i kyçur si admin
- Kontrollo lidhjen me Supabase

---

**Gëzuar menaxhimin e produkteve!** 🎉

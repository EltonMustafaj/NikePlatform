# Udhëzues për Menaxhimin e Postarëve

## 🔐 Kyçja si Postier

Postierët **nuk mund të regjistrohen vetë**. Vetëm **Administratori** ka mundësinë të krijojë llogari për postierë.

### Si të kyçeni si Postier:

1. Shkoni te faqja e login-it: [http://localhost:5173/postal](http://localhost:5173/postal)
2. Kyçuni me kredencialet që ju ka dhënë administratori:
   - **Username**: Emri i përdoruesit që ju ka caktuar admini
   - **Password**: Fjalëkalimi që ju ka caktuar admini

---

## 👨‍💼 Menaxhimi i Postarëve (Për Administratorë)

### Si të shtoni një Postar të ri:

1. Kyçuni si **Administrator**
2. Shkoni te **Dashboard** → **Menaxhimi i Postarëve**
3. Klikoni butonin **"+ Shto Postar"**
4. Plotësoni të dhënat e postarit:
   - **Emri i Plotë**: Emri dhe mbiemri i postarit
   - **Username**: Username për login (duhet të jetë unik)
   - **Password**: Fjalëkalimi për login
   - **Telefoni**: Numri i telefonit (opsional)
5. Klikoni **"Ruaj dhe Aprovo"**

### Çfarë ndodh pas shtimit:

- Postari krijohet me status **"Aktiv"** menjëherë
- Postari mund të kyçet në sistem duke përdorur kredencialet që i keni dhënë
- Postari do të shohë porosinë në Dashboard-in e tij dhe mund t'i marrë në dorë

### Menaxhimi i Postarëve Ekzistues:

#### Postierët Aktivë:
- Këtu shfaqen të gjithë postierët që janë **aktiv** në sistem
- Mund të **fshini** një postar duke klikuar butonin 🗑️

#### Postierët në Pritje:
- Nëse do të kishte postierë që kanë kërkuar regjistrim (historikisht, para se të hiqej ajo mundësi)
- Admini mund të **aprovonte** ✅ ose **refuzonte** ❌ kërkesat

---

## 📋 Njoftim i Rëndësishëm

- ⚠️ **Regjistrimi i Postarëve është hequr nga faqja publike**
- 🔒 Vetëm **Administratori** mund të krijojë llogari për postierë
- 📝 Postierët duhet të kontaktojnë administratorin për të marrë kredencialet e tyre
- 🔑 Ruajini mirë kredencialet që i jepni postarëve

---

## 🚀 Linqe të Shpejta

- **Login Administratori**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Login Postieri**: [http://localhost:5173/postal](http://localhost:5173/postal)
- **Menaxhimi i Postarëve**: [http://localhost:5173/admin/postal-workers](http://localhost:5173/admin/postal-workers)

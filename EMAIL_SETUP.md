# 📧 Udhëzues: Konfigurimi i Email Notifications

## Çfarë Bën?

Kur një klient bën një porosi, sistemi dërgon automatikisht 2 email:
1. **Email konfirmimi** te klienti
2. **Email njoftimi** te admini

## Setup i EmailJS (Falas)

### Hapi 1: Krijo Llogari në EmailJS

1. Shko te: https://www.emailjs.com/
2. Kliko **"Sign Up"**
3. Regjistrohu me email (falas deri në 200 email/muaj)
4. Verifiko email-in

### Hapi 2: Shto Email Service

1. Pas login, shko te **"Email Services"**
2. Kliko **"Add New Service"**
3. Zgjedh shërbimin e email-it (Gmail, Outlook, etj.)
4. Nëse përdor Gmail:
   - Kliko **"Connect Account"**
   - Kyçu me Gmail
   - Lejo akseset
5. Ruaj **Service ID** (p.sh. `service_abc123`)

### Hapi 3: Krijo Email Templates

#### Template 1: Konfirmim për Klientin

1. Shko te **"Email Templates"**
2. Kliko **"Create New Template"**
3. Emri: `Order Confirmation`
4. Përmbajtja:

```
Subject: Konfirmim Porosie - NIKE Patika #{{\order_id}}

Përshëndetje {{to_name}},

Faleminderit për porosinë tuaj!

DETAJET E POROSISË:
-------------------
Numri i Porosisë: #{{\order_id}}
Data: {{order_date}}

PRODUKTET:
{{items_list}}

TOTALI: €{{total_amount}}

ADRESA E DËRGESËS:
{{customer_address}}
Tel: {{customer_phone}}

PAGESA:
Pagesa do të bëhet me CASH kur të dërgohet porosia.

Do të kontaktoheni së shpejti për konfirmim.

Faleminderit,
NIKE Patika Team
```

5. Ruaj **Template ID** (p.sh. `template_xyz789`)

#### Template 2: Njoftim për Admin

1. Krijo template të ri
2. Emri: `New Order - Admin Notification`
3. Përmbajtja:

```
Subject: Porosi e Re #{{\order_id}} - {{customer_name}}

POROSI E RE!
============

Numri i Porosisë: #{{\order_id}}
Data: {{order_date}}

KLIENTI:
--------
Emri: {{customer_name}}
Email: {{customer_email}}
Tel: {{customer_phone}}
Adresa: {{customer_address}}

PRODUKTET:
----------
{{items_list}}

TOTALI: €{{total_amount}}

Shko te admin panel për të përpunuar porosinë:
http://localhost:3000/admin/orders

---
NIKE Patika Admin System
```

4. Ruaj **Template ID** (p.sh. `template_admin123`)

### Hapi 4: Merr Public Key

1. Shko te **"Account"** → **"General"**
2. Gjej **"Public Key"**
3. Kopjo (p.sh. `abc123XYZ`)

### Hapi 5: Konfiguro Aplikacionin

Hap `src/lib/emailService.js` dhe ndrysho:

```javascript
const EMAILJS_SERVICE_ID = 'service_abc123' // Service ID nga hapi 2
const EMAILJS_TEMPLATE_ID_CUSTOMER = 'template_xyz789' // Template ID për klientin
const EMAILJS_TEMPLATE_ID_ADMIN = 'template_admin123' // Template ID për admin
const EMAILJS_PUBLIC_KEY = 'abc123XYZ' // Public Key nga hapi 4
```

### Hapi 6: Testo

1. Rifillo aplikacionin (`npm run dev`)
2. Bëj një porosi test
3. Kontrollo email-in e klientit
4. Kontrollo email-in e admin-it

## Shembull i Plotë

### emailService.js (i konfiguruar)

```javascript
const EMAILJS_SERVICE_ID = 'service_nike2024'
const EMAILJS_TEMPLATE_ID_CUSTOMER = 'template_customer_confirm'
const EMAILJS_TEMPLATE_ID_ADMIN = 'template_admin_notify'
const EMAILJS_PUBLIC_KEY = 'xK9mP2vL4nR8qW3t'
```

## Problemet e Mundshme

### ❌ Email nuk dërgohet

**Shkaku 1**: Kredencialet gabim
- Verifiko Service ID, Template ID, Public Key

**Shkaku 2**: Gmail bllokon
- Shko te Gmail Settings → Security
- Aktivizo "Less secure app access"
- OSE përdor App Password

**Shkaku 3**: Limit i arritur
- EmailJS falas: 200 email/muaj
- Kontrollo dashboard për usage

### ❌ Email shkon në Spam

**Zgjidhja**:
- Shto sender në contacts
- Përmirëso subject line
- Përdor email profesional për dërgim

## Alternative (Nëse nuk funksionon EmailJS)

### 1. Supabase Edge Functions

Më kompleks por më profesional:
```bash
supabase functions new send-email
```

### 2. SendGrid

Falas deri në 100 email/ditë:
- https://sendgrid.com/

### 3. Mailgun

Falas deri në 5,000 email/muaj:
- https://www.mailgun.com/

## Testimi

### Test Email për Klientin

```javascript
const testData = {
  orderId: 'test-123',
  customerEmail: 'test@example.com',
  customerFirstName: 'Test',
  customerLastName: 'User',
  phone: '+383 44 123 456',
  address: 'Rruga Test 123',
  city: 'Prishtinë',
  totalAmount: 120.00,
  items: [
    {
      productName: 'Nike Air Max 90',
      color: 'Bardh',
      size: '40',
      quantity: 1,
      price: 120.00
    }
  ]
}

sendOrderConfirmationEmail(testData)
```

## Shënime

- ✅ Email-at dërgohen asinkronisht (nuk ngadalësojnë porosinë)
- ✅ Nëse email dështon, porosia prapë krijohet
- ✅ Errors logohen në console
- ✅ Mund të shtosh më shumë template për status updates

## Email për Status Updates

Kur admini ndryshon statusin, mund të dërgosh email:

```javascript
// Në OrderManagement.jsx
import { sendOrderStatusUpdateEmail } from '../lib/emailService'

const handleStatusChange = async (orderId, newStatus) => {
  await updateOrderStatus(orderId, newStatus)
  
  // Dërgo email
  const order = await getOrderById(orderId)
  sendOrderStatusUpdateEmail({
    orderId: order.id,
    customerEmail: order.customer.email,
    customerFirstName: order.customer.first_name,
    customerLastName: order.customer.last_name
  }, newStatus)
}
```

---

**✅ Pas konfigurimit, email-at do të dërgohen automatikisht!**

import emailjs from '@emailjs/browser'

// Konfigurimi i EmailJS (OPSIONALE - sistemi funksionon edhe pa email)
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID' // Ndrysho këtë nëse dëshiron email
const EMAILJS_TEMPLATE_ID_CUSTOMER = 'YOUR_TEMPLATE_ID_CUSTOMER'
const EMAILJS_TEMPLATE_ID_ADMIN = 'YOUR_TEMPLATE_ID_ADMIN'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

// Kontrollo nëse email është konfiguruar
const isEmailConfigured = () => {
    return EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
}

// Inicializo EmailJS vetëm nëse është konfiguruar
if (isEmailConfigured()) {
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY)
    } catch (error) {
        console.log('Email service not configured - continuing without email')
    }
}

/**
 * Dërgon email konfirmimi te klienti pas porosisë
 * OPSIONALE - nuk bllokon procesin nëse dështon
 */
export const sendOrderConfirmationEmail = async (orderData) => {
    // Nëse email nuk është konfiguruar, kthehu me sukses
    if (!isEmailConfigured()) {
        console.log('Email not configured - skipping customer notification')
        return { success: true, skipped: true }
    }

    try {
        const templateParams = {
            to_email: orderData.customerEmail,
            to_name: `${orderData.customerFirstName} ${orderData.customerLastName}`,
            order_id: orderData.orderId.slice(0, 8),
            order_date: new Date().toLocaleDateString('sq-AL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            total_amount: orderData.totalAmount.toFixed(2),
            items_list: orderData.items.map(item =>
                `${item.productName} - ${item.color} - Madhësia ${item.size} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}`
            ).join('\n'),
            customer_address: `${orderData.address}, ${orderData.city}`,
            customer_phone: orderData.phone
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID_CUSTOMER,
            templateParams
        )

        console.log('Email sent successfully:', response)
        return { success: true, response }
    } catch (error) {
        console.log('Email failed (non-critical):', error.message)
        // Kthehu me sukses edhe nëse email dështon
        return { success: true, error, skipped: true }
    }
}

/**
 * Dërgon email njoftimi te admini për porosi të re
 * OPSIONALE - nuk bllokon procesin nëse dështon
 */
export const sendNewOrderNotificationToAdmin = async (orderData) => {
    if (!isEmailConfigured()) {
        console.log('Email not configured - skipping admin notification')
        return { success: true, skipped: true }
    }

    try {
        const templateParams = {
            to_email: 'admin@nike.com',
            order_id: orderData.orderId.slice(0, 8),
            customer_name: `${orderData.customerFirstName} ${orderData.customerLastName}`,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.phone,
            customer_address: `${orderData.address}, ${orderData.city}`,
            total_amount: orderData.totalAmount.toFixed(2),
            items_list: orderData.items.map(item =>
                `${item.productName} - ${item.color} - Madhësia ${item.size} x${item.quantity}`
            ).join('\n'),
            order_date: new Date().toLocaleDateString('sq-AL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID_ADMIN,
            templateParams
        )

        console.log('Admin notification sent:', response)
        return { success: true, response }
    } catch (error) {
        console.log('Admin email failed (non-critical):', error.message)
        return { success: true, error, skipped: true }
    }
}

/**
 * Dërgon email kur statusi i porosisë ndryshon
 * OPSIONALE - nuk bllokon procesin nëse dështon
 */
export const sendOrderStatusUpdateEmail = async (orderData, newStatus) => {
    if (!isEmailConfigured()) {
        return { success: true, skipped: true }
    }

    try {
        let statusMessage = ''
        let statusTitle = ''

        switch (newStatus) {
            case 'Në Dërgesë':
                statusTitle = 'Porosia Juaj Po Dërgohet'
                statusMessage = 'Porosia juaj është paketuar dhe po dërgohet. Do të merrni produktin së shpejti!'
                break
            case 'E Dorëzuar':
                statusTitle = 'Porosia Juaj U Dorëzua'
                statusMessage = 'Porosia juaj u dorëzua me sukses. Faleminderit që bleni nga NIKE Patika!'
                break
            default:
                statusTitle = 'Azhurnim i Porosisë'
                statusMessage = `Statusi i porosisë tuaj u ndryshua në: ${newStatus}`
        }

        const templateParams = {
            to_email: orderData.customerEmail,
            to_name: `${orderData.customerFirstName} ${orderData.customerLastName}`,
            order_id: orderData.orderId.slice(0, 8),
            status_title: statusTitle,
            status_message: statusMessage,
            new_status: newStatus
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID_CUSTOMER,
            templateParams
        )

        console.log('Status update email sent:', response)
        return { success: true, response }
    } catch (error) {
        console.log('Status email failed (non-critical):', error.message)
        return { success: true, error, skipped: true }
    }
}


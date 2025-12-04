import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createCustomer, getCustomerByEmail, createOrder, createOrderItems, decrementStock } from '../lib/api'
import './Checkout.css'

const Checkout = () => {
    const navigate = useNavigate()
    const { cart, getCartTotal, clearCart } = useCart()
    const { admin } = useAuth()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    })

    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [orderId, setOrderId] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Create or get customer
            let customer = await getCustomerByEmail(formData.email)

            if (!customer) {
                customer = await createCustomer({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zip_code: formData.zipCode
                })
            }

            // 2. Create order (without assigned postal worker - they will choose themselves)
            const order = await createOrder({
                customer_id: customer.id,
                total_amount: getCartTotal(),
                status: 'E Papërpunuar',
                assigned_to: null  // No postal worker assigned yet
            })

            // 3. Create order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                variant_id: item.variant.id,
                quantity: item.quantity,
                price: item.product.price
            }))

            await createOrderItems(orderItems)

            // 4. Decrement stock for each item
            for (const item of cart) {
                await decrementStock(item.variant.id, item.quantity)
            }

            // 5. Auto-assign removed - Postal workers will pick orders themselves
            // (Step skipped)

            // 6. Clear cart and show success
            setOrderId(order.id)
            setShowSuccess(true)
            clearCart()

            // Redirect to home after 4 seconds
            setTimeout(() => {
                navigate('/')
            }, 4000)

        } catch (error) {
            console.error('Error creating order:', error)
            alert('Ndodhi një gabim gjatë krijimit të porosisë. Ju lutem provoni përsëri.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (cart.length === 0 && !showSuccess) {
            navigate('/cart')
        }
    }, [cart.length, showSuccess, navigate])

    // Prevent admins from accessing checkout
    useEffect(() => {
        if (admin) {
            navigate('/')
        }
    }, [admin, navigate])

    return (
        <div className="checkout-page">
            <div className="container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Finalizimi i Porosisë
                </motion.h1>

                <div className="checkout-layout">
                    {/* Checkout Form */}
                    <motion.div
                        className="checkout-form-container glass-card"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2>Informacionet Tuaja</h2>

                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Emri *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Mbiemri *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Numri i Telefonit *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+383 XX XXX XXX"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Adresa *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Rruga, Numri"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">Qyteti *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zipCode">Kodi Postar</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary btn-full btn-large"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? 'Duke Përpunuar...' : 'Konfirmo Porosinë'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        className="order-summary glass-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2>Përmbledhja e Porosisë</h2>

                        <div className="order-items">
                            {cart.map(item => (
                                <div key={`${item.product.id}-${item.variant.id}`} className="order-item">
                                    <img src={item.product.image_url} alt={item.product.name} />
                                    <div className="order-item-info">
                                        <h4>{item.product.name}</h4>
                                        <p>
                                            {item.variant.color} - Madhësia {item.variant.size}
                                        </p>
                                        <p className="order-item-quantity">Sasia: {item.quantity}</p>
                                    </div>
                                    <div className="order-item-price">
                                        €{(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Nëntotali:</span>
                                <span>€{getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Dërgesa:</span>
                                <span className="free">Falas</span>
                            </div>
                            <div className="total-divider"></div>
                            <div className="total-row total-final">
                                <span>Totali:</span>
                                <span>€{getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="payment-notice">
                            <div className="notice-icon">💵</div>
                            <div>
                                <strong>Pagesa me CASH</strong>
                                <p>Pagesa do të bëhet kur të dërgohet porosia</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="success-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="success-modal"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <motion.div
                                className="success-checkmark"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            >
                                ✓
                            </motion.div>

                            <h2>Rezervimi u krye me sukses!</h2>
                            <p>Porosia juaj është regjistruar dhe do të përpunohet së shpejti.</p>
                            <p className="order-number">Numri i porosisë: #{orderId?.slice(0, 8)}</p>

                            <div className="success-info">
                                <p><strong>Pagesa do të bëhet CASH kur të dërgohet porosia.</strong></p>
                                <p>Do të kontaktoheni së shpejti për konfirmim.</p>
                            </div>

                            <motion.div
                                className="success-redirect"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <p>Do të ridrejtoheni në faqen kryesore...</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Checkout

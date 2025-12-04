import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

const Cart = () => {
    const navigate = useNavigate()
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
    const { admin } = useAuth()

    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate('/checkout')
        }
    }

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <div className="container">
                    <motion.div
                        className="empty-cart-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Shporta është bosh</h2>
                        <p>Nuk keni shtuar asnjë produkt në shportë ende.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Vazhdo Blerjen
                        </button>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Shporta Juaj
                </motion.h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div
                                    key={`${item.product.id}-${item.variant.id}`}
                                    className="cart-item glass-card"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="cart-item-image">
                                        <img src={item.product.image_url} alt={item.product.name} />
                                    </div>

                                    <div className="cart-item-details">
                                        <h3>{item.product.name}</h3>
                                        <div className="cart-item-specs">
                                            <span className="spec">
                                                <strong>Ngjyra:</strong> {item.variant.color}
                                            </span>
                                            <span className="spec">
                                                <strong>Madhësia:</strong> {item.variant.size}
                                            </span>
                                        </div>
                                        <div className="cart-item-price">
                                            €{item.product.price} × {item.quantity} = <strong>€{(item.product.price * item.quantity).toFixed(2)}</strong>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <motion.button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                −
                                            </motion.button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <motion.button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.variant.stock}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>

                                        <motion.button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.product.id, item.variant.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            🗑️ Fshij
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cart Summary */}
                    <motion.div
                        className="cart-summary glass-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2>Përmbledhje</h2>

                        <div className="summary-row">
                            <span>Artikuj:</span>
                            <span>{getCartCount()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Nëntotali:</span>
                            <span>€{getCartTotal().toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Dërgesa:</span>
                            <span className="free-shipping">Falas</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Totali:</span>
                            <span>€{getCartTotal().toFixed(2)}</span>
                        </div>

                        <motion.button
                            className="btn btn-primary btn-full btn-large"
                            onClick={handleCheckout}
                            disabled={admin}
                            whileHover={{ scale: admin ? 1 : 1.02 }}
                            whileTap={{ scale: admin ? 1 : 0.98 }}
                        >
                            {admin ? 'Administratorët nuk mund të porosisin' : 'Vazhdo me Rezervimin'}
                        </motion.button>

                        <button
                            className="btn btn-secondary btn-full"
                            onClick={() => navigate('/')}
                        >
                            Vazhdo Blerjen
                        </button>

                        <div className="payment-info">
                            <p>💵 Pagesa bëhet <strong>CASH</strong> në dorëzim</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Cart

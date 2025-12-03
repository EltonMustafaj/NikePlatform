import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
    const { getCartCount } = useCart()
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const cartCount = getCartCount()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <img src="/images/logo.jpg" alt="Nike Logo" />
                    <span className="text-gradient">NIKE</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">
                        Ballina
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/admin/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            <Link to="/admin/products" className="nav-link">
                                Produktet
                            </Link>
                            <Link to="/admin/orders" className="nav-link">
                                Porositë
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                Dil
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/cart" className="nav-link cart-link">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" />
                                    <circle cx="9" cy="20" r="1" />
                                    <circle cx="15" cy="20" r="1" />
                                </svg>
                                Shporta
                                {cartCount > 0 && (
                                    <motion.span
                                        className="cart-badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </Link>
                            <Link to="/admin" className="btn btn-outline btn-sm">
                                Admin
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById } from '../lib/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import './ProductDetail.css'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        loadProduct()
    }, [id])

    const loadProduct = async () => {
        try {
            const data = await getProductById(id)
            setProduct(data)
        } catch (error) {
            console.error('Error loading product:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedSize && product) {
            // Find variant with this size
            const variant = product.variants.find(v => v.size === selectedSize)
            setSelectedVariant(variant)
        } else {
            setSelectedVariant(null)
        }
    }, [selectedSize, product])

    const handleAddToCart = () => {
        if (!selectedVariant) return

        addToCart(product, selectedVariant, 1)

        // Show success animation
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Produkti nuk u gjet</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Kthehu në Ballina
                </button>
            </div>
        )
    }

    // Get all available sizes
    const availableSizes = product.variants
        ? [...new Set(product.variants.map(v => v.size))]
            .sort((a, b) => parseFloat(a) - parseFloat(b))
        : []

    return (
        <div className="product-detail">
            <div className="container">
                <motion.button
                    className="back-button"
                    onClick={() => navigate('/')}
                    whileHover={{ x: -5 }}
                >
                    ← Kthehu Mbrapa
                </motion.button>

                <div className="product-detail-content">
                    {/* Product Image */}
                    <motion.div
                        className="product-detail-image"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src={product.image_url}
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/images/Nike1.jpg'
                            }}
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        className="product-detail-info"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="product-detail-title">{product.name}</h1>
                        <p className="product-detail-description">{product.description}</p>

                        <div className="product-detail-price">
                            <span className="price-label">Çmimi:</span>
                            <span className="price-value">€{product.price}</span>
                        </div>

                        {/* Size Selection */}
                        <motion.div
                            className="selection-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <label className="selection-label">Zgjedh Madhësinë:</label>
                            <div className="size-options">
                                {availableSizes.map(size => {
                                    return (
                                        <motion.button
                                            key={size}
                                            className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="size-number">{size}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Add to Cart Button */}
                        <motion.button
                            className="btn btn-primary btn-large btn-full add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant}
                            whileHover={{ scale: selectedVariant ? 1.02 : 1 }}
                            whileTap={{ scale: selectedVariant ? 0.98 : 1 }}
                        >
                            {!selectedSize ? 'Zgjedh Madhësinë' : 'Shto në Shportë'}
                        </motion.button>
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
                            className="success-content"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <div className="success-icon">✓</div>
                            <p>Shtuar në shportë!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProductDetail

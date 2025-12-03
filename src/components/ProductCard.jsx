import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './ProductCard.css'

const ProductCard = ({ product }) => {
    const hasVariants = product.variants && product.variants.length > 0

    return (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <motion.div
                className="product-card glass-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className="product-image-container">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/images/Nike1.jpg'
                        }}
                    />
                    {!hasVariants && (
                        <div className="out-of-stock-overlay">
                            <span>Nuk ka madhësi</span>
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>

                    <div className="product-footer">
                        <div className="product-price">
                            <span className="price-amount">€{product.price}</span>
                        </div>
                    </div>

                    <motion.button
                        className="btn btn-primary btn-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Shiko Detajet
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    )
}

export default ProductCard

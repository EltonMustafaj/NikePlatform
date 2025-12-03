import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProducts } from '../lib/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './Home.css'

const Home = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedColor, setSelectedColor] = useState('all')

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesColor = selectedColor === 'all' ||
            (product.variants && product.variants.some(v => v.color.toLowerCase() === selectedColor.toLowerCase()))
        return matchesSearch && matchesColor
    })

    // Get unique colors from all products
    const allColors = [...new Set(
        products.flatMap(p => p.variants?.map(v => v.color) || [])
    )].filter(Boolean)

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <motion.section
                className="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="hero-title">
                            Mirë se vini në <span className="text-gradient">NIKE</span>
                        </h1>
                        <p className="hero-subtitle">
                            Zbuloni koleksionin më të ri të patikave NIKE. Cilësi premium, dizajn modern.
                        </p>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <button
                                className="btn btn-primary btn-large"
                                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Shiko Produktet
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Products Section */}
            <section id="products" className="products-section">
                <div className="container">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title text-center">
                            Produktet Tona
                        </h2>

                        {/* Filters */}
                        <div className="filters">
                            <div className="search-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Kërko patika..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="color-filters">
                                <button
                                    className={`color-filter-btn ${selectedColor === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedColor('all')}
                                >
                                    Të Gjitha
                                </button>
                                {allColors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-filter-btn ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="no-products">
                                <p>Nuk u gjetën produkte.</p>
                            </div>
                        ) : (
                            <motion.div
                                className="products-grid"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Home

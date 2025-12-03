import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getOrders, getProducts } from '../../lib/api'
import './Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        inTransit: 0,
        completed: 0,
        totalProducts: 0,
        lowStock: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin')
            return
        }
        loadStats()
    }, [isAuthenticated])

    const loadStats = async () => {
        try {
            const [orders, products] = await Promise.all([
                getOrders(),
                getProducts()
            ])

            const pending = orders.filter(o => o.status === 'E Papërpunuar').length
            const inTransit = orders.filter(o => o.status === 'Në Dërgesë').length
            const completed = orders.filter(o => o.status === 'E Dorëzuar').length

            const lowStock = products.reduce((count, product) => {
                const hasLowStock = product.variants?.some(v => v.stock > 0 && v.stock < 5)
                return count + (hasLowStock ? 1 : 0)
            }, 0)

            setStats({
                totalOrders: orders.length,
                pendingOrders: pending,
                inTransit,
                completed,
                totalProducts: products.length,
                lowStock
            })
        } catch (error) {
            console.error('Error loading stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>
    }

    return (
        <div className="admin-dashboard">
            <div className="container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Dashboard
                </motion.h1>

                <div className="stats-grid">
                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'var(--gradient-nike)' }}>📦</div>
                        <div className="stat-info">
                            <h3>Porosi Totale</h3>
                            <p className="stat-number">{stats.totalOrders}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>⏳</div>
                        <div className="stat-info">
                            <h3>Në Pritje</h3>
                            <p className="stat-number">{stats.pendingOrders}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>🚚</div>
                        <div className="stat-info">
                            <h3>Në Dërgesë</h3>
                            <p className="stat-number">{stats.inTransit}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>✓</div>
                        <div className="stat-info">
                            <h3>Të Dorëzuara</h3>
                            <p className="stat-number">{stats.completed}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>👟</div>
                        <div className="stat-info">
                            <h3>Produkte</h3>
                            <p className="stat-number">{stats.totalProducts}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>⚠️</div>
                        <div className="stat-info">
                            <h3>Stok i Ulët</h3>
                            <p className="stat-number">{stats.lowStock}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="quick-actions">
                    <motion.button
                        className="btn btn-primary"
                        onClick={() => navigate('/admin/products')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Menaxho Produktet
                    </motion.button>
                    <motion.button
                        className="btn btn-primary"
                        onClick={() => navigate('/admin/orders')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Shiko Porositë
                    </motion.button>
                    <motion.button
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/postal-workers')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Menaxho Postarët
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

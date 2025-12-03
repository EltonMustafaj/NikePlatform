import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getOrders, updateOrderStatus, subscribeToOrders, getPostalWorkers, deleteOrder } from '../../lib/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import './OrderManagement.css'

const OrderManagement = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [newOrderNotification, setNewOrderNotification] = useState(false)
    const [postalWorkers, setPostalWorkers] = useState([])

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin')
            return
        }
        loadOrders()

        // Subscribe to new orders
        const subscription = subscribeToOrders((payload) => {
            console.log('New order received:', payload)
            setNewOrderNotification(true)
            setTimeout(() => setNewOrderNotification(false), 3000)
            loadOrders()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [isAuthenticated])

    const loadOrders = async () => {
        try {
            const [ordersData, workersData] = await Promise.all([
                getOrders(),
                getPostalWorkers()
            ])
            setOrders(ordersData)
            setPostalWorkers(workersData)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            await loadOrders()
        } catch (error) {
            console.error('Error updating order status:', error)
            alert('Gabim gjatë azhurimit të statusit')
        }
    }

    const handleDelete = async (orderId) => {
        if (!confirm('A jeni i sigurt që dëshironi të fshini këtë porosi? Ky veprim nuk mund të kthehet prapa.')) return

        try {
            await deleteOrder(orderId)
            await loadOrders()
        } catch (error) {
            console.error('Error deleting order:', error)
            alert('Gabim gjatë fshirjes së porosisë')
        }
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter)

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'E Papërpunuar':
                return 'badge-warning'
            case 'Në Dërgesë':
                return 'badge-info'
            case 'E Dorëzuar':
                return 'badge-success'
            default:
                return 'badge-warning'
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="order-management">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Menaxhimi i Porosive</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/admin/dashboard')}>
                        ← Kthehu në Dashboard
                    </button>
                </div>

                {/* New Order Notification */}
                <AnimatePresence>
                    {newOrderNotification && (
                        <motion.div
                            className="new-order-notification"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            🔔 Porosi e re u pranua!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters */}
                <div className="order-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Të Gjitha ({orders.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'E Papërpunuar' ? 'active' : ''}`}
                        onClick={() => setFilter('E Papërpunuar')}
                    >
                        E Papërpunuar ({orders.filter(o => o.status === 'E Papërpunuar').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'Në Dërgesë' ? 'active' : ''}`}
                        onClick={() => setFilter('Në Dërgesë')}
                    >
                        Në Dërgesë ({orders.filter(o => o.status === 'Në Dërgesë').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'E Dorëzuar' ? 'active' : ''}`}
                        onClick={() => setFilter('E Dorëzuar')}
                    >
                        E Dorëzuar ({orders.filter(o => o.status === 'E Dorëzuar').length})
                    </button>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <p>Nuk ka porosi për këtë filtër.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                className="order-card glass-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="order-header compact-header">
                                    <div className="header-left">
                                        <h3>#{order.id.slice(0, 8)}</h3>
                                        <span className="order-date-compact">
                                            {new Date(order.created_at).toLocaleDateString('sq-AL')}
                                        </span>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(order.status)} compact-badge`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-body-compact">
                                    <div className="info-section">
                                        <h4 className="compact-title">👤 Klienti</h4>
                                        <div className="compact-info">
                                            <p><strong>{order.customer?.first_name} {order.customer?.last_name}</strong></p>
                                            <p>{order.customer?.phone}</p>
                                            <p className="address-truncate" title={`${order.customer?.address}, ${order.customer?.city}`}>
                                                {order.customer?.address}, {order.customer?.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="info-section">
                                        <h4 className="compact-title">📦 Postari</h4>
                                        {order.assigned_to ? (
                                            <div className="assigned-worker compact-worker">
                                                ✅ {postalWorkers.find(w => w.id === order.assigned_to)?.full_name || 'I caktuar'}
                                            </div>
                                        ) : (
                                            <div className="compact-info">
                                                <p className="waiting-postal">⏳ Duke pritur postierin...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="order-items-compact">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="compact-item">
                                            <span>{item.variant?.product?.name} ({item.variant?.size})</span>
                                            <span>x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer compact-footer">
                                    <div className="total-compact">
                                        <strong>€{order.total_amount}</strong>
                                    </div>

                                    <div className="actions-compact">
                                        {order.status === 'E Papërpunuar' && (
                                            <button
                                                className="btn-icon btn-send"
                                                onClick={() => handleStatusChange(order.id, 'Në Dërgesë')}
                                                title="Dërgo Porosinë"
                                            >
                                                🚀
                                            </button>
                                        )}
                                        {order.status === 'Në Dërgesë' && (
                                            <button
                                                className="btn-icon btn-complete"
                                                onClick={() => handleStatusChange(order.id, 'E Dorëzuar')}
                                                title="Shëno si të Dorëzuar"
                                            >
                                                ✅
                                            </button>
                                        )}
                                        {order.status === 'E Dorëzuar' && (
                                            <>
                                                <span className="status-text-success">✓ E Dorëzuar</span>
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(order.id)}
                                                    title="Fshij Porosinë"
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderManagement

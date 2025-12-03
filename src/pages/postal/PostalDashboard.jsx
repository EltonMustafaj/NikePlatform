import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePostalAuth } from '../../context/PostalAuthContext'
import { getOrders, assignOrderToPostalWorker, updateOrderWithNotes } from '../../lib/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import './PostalDashboard.css'

const PostalDashboard = () => {
    const navigate = useNavigate()
    const { postalWorker, isAuthenticated, logout } = usePostalAuth()

    const [availableOrders, setAvailableOrders] = useState([]) // Orders not assigned yet
    const [myOrders, setMyOrders] = useState([]) // Orders assigned to me (in progress)
    const [completedOrders, setCompletedOrders] = useState([]) // Orders I completed
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('available') // 'available', 'mine', or 'completed'
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [deliveryNotes, setDeliveryNotes] = useState('')

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/postal')
            return
        }
        loadOrders()
    }, [isAuthenticated])

    const loadOrders = async () => {
        try {
            const allOrders = await getOrders()

            // Split orders into three categories
            const available = allOrders.filter(order =>
                order.assigned_to === null && order.status === 'E Papërpunuar'
            )
            const mine = allOrders.filter(order =>
                order.assigned_to === postalWorker.id && order.status !== 'E Dorëzuar'
            )
            const completed = allOrders.filter(order =>
                order.assigned_to === postalWorker.id && order.status === 'E Dorëzuar'
            )

            setAvailableOrders(available)
            setMyOrders(mine)
            setCompletedOrders(completed)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleTakeOrder = async (orderId) => {
        if (!confirm('Dëshiron ta marrësh këtë porosi?')) return

        try {
            await assignOrderToPostalWorker(orderId, postalWorker.id)
            await loadOrders()
            alert('Porosia u caktua me sukses!')
        } catch (error) {
            console.error('Error taking order:', error)
            alert('Gabim gjatë marrjes së porosisë')
        }
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderWithNotes(orderId, newStatus, deliveryNotes)
            setDeliveryNotes('')
            setSelectedOrder(null)
            await loadOrders()
        } catch (error) {
            console.error('Error updating order:', error)
            alert('Gabim gjatë azhurimit të statusit')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'E Papërpunuar':
                return '#ff9800'
            case 'Në Dërgesë':
                return '#2196f3'
            case 'E Dorëzuar':
                return '#4caf50'
            default:
                return '#757575'
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        )
    }

    const displayOrders = filter === 'available'
        ? availableOrders
        : filter === 'mine'
            ? myOrders
            : completedOrders

    return (
        <div className="postal-dashboard">
            <div className="postal-header">
                <div className="postal-header-content">
                    <div>
                        <h1>📦 Dashboard - Posta</h1>
                        <p>Mirë se erdhe, {postalWorker?.full_name}</p>
                    </div>
                    <button className="btn-logout" onClick={logout}>
                        Dil
                    </button>
                </div>
            </div>

            <div className="postal-container">
                {/* Stats */}
                <div className="postal-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <h3>{availableOrders.length}</h3>
                            <p>Porosi të Disponueshme</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{myOrders.length}</h3>
                            <p>Në Progres</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>{completedOrders.length}</h3>
                            <p>Të Përfunduara</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-info">
                            <h3>{myOrders.filter(o => o.status === 'Në Dërgesë').length}</h3>
                            <p>Në Dërgesë</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="postal-filters">
                    <button
                        className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                        onClick={() => setFilter('available')}
                    >
                        📋 Të Disponueshme ({availableOrders.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
                        onClick={() => setFilter('mine')}
                    >
                        📦 Në Progres ({myOrders.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        ✅ Të Përfunduara ({completedOrders.length})
                    </button>
                </div>

                {/* Orders List */}
                <div className="postal-orders">
                    {displayOrders.length === 0 ? (
                        <div className="no-orders">
                            <p>
                                {filter === 'available' && 'Nuk ka porosi të disponueshme.'}
                                {filter === 'mine' && 'Nuk ke porosi në progres.'}
                                {filter === 'completed' && 'Nuk ke porosi të përfunduara ende.'}
                            </p>
                        </div>
                    ) : (
                        displayOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                className="postal-order-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="order-card-header">
                                    <div>
                                        <h3>Porosia #{order.id.slice(0, 8)}</h3>
                                        <p className="order-date">
                                            {new Date(order.created_at).toLocaleDateString('sq-AL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-customer-info">
                                    <h4>👤 Informacionet e Klientit:</h4>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <strong>Emri:</strong>
                                            <span>{order.customer?.first_name} {order.customer?.last_name}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Telefoni:</strong>
                                            <span>{order.customer?.phone}</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <strong>Adresa:</strong>
                                            <span>{order.customer?.address}, {order.customer?.city}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-items-section">
                                    <h4>📦 Produktet:</h4>
                                    {order.items?.map(item => (
                                        <div key={item.id} className="order-item">
                                            <img
                                                src={item.variant?.product?.image_url}
                                                alt={item.variant?.product?.name}
                                            />
                                            <div className="item-details">
                                                <strong>{item.variant?.product?.name}</strong>
                                                <p>Madhësia {item.variant?.size} × {item.quantity}</p>
                                            </div>
                                            <div className="item-price">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-total">
                                    <strong>Totali:</strong>
                                    <span>€{order.total_amount}</span>
                                </div>

                                {order.delivery_notes && (
                                    <div className="delivery-notes">
                                        <strong>Shënime:</strong>
                                        <p>{order.delivery_notes}</p>
                                    </div>
                                )}

                                <div className="order-actions">
                                    {filter === 'available' && (
                                        <motion.button
                                            className="btn-action btn-take-order"
                                            onClick={() => handleTakeOrder(order.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            ✋ Merr Porosinë
                                        </motion.button>
                                    )}

                                    {filter === 'mine' && order.status === 'E Papërpunuar' && (
                                        <motion.button
                                            className="btn-action btn-shipping"
                                            onClick={() => handleStatusUpdate(order.id, 'Në Dërgesë')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            🚚 Fillo Dorëzimin
                                        </motion.button>
                                    )}

                                    {filter === 'mine' && order.status === 'Në Dërgesë' && (
                                        <>
                                            {selectedOrder === order.id ? (
                                                <div className="notes-section">
                                                    <textarea
                                                        placeholder="Shto shënime për dorëzimin (opsionale)..."
                                                        value={deliveryNotes}
                                                        onChange={(e) => setDeliveryNotes(e.target.value)}
                                                        rows="3"
                                                    />
                                                    <div className="notes-actions">
                                                        <button
                                                            className="btn-action btn-delivered"
                                                            onClick={() => handleStatusUpdate(order.id, 'E Dorëzuar')}
                                                        >
                                                            ✅ Konfirmo Dorëzimin
                                                        </button>
                                                        <button
                                                            className="btn-action btn-cancel"
                                                            onClick={() => {
                                                                setSelectedOrder(null)
                                                                setDeliveryNotes('')
                                                            }}
                                                        >
                                                            Anulo
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <motion.button
                                                    className="btn-action btn-delivered"
                                                    onClick={() => setSelectedOrder(order.id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    ✅ Shëno si të Dorëzuar
                                                </motion.button>
                                            )}
                                        </>
                                    )}

                                    {filter === 'completed' && (
                                        <div className="completed-badge">✓ E Dorëzuar</div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostalDashboard

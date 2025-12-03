import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    getActivePostalWorkers,
    getPendingPostalWorkers,
    createPostalWorker,
    deletePostalWorker,
    approvePostalWorker,
    updatePostalWorkerStatus
} from '../../lib/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import './PostalWorkerManagement.css'

const PostalWorkerManagement = () => {
    const navigate = useNavigate()
    const { isAuthenticated, admin } = useAuth()

    const [activeWorkers, setActiveWorkers] = useState([])
    const [pendingWorkers, setPendingWorkers] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('active') // 'active' or 'pending'
    const [showAddModal, setShowAddModal] = useState(false)
    const [newWorker, setNewWorker] = useState({
        username: '',
        password: '',
        full_name: '',
        phone: ''
    })

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin')
            return
        }
        loadWorkers()
    }, [isAuthenticated])

    const loadWorkers = async () => {
        try {
            const [active, pending] = await Promise.all([
                getActivePostalWorkers(),
                getPendingPostalWorkers()
            ])
            setActiveWorkers(active)
            setPendingWorkers(pending)
        } catch (error) {
            console.error('Error loading postal workers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddWorker = async (e) => {
        e.preventDefault()

        if (!newWorker.username || !newWorker.password || !newWorker.full_name) {
            alert('Ju lutem plotësoni të gjitha fushat e detyrueshme')
            return
        }

        try {
            // Admin added workers are automatically active
            await createPostalWorker({ ...newWorker, status: 'active', approved_by: admin.id, approved_at: new Date().toISOString() })
            setNewWorker({ username: '', password: '', full_name: '', phone: '' })
            setShowAddModal(false)
            await loadWorkers()
            alert('Postari u shtua me sukses!')
        } catch (error) {
            console.error('Error creating postal worker:', error)
            alert('Gabim gjatë shtimit të postarit')
        }
    }

    const handleDeleteWorker = async (id) => {
        if (!confirm('A jeni i sigurt që dëshironi të fshini këtë postar?')) return

        try {
            await deletePostalWorker(id)
            await loadWorkers()
        } catch (error) {
            console.error('Error deleting postal worker:', error)
            alert('Gabim gjatë fshirjes së postarit')
        }
    }

    const handleApprove = async (workerId) => {
        try {
            await approvePostalWorker(workerId, admin.id)
            await loadWorkers()
            alert('Postari u aprovua me sukses!')
        } catch (error) {
            console.error('Error approving worker:', error)
            alert('Gabim gjatë aprovimit')
        }
    }

    const handleReject = async (workerId) => {
        if (!confirm('A jeni i sigurt që dëshironi të refuzoni këtë kërkesë?')) return

        try {
            await deletePostalWorker(workerId) // Or set status to 'rejected'
            await loadWorkers()
        } catch (error) {
            console.error('Error rejecting worker:', error)
            alert('Gabim gjatë refuzimit')
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
        <div className="postal-worker-management">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Menaxhimi i Postarëve</h1>
                        <p className="text-muted">Menaxho stafin e shpërndarjes</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            + Shto Postar
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                            ← Dashboard
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Aktivë ({activeWorkers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Në Pritje {pendingWorkers.length > 0 && <span className="badge badge-warning">{pendingWorkers.length}</span>}
                    </button>
                </div>

                <div className="workers-grid">
                    {activeTab === 'active' ? (
                        activeWorkers.length === 0 ? (
                            <div className="no-workers">
                                <p>Nuk ka postarë aktivë.</p>
                            </div>
                        ) : (
                            activeWorkers.map((worker, index) => (
                                <motion.div
                                    key={worker.id}
                                    className="worker-card glass-card active-worker"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="worker-status-indicator active"></div>
                                    <div className="worker-icon">📦</div>
                                    <h3>{worker.full_name}</h3>
                                    <div className="worker-info">
                                        <p><strong>Username:</strong> {worker.username}</p>
                                        <p><strong>Telefoni:</strong> {worker.phone || 'N/A'}</p>
                                        <p className="worker-date">
                                            Aktiv që nga: {new Date(worker.approved_at || worker.created_at).toLocaleDateString('sq-AL')}
                                        </p>
                                    </div>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteWorker(worker.id)}
                                    >
                                        🗑️ Fshij
                                    </button>
                                </motion.div>
                            ))
                        )
                    ) : (
                        pendingWorkers.length === 0 ? (
                            <div className="no-workers">
                                <p>Nuk ka kërkesa në pritje.</p>
                            </div>
                        ) : (
                            pendingWorkers.map((worker, index) => (
                                <motion.div
                                    key={worker.id}
                                    className="worker-card glass-card pending-worker"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="worker-status-indicator pending"></div>
                                    <div className="worker-header">
                                        <div className="worker-icon">⏳</div>
                                        <span className="badge badge-warning">Në Pritje</span>
                                    </div>
                                    <h3>{worker.full_name}</h3>
                                    <div className="worker-info">
                                        <p><strong>Username:</strong> {worker.username}</p>
                                        <p><strong>Telefoni:</strong> {worker.phone || 'N/A'}</p>
                                        <p className="worker-date">
                                            Regjistruar: {new Date(worker.created_at).toLocaleDateString('sq-AL')}
                                        </p>
                                    </div>
                                    <div className="worker-actions">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApprove(worker.id)}
                                        >
                                            ✅ Aprovo
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleReject(worker.id)}
                                        >
                                            ❌ Refuzo
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )
                    )}
                </div>

                {/* Add Worker Modal */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <motion.div
                            className="modal-content glass-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Shto Postar të Ri</h2>
                                <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleAddWorker} className="worker-form">
                                <div className="form-group">
                                    <label>Emri i Plotë *</label>
                                    <input
                                        type="text"
                                        value={newWorker.full_name}
                                        onChange={(e) => setNewWorker({ ...newWorker, full_name: e.target.value })}
                                        placeholder="p.sh. Agim Krasniqi"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Username *</label>
                                    <input
                                        type="text"
                                        value={newWorker.username}
                                        onChange={(e) => setNewWorker({ ...newWorker, username: e.target.value })}
                                        placeholder="p.sh. agim.k"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password *</label>
                                    <input
                                        type="password"
                                        value={newWorker.password}
                                        onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                                        placeholder="Shkruaj password-in"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Telefoni</label>
                                    <input
                                        type="tel"
                                        value={newWorker.phone}
                                        onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                                        placeholder="+383 XX XXX XXX"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Anulo
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Ruaj dhe Aprovo
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostalWorkerManagement

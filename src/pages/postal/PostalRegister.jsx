import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createPostalWorker } from '../../lib/api'
import './PostalLogin.css'

const PostalRegister = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        phone: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!formData.username || !formData.password || !formData.full_name) {
            setError('Plotëso të gjitha fushat e detyrueshme')
            setLoading(false)
            return
        }

        try {
            await createPostalWorker(formData)
            alert('Llogaria u krijua me sukses! Ju lutem prisni aprovimin nga admini për t\'u kyçur.')
            navigate('/postal')
        } catch (error) {
            setError('Gabim gjatë regjistrimit: ' + error.message)
        }

        setLoading(false)
    }

    return (
        <div className="postal-login-page">
            <div className="postal-login-container">
                <motion.div
                    className="postal-login-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="postal-login-header">
                        <div className="postal-icon">📦</div>
                        <h1>Regjistrohu si Poster</h1>
                        <p>Krijo llogarinë tënde</p>
                    </div>

                    <form onSubmit={handleSubmit} className="postal-login-form">
                        <div className="form-group">
                            <label htmlFor="full_name">Emri i Plotë *</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Emri dhe Mbiemri"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Zgjedh një username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Zgjedh një password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Telefoni</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+383 44 123 456"
                            />
                        </div>

                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className="btn-postal-login"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
                        </motion.button>
                    </form>

                    <div className="postal-login-footer">
                        <button
                            className="btn-back-home"
                            onClick={() => navigate('/postal')}
                        >
                            ← Kthehu te Kyçja
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PostalRegister

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard')
        }
    }, [isAuthenticated, navigate])

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

        const result = await login(formData.email, formData.password)

        if (result.success) {
            navigate('/admin/dashboard')
        } else {
            setError(result.error || 'Email ose fjalëkalimi gabim')
        }

        setLoading(false)
    }

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <motion.div
                    className="login-card glass-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="login-header">
                        <img src="/images/logo.jpg" alt="Nike Logo" className="login-logo" />
                        <h1>Admin Panel</h1>
                        <p>Hyr në panelin e administratorit</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@nike.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Fjalëkalimi</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary btn-full btn-large"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Duke u kyçur...' : 'Hyr'}
                        </motion.button>
                    </form>

                    <div className="login-footer">
                        <button
                            className="btn btn-secondary btn-full"
                            onClick={() => navigate('/')}
                        >
                            Kthehu në Ballina
                        </button>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button
                                className="btn-link"
                                onClick={() => navigate('/postal')}
                                style={{ color: 'var(--nike-orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Je punonjës postar? Kyçu këtu
                            </button>
                        </div>
                    </div>

                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Email: admin@nike.com</p>
                        <p>Password: admin123</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Login

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePostalAuth } from '../../context/PostalAuthContext'
import './PostalLogin.css'

const PostalLogin = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated } = usePostalAuth()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/postal/dashboard')
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

        const result = await login(formData.username, formData.password)

        if (result.success) {
            navigate('/postal/dashboard')
        } else {
            setError(result.error || 'Username ose password i gabuar')
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
                        <h1>Posta - Kyçu</h1>
                        <p>Sistemi i Menaxhimit të Dorëzimeve</p>
                    </div>

                    <form onSubmit={handleSubmit} className="postal-login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Shkruaj username-in"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Shkruaj password-in"
                                required
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
                            {loading ? 'Duke u kyçur...' : 'Kyçu'}
                        </motion.button>
                    </form>

                    <div className="postal-login-footer">
                        <p className="register-link">
                            Nuk ke llogari?{' '}
                            <button
                                className="btn-link"
                                onClick={() => navigate('/postal/register')}
                            >
                                Regjistrohu këtu
                            </button>
                        </p>
                        <button
                            className="btn-back-home"
                            onClick={() => navigate('/')}
                        >
                            ← Kthehu në Faqen Kryesore
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PostalLogin

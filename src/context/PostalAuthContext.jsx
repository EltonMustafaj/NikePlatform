import { createContext, useContext, useState, useEffect } from 'react'
import { loginPostalWorker } from '../lib/api'

const PostalAuthContext = createContext()

export const usePostalAuth = () => {
    const context = useContext(PostalAuthContext)
    if (!context) {
        throw new Error('usePostalAuth must be used within PostalAuthProvider')
    }
    return context
}

export const PostalAuthProvider = ({ children }) => {
    const [postalWorker, setPostalWorker] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if postal worker is logged in
        const storedWorker = localStorage.getItem('postalWorker')
        if (storedWorker) {
            setPostalWorker(JSON.parse(storedWorker))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        try {
            const worker = await loginPostalWorker(username, password)
            if (worker) {
                if (worker.status === 'pending') {
                    return { success: false, error: 'Llogaria juaj është në pritje të aprovimit nga admini.' }
                }
                if (worker.status === 'inactive') {
                    return { success: false, error: 'Llogaria juaj është çaktivizuar.' }
                }

                setPostalWorker(worker)
                setIsAuthenticated(true)
                localStorage.setItem('postalWorker', JSON.stringify(worker))
                return { success: true }
            } else {
                return { success: false, error: 'Username ose password i gabuar' }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Gabim gjatë kyçjes' }
        }
    }

    const logout = () => {
        setPostalWorker(null)
        setIsAuthenticated(false)
        localStorage.removeItem('postalWorker')
    }

    const value = {
        postalWorker,
        isAuthenticated,
        loading,
        login,
        logout
    }

    return (
        <PostalAuthContext.Provider value={value}>
            {children}
        </PostalAuthContext.Provider>
    )
}

export default PostalAuthContext

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for existing session
        const savedAdmin = localStorage.getItem('nike-admin')
        if (savedAdmin) {
            setAdmin(JSON.parse(savedAdmin))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase
                .from('admins')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .maybeSingle()

            if (error) throw error

            if (data) {
                setAdmin(data)
                localStorage.setItem('nike-admin', JSON.stringify(data))
                return { success: true }
            } else {
                return { success: false, error: 'Email ose fjalëkalimi gabim' }
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        setAdmin(null)
        localStorage.removeItem('nike-admin')
    }

    const value = {
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

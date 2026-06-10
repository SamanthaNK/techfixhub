import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem('tfh_token'))
    const [isLoading, setIsLoading] = useState(true)

    const loadUser = useCallback(async () => {
        const storedToken = localStorage.getItem('tfh_token')
        if (!storedToken) {
            setIsLoading(false)
            return
        }
        try {
            const { data } = await getMe()
            setUser(data.user)
        } catch {
            localStorage.removeItem('tfh_token')
            localStorage.removeItem('tfh_user')
            setUser(null)
            setToken(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadUser()
    }, [loadUser])

    const login = (tokenValue, userData) => {
        localStorage.setItem('tfh_token', tokenValue)
        setToken(tokenValue)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('tfh_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
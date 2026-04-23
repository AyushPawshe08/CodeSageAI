import { createContext, useContext, useEffect, useState } from 'react'
import { logoutUser } from '../services/authApi'
const AuthContext = createContext()
const loadStoredUser = () => {
    const raw = localStorage.getItem('codesage-user')
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('codesage-token') || '')
    const [user, setUser] = useState(() => loadStoredUser())
    const isAuthenticated = Boolean(token)
    useEffect(() => {
        if (token) {
            localStorage.setItem('codesage-token', token)
        } else {
            localStorage.removeItem('codesage-token')
        }
    }, [token])
    useEffect(() => {
        if (user) {
            localStorage.setItem('codesage-user', JSON.stringify(user))
        } else {
            localStorage.removeItem('codesage-user')
        }
    }, [user])
    const login = (payload) => {
        setToken(payload.access_token)
        setUser(payload.user)
    }
    const logout = async () => {
        try {
            if (token) {
                await logoutUser()
            }
        } catch {
        } finally {
            setToken('')
            setUser(null)
        }
    }
    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext
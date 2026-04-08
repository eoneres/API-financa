import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('@Finance:token')
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            loadUser()
        } else {
            setLoading(false)
        }
    }, [])

    const loadUser = async () => {
        try {
            const response = await api.get('/auth/profile')
            setUser(response.data.data.user)
        } catch (error) {
            localStorage.removeItem('@Finance:token')
            delete api.defaults.headers.common['Authorization']
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        const { token, user } = response.data.data
        localStorage.setItem('@Finance:token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        toast.success('Login realizado com sucesso!')
        return true
    }

    const register = async (email, password, name) => {
        const response = await api.post('/auth/register', { email, password, name })
        const { token, user } = response.data.data
        localStorage.setItem('@Finance:token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        toast.success('Conta criada com sucesso!')
        return true
    }

    const logout = () => {
        localStorage.removeItem('@Finance:token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        toast.success('Logout realizado')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
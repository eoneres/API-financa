import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Preencha todos os campos')
            return
        }
        setLoading(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg mb-4">
                        <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">FinanceControl</h1>
                    <p className="text-gray-400 mt-2">Gerencie suas finanças com estilo</p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-modern"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-modern pr-10"
                                    placeholder="••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
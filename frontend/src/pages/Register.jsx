import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email || !password) {
            toast.error('Preencha todos os campos')
            return
        }
        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }
        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres')
            return
        }
        setLoading(true)
        try {
            await register(email, password, name)
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao criar conta')
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
                    <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
                    <p className="text-gray-400 mt-2">Comece a controlar suas finanças</p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-modern"
                                placeholder="Seu nome"
                                required
                            />
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-modern"
                                placeholder="••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
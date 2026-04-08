import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export default function Header() {
    const { user, logout } = useAuth()

    return (
        <header className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur-md border-b border-primary-800/30">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Bem-vindo,</p>
                        <p className="font-semibold text-white">{user?.name || user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-all text-gray-300 hover:text-white"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Sair</span>
                </button>
            </div>
        </header>
    )
}
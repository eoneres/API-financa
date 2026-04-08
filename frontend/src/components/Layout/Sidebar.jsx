import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, BarChart3, Wallet } from 'lucide-react'

const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transações' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
]

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-dark-800/95 backdrop-blur-md border-r border-primary-800/30 hidden lg:block">
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-primary-800/30">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-primary-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            FinanceControl
                        </span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/50'
                                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-primary-800/30">
                    <div className="text-xs text-center text-gray-500">
                        v1.0.0 • Painel Premium
                    </div>
                </div>
            </div>
        </aside>
    )
}
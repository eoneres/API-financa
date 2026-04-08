import React from 'react'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function StatsCards({ balance }) {
    const stats = [
        {
            title: 'Total em despesas do mês',
            value: formatCurrency(balance?.total_expense || 0),
            icon: TrendingDown,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
        },
        {
            title: 'Saldo do mês',
            value: formatCurrency(balance?.balance || 0),
            icon: Wallet,
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
            border: 'border-primary-500/20',
        },
        {
            title: 'Total de receitas',
            value: formatCurrency(balance?.total_income || 0),
            icon: TrendingUp,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`glass-card p-6 border ${stat.border} hover:border-opacity-100 transition-all duration-300 hover:scale-[1.02]`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
            ))}
        </div>
    )
}
import React from 'react'
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/formatters'

const categoryColors = {
    FOOD: 'bg-orange-500/20 text-orange-400',
    TRANSPORT: 'bg-blue-500/20 text-blue-400',
    LEISURE: 'bg-purple-500/20 text-purple-400',
    HEALTH: 'bg-green-500/20 text-green-400',
    EDUCATION: 'bg-yellow-500/20 text-yellow-400',
    BILLS: 'bg-red-500/20 text-red-400',
    OTHER: 'bg-gray-500/20 text-gray-400',
}

const categoryLabels = {
    FOOD: 'Alimentação',
    TRANSPORT: 'Transporte',
    LEISURE: 'Lazer',
    HEALTH: 'Saúde',
    EDUCATION: 'Educação',
    BILLS: 'Contas',
    OTHER: 'Outros',
}

export default function RecentTransactions({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="glass-card p-6 text-center">
                <div className="py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
                        <ArrowRight className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhuma transação encontrada</h3>
                    <p className="text-gray-400 mb-6">Comece a registrar suas despesas e receitas</p>
                    <Link to="/transactions" className="btn-primary inline-flex items-center gap-2">
                        Adicionar Transação
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                    Últimas Transações
                </h3>
                <Link to="/transactions" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                    Ver todas
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all duration-200 border border-transparent hover:border-primary-800/50"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`p-2 rounded-lg ${transaction.type === 'INCOME' ? 'bg-green-500/10' : 'bg-red-500/10'
                                    }`}
                            >
                                {transaction.type === 'INCOME' ? (
                                    <TrendingUp className={`h-5 w-5 text-green-400`} />
                                ) : (
                                    <TrendingDown className={`h-5 w-5 text-red-400`} />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-white">{transaction.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[transaction.category] || categoryColors.OTHER
                                            }`}
                                    >
                                        {categoryLabels[transaction.category] || transaction.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                                </div>
                            </div>
                        </div>
                        <p
                            className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                                }`}
                        >
                            {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
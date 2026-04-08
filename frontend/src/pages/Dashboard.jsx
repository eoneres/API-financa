import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import { reportService } from '../services/reportService'
import StatsCards from '../components/Dashboard/StatsCards'
import EvolutionChart from '../components/Dashboard/EvolutionChart'
import RecentTransactions from '../components/Dashboard/RecentTransactions'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Dashboard() {
    const { data: balance, isLoading: balanceLoading } = useQuery({
        queryKey: ['balance'],
        queryFn: () => transactionService.getBalance(),
    })

    const { data: expensesByCategory, isLoading: categoriesLoading } = useQuery({
        queryKey: ['expensesByCategory'],
        queryFn: () => reportService.getExpensesByCategory(),
    })

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => transactionService.getAll({ limit: 5 }),
    })

    if (balanceLoading || categoriesLoading || transactionsLoading) {
        return <LoadingSpinner />
    }

    const mockBalance = balance || { total_income: 5000, total_expense: 979.80, balance: 4020.20 }
    const mockCategories = expensesByCategory || { categories: [], total_expenses: 979.80 }
    const mockTransactions = transactions?.data || []

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Visão geral das suas finanças</p>
            </div>

            <StatsCards balance={mockBalance} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EvolutionChart />
                </div>
                <div className="lg:col-span-1">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                            Despesas por Categoria
                        </h3>
                        {mockCategories.categories?.length > 0 ? (
                            <div className="space-y-3">
                                {mockCategories.categories.slice(0, 5).map((cat) => (
                                    <div key={cat.category} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{cat.category}</span>
                                            <span className="text-primary-400">R$ {cat.total.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-dark-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Nenhuma despesa registrada</p>
                                <p className="text-sm mt-1">Adicione transações para ver análise</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RecentTransactions transactions={mockTransactions} />
        </div>
    )
}
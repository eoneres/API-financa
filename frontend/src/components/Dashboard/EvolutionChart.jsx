import React, { useEffect, useState } from 'react'
import { transactionService } from '../../services/transactionService'
import { formatCurrency, formatShortDate } from '../../utils/formatters'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

export default function EvolutionChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const last7Days = []
            for (let i = 6; i >= 0; i--) {
                const date = new Date()
                date.setDate(date.getDate() - i)
                last7Days.push(date.toISOString().split('T')[0])
            }

            const transactions = await transactionService.getAll({ limit: 100 })
            const transactionsList = transactions?.data || []

            const chartData = last7Days.map((day) => {
                const dayTransactions = transactionsList.filter((t) => t.date.split('T')[0] === day)
                const income = dayTransactions.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
                const expense = dayTransactions.filter((t) => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
                const balance = income - expense

                return {
                    date: formatShortDate(day),
                    fullDate: day,
                    receitas: income,
                    despesas: expense,
                    saldo: balance,
                }
            })

            setData(chartData)
        } catch (error) {
            console.error('Erro ao carregar evolução:', error)
            const mockData = []
            for (let i = 6; i >= 0; i--) {
                const date = new Date()
                date.setDate(date.getDate() - i)
                mockData.push({
                    date: formatShortDate(date),
                    receitas: 0,
                    despesas: 0,
                    saldo: 0,
                })
            }
            setData(mockData)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="glass-card p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-dark-700 rounded w-1/3"></div>
                    <div className="h-64 bg-dark-700 rounded"></div>
                </div>
            </div>
        )
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-800 border border-primary-800 rounded-lg p-3 shadow-xl">
                    <p className="text-sm font-semibold text-white mb-2">{label}</p>
                    <p className="text-xs text-green-400">Receitas: {formatCurrency(payload[0]?.value || 0)}</p>
                    <p className="text-xs text-red-400">Despesas: {formatCurrency(payload[1]?.value || 0)}</p>
                    <p className="text-xs text-primary-400 mt-1 pt-1 border-t border-primary-800">
                        Saldo: {formatCurrency(payload[2]?.value || 0)}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                Evolução dos Últimos 7 Dias
            </h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis tickFormatter={(value) => `R$ ${value}`} stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="saldo" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
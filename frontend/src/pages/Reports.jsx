import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'
import { formatCurrency } from '../utils/formatters'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import LoadingSpinner from '../components/Common/LoadingSpinner'

const COLORS = ['#a855f7', '#7e22ce', '#c084fc', '#d8b4fe', '#9333ea', '#6b21a5', '#581c87']

export default function Reports() {
    const { data: expensesData, isLoading: expensesLoading } = useQuery({
        queryKey: ['expensesByCategory'],
        queryFn: () => reportService.getExpensesByCategory(),
    })

    const { data: healthData, isLoading: healthLoading } = useQuery({
        queryKey: ['financialHealth'],
        queryFn: () => reportService.getFinancialHealth(),
    })

    if (expensesLoading || healthLoading) return <LoadingSpinner />

    const categories = expensesData?.categories || []
    const chartData = categories.map((cat) => ({
        name: cat.category,
        value: cat.total,
    }))

    const health = healthData || {}

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Relatórios</h1>
                <p className="text-gray-400 mt-1">Análise detalhada das suas finanças</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-500">Nenhuma despesa registrada</div>
                    )}
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Saúde Financeira</h3>
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-primary-400">{health.savings_rate || 0}%</div>
                            <p className="text-gray-400 mt-2">Taxa de economia média</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-center p-3 bg-dark-800 rounded-xl">
                                <p className="text-sm text-gray-400">Receita média mensal</p>
                                <p className="text-xl font-semibold text-green-400">{formatCurrency(health.average_monthly_income || 0)}</p>
                            </div>
                            <div className="text-center p-3 bg-dark-800 rounded-xl">
                                <p className="text-sm text-gray-400">Despesa média mensal</p>
                                <p className="text-xl font-semibold text-red-400">{formatCurrency(health.average_monthly_expense || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/Common/LoadingSpinner'

export default function Transactions() {
    const [showForm, setShowForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => transactionService.getAll(),
    })

    const deleteMutation = useMutation({
        mutationFn: transactionService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions'])
            queryClient.invalidateQueries(['balance'])
            toast.success('Transação removida')
        },
        onError: () => toast.error('Erro ao remover'),
    })

    if (isLoading) return <LoadingSpinner />

    const transactions = data?.data || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transações</h1>
                    <p className="text-gray-400 mt-1">Gerencie suas receitas e despesas</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Nova Transação
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-800/50 border-b border-primary-800/30">
                            <tr>
                                <th className="text-left p-4 text-gray-400 font-medium">Descrição</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Categoria</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Data</th>
                                <th className="text-right p-4 text-gray-400 font-medium">Valor</th>
                                <th className="text-center p-4 text-gray-400 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        Nenhuma transação encontrada
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-dark-700 hover:bg-dark-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${transaction.type === 'INCOME' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                    {transaction.type === 'INCOME' ? (
                                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                                    )}
                                                </div>
                                                <span className="text-white">{transaction.description}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-300">{transaction.category}</span>
                                        </td>
                                        <td className="p-4 text-gray-300">{formatDate(transaction.date)}</td>
                                        <td className={`p-4 text-right font-semibold ${transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingTransaction(transaction)
                                                        setShowForm(true)
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-primary-500/20 text-primary-400 transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir esta transação?')) {
                                                            deleteMutation.mutate(transaction.id)
                                                        }
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
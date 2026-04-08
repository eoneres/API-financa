import React from 'react' 
import { useState, useEffect, react } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, TRANSACTION_TYPES } from '../../utils/constants'
import { formatDateInput } from '../../utils/formatters'

export default function TransactionForm({ onSubmit, onClose, initialData, isLoading }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'EXPENSE',
        category: 'OTHER',
        date: formatDateInput(new Date())
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description,
                amount: initialData.amount.toString(),
                type: initialData.type,
                category: initialData.category,
                date: formatDateInput(initialData.date)
            })
        }
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-100 rounded-xl border border-primary-800/30 w-full max-w-md p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        {initialData ? 'Editar Transação' : 'Nova Transação'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-dark-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            placeholder="Ex: Supermercado, Salário..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Valor
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="input"
                            placeholder="0,00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tipo
                        </label>
                        <div className="flex gap-2">
                            {TRANSACTION_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                    className={`flex-1 py-2 rounded-lg transition-all ${formData.type === type.value
                                        ? type.value === 'INCOME'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-red-600 text-white'
                                        : 'bg-dark-200 text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Categoria
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.icon} {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Data
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 btn-primary disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Criar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
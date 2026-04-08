import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import toast from 'react-hot-toast'

export function useTransactions(filters = {}) {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => transactionService.getTransactions(filters),
        keepPreviousData: true
    })

    const createMutation = useMutation({
        mutationFn: transactionService.createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions'])
            queryClient.invalidateQueries(['balance'])
            toast.success('Transação criada com sucesso!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao criar transação')
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => transactionService.updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions'])
            queryClient.invalidateQueries(['balance'])
            toast.success('Transação atualizada com sucesso!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao atualizar transação')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: transactionService.deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions'])
            queryClient.invalidateQueries(['balance'])
            toast.success('Transação deletada com sucesso!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao deletar transação')
        }
    })

    return {
        transactions: data?.data?.data || [],
        pagination: data?.data?.pagination,
        isLoading,
        error,
        createTransaction: createMutation.mutate,
        updateTransaction: updateMutation.mutate,
        deleteTransaction: deleteMutation.mutate,
        isCreating: createMutation.isLoading,
        isUpdating: updateMutation.isLoading,
        isDeleting: deleteMutation.isLoading
    }
}

export function useBalance(filters = {}) {
    return useQuery({
        queryKey: ['balance', filters],
        queryFn: () => transactionService.getBalance(filters)
    })
}
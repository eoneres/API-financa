import { AlertCircle } from 'lucide-react'
import React from 'react'

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-400 mb-4">{message || 'Ocorreu um erro inesperado'}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-primary">
                    Tentar novamente
                </button>
            )}
        </div>
    )
}
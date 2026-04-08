import { AlertTriangle, X } from 'lucide-react'
import React from 'react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-100 rounded-xl border border-primary-800/30 w-full max-w-md p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100">{title || 'Confirmar ação'}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-dark-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <p className="text-gray-300 mb-6">{message || 'Tem certeza que deseja realizar esta ação?'}</p>

                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="btn-secondary">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="btn-danger">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}
import React from 'react'

export default function Loading() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
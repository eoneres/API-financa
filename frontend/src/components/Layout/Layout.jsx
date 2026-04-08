import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <div className="min-h-screen bg-dark-900">
            <Sidebar />
            <div className="lg:pl-64">
                <Header />
                <main className="p-6 lg:p-8 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { signOut, user } = useAuth()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { label: 'Dashboard', path: '/', icon: '📊' },
        { label: 'Tasks', path: '/tasks', icon: '✅' },
        { label: 'Learning', path: '/learning', icon: '🧠' },
        { label: 'Brain Dump', path: '/brain-dump', icon: '💭' },
    ]

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[--bg-gradient-start] to-[--bg-gradient-end]">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col glass-panel m-4 mr-0 border-r-0 rounded-r-none">
                <div className="p-6 flex-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--color-primary] to-[--color-secondary] flex-center text-white font-bold">
                        H
                    </div>
                    <span className="font-bold text-lg text-gradient">HackX</span>
                </div>

                <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-[--glass-bg-hover] border border-[--glass-border-strong] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                    : 'hover:bg-[--glass-bg-subtle] border border-transparent'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className={`font-medium ${isActive ? 'text-[--color-primary]' : 'text-[--color-text-muted]'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-[--glass-border-subtle]">
                    <div className="glass-card p-4 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[--glass-bg-intense] flex-center text-[--color-primary]">
                            👤
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.email || 'User'}</p>
                            <p className="text-xs text-[--color-success]">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="glass-button w-full justify-center text-[--color-danger] border-[--color-danger]/30 hover:bg-[--color-danger]/10 hover:border-[--color-danger]"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-panel m-2 p-4 flex-between">
                <span className="font-bold text-lg text-gradient">HackX</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="glass-button p-2"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8 relative">
                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-20 px-4">
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="glass-card p-4 flex items-center gap-4 text-xl"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={() => signOut()}
                                className="glass-button mt-8 w-full justify-center text-[--color-danger]"
                            >
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}

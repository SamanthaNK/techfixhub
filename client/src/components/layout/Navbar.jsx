import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Wrench, BookOpen, Settings, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navLinks = [
        { to: '/services', label: 'Services' },
        { to: '/training', label: 'Training' },
        { to: '/maintenance', label: 'Maintenance' },
        { to: '/track', label: 'Track Repair' },
        { to: '/contact', label: 'Contact' },
    ]

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur border-b border-primary/20" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center group-hover:bg-accent transition-colors">
                            <Wrench size={16} className="text-white" />
                        </div>
                        <span className="font-display font-bold text-lg text-text-primary">
                            TechFix<span className="text-accent">Hub</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `px-4 py-2 text-sm font-body transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2 border border-primary/30 hover:border-accent text-text-primary text-sm font-display font-medium transition-colors"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="true"
                                >
                                    <User size={14} />
                                    {user?.firstName}
                                    <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-52 bg-bg-secondary border border-primary/30 shadow-xl animate-fade-in">
                                        <div className="px-4 py-3 border-b border-primary/20">
                                            <p className="text-xs text-text-muted">Signed in as</p>
                                            <p className="text-sm font-display font-medium text-text-primary truncate">{user?.email}</p>
                                        </div>
                                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-muted hover:text-accent hover:bg-primary/10 transition-colors">
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/admin/repairs" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-muted hover:text-accent hover:bg-primary/10 transition-colors">
                                                <Settings size={14} /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-primary/20">
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-display text-text-muted hover:text-text-primary transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="px-5 py-2 bg-primary hover:bg-accent text-white hover:text-bg text-sm font-display font-semibold transition-all">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden text-text-muted hover:text-accent transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-bg-secondary border-t border-primary/20 animate-fade-in">
                    <div className="px-4 py-3 flex flex-col gap-1">
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `px-3 py-2.5 text-sm font-body ${isActive ? 'text-accent bg-primary/10' : 'text-text-muted'}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                        <div className="border-t border-primary/20 pt-3 mt-2 flex flex-col gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-muted">
                                        <LayoutDashboard size={14} /> Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 text-left">
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm text-text-muted">Sign In</Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 bg-primary text-white text-sm font-display font-semibold text-center">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
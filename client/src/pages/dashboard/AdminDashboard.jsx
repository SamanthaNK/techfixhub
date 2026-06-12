import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wrench, GraduationCap, Mail, Calendar, Package, ArrowRight } from 'lucide-react'
import { getDashboard } from '../../api/admin'
import Spinner from '../../components/ui/Spinner'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboard()
            .then(({ data }) => setStats(data.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const cards = stats ? [
        { icon: Users, label: 'Total Customers', value: stats.totalUsers, to: '/admin/users', color: 'text-blue-400' },
        { icon: Wrench, label: 'Total Repairs', value: stats.totalRepairs, to: '/admin/repairs', color: 'text-accent' },
        { icon: Wrench, label: 'Pending Repairs', value: stats.pendingRepairs, to: '/admin/repairs', color: 'text-yellow-400' },
        { icon: GraduationCap, label: 'Active Programs', value: stats.totalPrograms, to: '/admin/training', color: 'text-purple-400' },
        { icon: GraduationCap, label: 'Enrollments', value: stats.totalEnrollments, to: '/admin/training', color: 'text-accent' },
        { icon: Mail, label: 'Unread Messages', value: stats.unreadMessages, to: '/admin/messages', color: 'text-red-400' },
        { icon: Calendar, label: 'Pending Appointments', value: stats.pendingAppointments, to: '/admin/appointments', color: 'text-orange-400' },
    ] : []

    const adminLinks = [
        { icon: Wrench, label: 'Manage Repairs', sub: 'View and update all repair requests', to: '/admin/repairs' },
        { icon: Users, label: 'Manage Users', sub: 'View, activate, or deactivate users', to: '/admin/users' },
        { icon: GraduationCap, label: 'Manage Training', sub: 'Create and update training programs', to: '/admin/training' },
        { icon: Package, label: 'Inventory', sub: 'Track spare parts and stock levels', to: '/admin/inventory' },
        { icon: Calendar, label: 'Appointments', sub: 'Confirm and manage appointments', to: '/admin/appointments' },
    ]

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-10">
                <h1 className="font-display font-black text-4xl text-text-primary">Admin Dashboard</h1>
                <p className="text-text-muted mt-2">Overview of TechFix Hub operations.</p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                    {cards.map(({ icon: Icon, label, value, to, color }) => (
                        <Link key={label} to={to} className="bg-bg-card border border-primary/20 hover:border-primary/50 p-5 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <Icon size={18} className={color} />
                                <ArrowRight size={12} className="text-text-muted group-hover:text-accent transition-colors" />
                            </div>
                            <p className="font-display font-black text-3xl text-text-primary">{value}</p>
                            <p className="text-text-muted text-xs mt-1">{label}</p>
                        </Link>
                    ))}
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminLinks.map(({ icon: Icon, label, sub, to }) => (
                    <Link key={to} to={to} className="bg-bg-card border border-primary/20 hover:border-primary/60 p-6 flex items-start gap-4 group transition-all">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon size={18} className="text-accent" />
                        </div>
                        <div>
                            <p className="font-display font-bold text-text-primary">{label}</p>
                            <p className="text-text-muted text-xs mt-1">{sub}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, GraduationCap, Calendar, ArrowRight, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getMyRepairs } from '../../api/repairs'
import { getMyEnrollments } from '../../api/training'
import { getMyAppointments } from '../../api/appointments'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { formatDate, capitalize } from '../../utils/helpers'

export default function CustomerDashboard() {
    const { user } = useAuth()
    const [repairs, setRepairs] = useState([])
    const [enrollments, setEnrollments] = useState([])
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [r, e, a] = await Promise.all([getMyRepairs(), getMyEnrollments(), getMyAppointments()])
                setRepairs(r.data.data?.slice(0, 3) || [])
                setEnrollments(e.data.data?.slice(0, 3) || [])
                setAppointments(a.data.data?.slice(0, 3) || [])
            } catch { }
            finally { setLoading(false) }
        }
        load()
    }, [])

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-10">
                <h1 className="font-display font-black text-4xl text-text-primary">
                    Welcome back, <span className="text-accent">{user?.firstName}</span>
                </h1>
                <p className="text-text-muted mt-2">Here is an overview of your activity with TechFix Hub.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {[
                    { icon: Wrench, label: 'Submit Repair', sub: 'Start a new repair request', to: '/dashboard/repairs/submit', color: 'text-accent' },
                    { icon: GraduationCap, label: 'Browse Training', sub: 'Enroll in a program', to: '/training', color: 'text-accent' },
                    { icon: Calendar, label: 'Book Appointment', sub: 'Schedule a service', to: '/dashboard/appointments/book', color: 'text-accent' },
                ].map(({ icon: Icon, label, sub, to, color }) => (
                    <Link key={to} to={to} className="bg-bg-card border border-primary/20 hover:border-primary/60 p-5 flex items-center gap-4 group transition-all">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon size={18} className={color} />
                        </div>
                        <div>
                            <p className="font-display font-semibold text-text-primary text-sm">{label}</p>
                            <p className="text-text-muted text-xs">{sub}</p>
                        </div>
                        <ArrowRight size={14} className="ml-auto text-text-muted group-hover:text-accent transition-colors" />
                    </Link>
                ))}
            </div>

            <Section title="Recent Repairs" linkTo="/dashboard/repairs" linkLabel="All Repairs" addTo="/dashboard/repairs/submit">
                {repairs.length === 0 ? (
                    <Empty message="No repair requests yet." />
                ) : (
                    repairs.map(r => (
                        <div key={r._id} className="flex items-center justify-between py-3 border-b border-primary/10 last:border-0">
                            <div>
                                <p className="font-display font-medium text-text-primary text-sm">{capitalize(r.deviceCategory)} — {r.deviceBrand}</p>
                                <p className="text-text-muted text-xs mt-0.5 font-display tracking-wide">{r.trackingId}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-text-muted text-xs">{formatDate(r.createdAt)}</span>
                                <Badge status={r.status} />
                            </div>
                        </div>
                    ))
                )}
            </Section>

            <Section title="My Enrollments" linkTo="/dashboard/enrollments" linkLabel="All Enrollments">
                {enrollments.length === 0 ? (
                    <Empty message="Not enrolled in any programs yet." />
                ) : (
                    enrollments.map(e => (
                        <div key={e._id} className="flex items-center justify-between py-3 border-b border-primary/10 last:border-0">
                            <div>
                                <p className="font-display font-medium text-text-primary text-sm">{e.program?.title || 'Program'}</p>
                                <p className="text-text-muted text-xs mt-0.5">{capitalize(e.program?.category || '')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge status={e.status} />
                                <Badge status={e.paymentStatus} />
                            </div>
                        </div>
                    ))
                )}
            </Section>

            <Section title="Upcoming Appointments" linkTo="/dashboard/appointments" linkLabel="All Appointments" addTo="/dashboard/appointments/book">
                {appointments.length === 0 ? (
                    <Empty message="No appointments scheduled." />
                ) : (
                    appointments.map(a => (
                        <div key={a._id} className="flex items-center justify-between py-3 border-b border-primary/10 last:border-0">
                            <div>
                                <p className="font-display font-medium text-text-primary text-sm">{capitalize(a.serviceType)}</p>
                                <p className="text-text-muted text-xs mt-0.5">{formatDate(a.scheduledDate)} at {a.scheduledTime}</p>
                            </div>
                            <Badge status={a.status} />
                        </div>
                    ))
                )}
            </Section>
        </div>
    )
}

function Section({ title, children, linkTo, linkLabel, addTo }) {
    return (
        <div className="bg-bg-card border border-primary/20 p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-text-primary">{title}</h2>
                <div className="flex items-center gap-3">
                    {addTo && (
                        <Link to={addTo} className="w-7 h-7 bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Add new">
                            <Plus size={14} className="text-accent" />
                        </Link>
                    )}
                    {linkTo && <Link to={linkTo} className="text-xs text-accent hover:underline font-display">{linkLabel}</Link>}
                </div>
            </div>
            {children}
        </div>
    )
}

function Empty({ message }) {
    return <p className="text-text-muted text-sm py-4 text-center">{message}</p>
}
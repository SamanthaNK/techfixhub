import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Plus } from 'lucide-react'
import { getMyAppointments } from '../../api/appointments'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, capitalize } from '../../utils/helpers'

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyAppointments()
            .then(({ data }) => setAppointments(data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">My Appointments</h1>
                    <p className="text-text-muted text-sm mt-1">All your scheduled service appointments.</p>
                </div>
                <Link to="/dashboard/appointments/book" className="bg-primary hover:bg-accent text-white hover:text-bg px-5 py-2.5 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all">
                    <Plus size={14} /> Book Appointment
                </Link>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : appointments.length === 0 ? (
                    <EmptyState icon={Calendar} title="No appointments yet" description="Book a service appointment to get started."
                        action={<Link to="/dashboard/appointments/book" className="bg-primary hover:bg-accent text-white hover:text-bg px-6 py-3 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all"><Plus size={14} /> Book Appointment</Link>}
                    />
                ) : (
                    <div className="space-y-3">
                        {appointments.map(a => (
                            <div key={a._id} className="bg-bg-card border border-primary/20 p-5 grid sm:grid-cols-3 gap-4 items-center">
                                <div className="sm:col-span-2">
                                    <p className="font-display font-bold text-text-primary">{capitalize(a.serviceType)}</p>
                                    <p className="text-text-muted text-sm mt-1">{a.description}</p>
                                    <p className="text-text-muted text-xs mt-1.5">{formatDate(a.scheduledDate)} at {a.scheduledTime} &bull; {capitalize(a.location)}</p>
                                    {a.assignedTechnician && <p className="text-text-muted text-xs mt-1">Technician: {a.assignedTechnician.firstName} {a.assignedTechnician.lastName}</p>}
                                </div>
                                <div className="sm:text-right">
                                    <Badge status={a.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}
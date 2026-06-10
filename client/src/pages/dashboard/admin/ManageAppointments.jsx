import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { getAllAppointments, updateAppointmentStatus } from '../../../api/appointments'
import Badge from '../../../components/ui/Badge'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Input'
import { formatDate, capitalize } from '../../../utils/helpers'
import toast from 'react-hot-toast'

const APPT_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)

    const load = () => {
        setLoading(true)
        getAllAppointments().then(({ data }) => setAppointments(data.data || [])).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleUpdate = async () => {
        setUpdating(true)
        try {
            await updateAppointmentStatus(selected._id, { status: newStatus })
            toast.success('Appointment updated')
            setSelected(null)
            load()
        } catch { toast.error('Update failed') }
        finally { setUpdating(false) }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display font-black text-3xl text-text-primary">Manage Appointments</h1>
                <p className="text-text-muted text-sm mt-1">{appointments.length} total appointments</p>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : appointments.length === 0 ? <EmptyState icon={Calendar} title="No appointments yet" />
                    : (
                        <div className="space-y-2">
                            {appointments.map(a => (
                                <div key={a._id} className="bg-bg-card border border-primary/20 p-4 grid sm:grid-cols-4 gap-4 items-center">
                                    <div className="sm:col-span-2">
                                        <p className="font-display font-bold text-text-primary text-sm">{capitalize(a.serviceType)}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{a.client?.firstName} {a.client?.lastName} &bull; {a.client?.phone}</p>
                                        <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{a.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-xs">{formatDate(a.scheduledDate)} at {a.scheduledTime}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{capitalize(a.location)}</p>
                                        <Badge status={a.status} />
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => { setSelected(a); setNewStatus(a.status) }} className="text-xs border border-primary/30 text-text-muted hover:border-accent hover:text-accent px-3 py-1.5 font-display transition-colors">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Update Appointment">
                {selected && (
                    <div className="space-y-4">
                        <div className="bg-bg-secondary p-4 text-sm space-y-1">
                            <p className="text-text-muted">Client: <span className="text-text-primary">{selected.client?.firstName} {selected.client?.lastName}</span></p>
                            <p className="text-text-muted">Service: <span className="text-text-primary">{capitalize(selected.serviceType)}</span></p>
                            <p className="text-text-muted">Date: <span className="text-text-primary">{formatDate(selected.scheduledDate)} at {selected.scheduledTime}</span></p>
                        </div>
                        <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                            {APPT_STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                        </Select>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
                            <Button loading={updating} onClick={handleUpdate}>Update</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
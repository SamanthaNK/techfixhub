import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { bookAppointment } from '../../api/appointments'
import Button from '../../components/ui/Button'
import Input, { Select, Textarea } from '../../components/ui/Input'
import { SERVICE_TYPES } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function BookAppointment() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ serviceType: '', description: '', scheduledDate: '', scheduledTime: '', location: 'drop_off' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.serviceType) e.serviceType = 'Please select a service type'
        if (!form.description.trim()) e.description = 'Description is required'
        if (!form.scheduledDate) e.scheduledDate = 'Please select a date'
        if (!form.scheduledTime) e.scheduledTime = 'Please select a time'
        return e
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await bookAppointment(form)
            toast.success('Appointment booked! We will confirm shortly.')
            navigate('/dashboard/appointments')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed')
        } finally {
            setLoading(false)
        }
    }

    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            <button onClick={() => navigate('/dashboard/appointments')} className="flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-8 transition-colors">
                <ArrowLeft size={14} /> Back to Appointments
            </button>
            <div className="mb-8">
                <h1 className="font-display font-black text-3xl text-text-primary">Book an Appointment</h1>
                <p className="text-text-muted text-sm mt-2">Schedule a service appointment with our team.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="bg-bg-card border border-primary/20 p-8 space-y-5">
                <Select id="serviceType" label="Service Type" value={form.serviceType} onChange={f('serviceType')} error={errors.serviceType}>
                    <option value="">Select service...</option>
                    {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
                <Textarea id="description" label="Description" value={form.description} onChange={f('description')} error={errors.description} placeholder="Describe what you need..." rows={4} required />
                <div className="grid sm:grid-cols-2 gap-5">
                    <Input id="scheduledDate" label="Preferred Date" type="date" value={form.scheduledDate} onChange={f('scheduledDate')} error={errors.scheduledDate} required />
                    <Input id="scheduledTime" label="Preferred Time" type="time" value={form.scheduledTime} onChange={f('scheduledTime')} error={errors.scheduledTime} required />
                </div>
                <Select id="location" label="Service Location" value={form.location} onChange={f('location')}>
                    <option value="drop_off">Drop Off (at our location)</option>
                    <option value="on_site">On-Site (at your location)</option>
                </Select>
                <Button type="submit" loading={loading} size="lg" className="w-full">Book Appointment</Button>
            </form>
        </div>
    )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { submitRepair } from '../../api/repairs'
import Button from '../../components/ui/Button'
import Input, { Select, Textarea } from '../../components/ui/Input'
import { DEVICE_CATEGORIES } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function SubmitRepair() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ deviceCategory: '', deviceBrand: '', deviceModel: '', issueDescription: '', priority: 'normal' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.deviceCategory) e.deviceCategory = 'Please select a device category'
        if (!form.deviceBrand.trim()) e.deviceBrand = 'Device brand is required'
        if (form.issueDescription.trim().length < 10) e.issueDescription = 'Please describe the issue (min 10 characters)'
        return e
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            const { data } = await submitRepair(form)
            toast.success(`Repair submitted! Tracking ID: ${data.data.trackingId}`)
            navigate('/dashboard/repairs')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed')
        } finally {
            setLoading(false)
        }
    }

    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            <button onClick={() => navigate('/dashboard/repairs')} className="flex items-center gap-2 text-text-muted hover:text-accent text-sm mb-8 transition-colors">
                <ArrowLeft size={14} /> Back to Repairs
            </button>
            <div className="mb-8">
                <h1 className="font-display font-black text-3xl text-text-primary">Submit Repair Request</h1>
                <p className="text-text-muted text-sm mt-2">Fill in your device details and describe the issue. We will get back to you with a diagnosis and quote.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="bg-bg-card border border-primary/20 p-8 space-y-5">
                <Select id="deviceCategory" label="Device Category" value={form.deviceCategory} onChange={f('deviceCategory')} error={errors.deviceCategory}>
                    <option value="">Select category...</option>
                    {DEVICE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Select>
                <div className="grid sm:grid-cols-2 gap-5">
                    <Input id="deviceBrand" label="Device Brand" value={form.deviceBrand} onChange={f('deviceBrand')} error={errors.deviceBrand} placeholder="e.g. Samsung, HP, Dell" required />
                    <Input id="deviceModel" label="Model (optional)" value={form.deviceModel} onChange={f('deviceModel')} placeholder="e.g. Galaxy A54, Pavilion 15" />
                </div>
                <Textarea id="issueDescription" label="Describe the Issue" value={form.issueDescription} onChange={f('issueDescription')} error={errors.issueDescription} placeholder="Explain what is wrong with your device in as much detail as possible..." rows={5} required />
                <Select id="priority" label="Priority" value={form.priority} onChange={f('priority')}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </Select>
                <Button type="submit" loading={loading} size="lg" className="w-full">Submit Request</Button>
            </form>
        </div>
    )
}
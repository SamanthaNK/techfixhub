import { useEffect, useState } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import { getPrograms, createProgram, updateProgram } from '../../../api/training'
import Badge from '../../../components/ui/Badge'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input, { Select, Textarea } from '../../../components/ui/Input'
import { formatCurrency, capitalize } from '../../../utils/helpers'
import toast from 'react-hot-toast'

const emptyForm = { title: '', description: '', category: 'phone_repair', level: 'beginner', durationWeeks: '', priceFCFA: '', maxEnrollment: '', schedule: '' }

export default function ManageTraining() {
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)

    const load = () => {
        setLoading(true)
        getPrograms({}).then(({ data }) => setPrograms(data.data || [])).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
    const openEdit = (p) => {
        setEditing(p)
        setForm({ title: p.title, description: p.description, category: p.category, level: p.level, durationWeeks: p.durationWeeks, priceFCFA: p.priceFCFA, maxEnrollment: p.maxEnrollment, schedule: p.schedule || '' })
        setModalOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (editing) { await updateProgram(editing._id, form); toast.success('Program updated') }
            else { await createProgram(form); toast.success('Program created') }
            setModalOpen(false)
            load()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed')
        } finally { setSaving(false) }
    }

    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">Manage Training</h1>
                    <p className="text-text-muted text-sm mt-1">{programs.length} program(s) listed</p>
                </div>
                <Button onClick={openCreate} size="sm" className="flex items-center gap-2"><Plus size={14} /> Add Program</Button>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : programs.length === 0 ? <EmptyState icon={GraduationCap} title="No programs yet" action={<Button onClick={openCreate} size="sm"><Plus size={14} /> Add Program</Button>} />
                    : (
                        <div className="space-y-3">
                            {programs.map(p => (
                                <div key={p._id} className="bg-bg-card border border-primary/20 p-5 flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge status={p.level} />
                                            <span className="text-xs text-text-muted">{capitalize(p.category)}</span>
                                        </div>
                                        <p className="font-display font-bold text-text-primary">{p.title}</p>
                                        <p className="text-text-muted text-xs mt-1">{p.durationWeeks}w &bull; {formatCurrency(p.priceFCFA)} &bull; {p.currentEnrollment}/{p.maxEnrollment} enrolled</p>
                                    </div>
                                    <button onClick={() => openEdit(p)} className="text-xs border border-primary/30 text-text-muted hover:border-accent hover:text-accent px-4 py-2 font-display transition-colors">Edit</button>
                                </div>
                            ))}
                        </div>
                    )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Program' : 'Create Program'} size="lg">
                <div className="space-y-4">
                    <Input label="Title" value={form.title} onChange={f('title')} placeholder="Program title" required />
                    <Textarea label="Description" value={form.description} onChange={f('description')} rows={3} placeholder="Describe the program..." />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Select label="Category" value={form.category} onChange={f('category')}>
                            {['phone_repair', 'laptop_repair', 'electrical', 'networking', 'solar', 'medical_equipment', 'entrepreneurship'].map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
                        </Select>
                        <Select label="Level" value={form.level} onChange={f('level')}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </Select>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Input label="Duration (weeks)" type="number" value={form.durationWeeks} onChange={f('durationWeeks')} min="1" />
                        <Input label="Price (FCFA)" type="number" value={form.priceFCFA} onChange={f('priceFCFA')} min="0" />
                        <Input label="Max Enrollment" type="number" value={form.maxEnrollment} onChange={f('maxEnrollment')} min="1" />
                    </div>
                    <Input label="Schedule" value={form.schedule} onChange={f('schedule')} placeholder="e.g. Weekdays 9am-12pm" />
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button loading={saving} onClick={handleSave}>{editing ? 'Save Changes' : 'Create Program'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
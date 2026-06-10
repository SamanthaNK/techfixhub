import { useEffect, useState } from 'react'
import { getAllRepairs, updateRepairStatus } from '../../../api/repairs'
import Badge from '../../../components/ui/Badge'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Input'
import { Wrench, Filter } from 'lucide-react'
import { formatDate, formatCurrency, capitalize, REPAIR_STATUSES } from '../../../utils/helpers'
import toast from 'react-hot-toast'

export default function ManageRepairs() {
    const [repairs, setRepairs] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [selected, setSelected] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const params = { page, limit: 15 }
            if (statusFilter) params.status = statusFilter
            const { data } = await getAllRepairs(params)
            setRepairs(data.data || [])
            setTotal(data.total || 0)
        } catch { setRepairs([]) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [page, statusFilter])

    const handleUpdate = async () => {
        if (!newStatus) return
        setUpdating(true)
        try {
            await updateRepairStatus(selected._id, { status: newStatus })
            toast.success('Status updated')
            setSelected(null)
            load()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">Manage Repairs</h1>
                    <p className="text-text-muted text-sm mt-1">{total} total repair requests</p>
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={14} className="text-text-muted" />
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                        className="bg-bg-secondary border border-primary/30 text-text-primary px-4 py-2 text-sm focus:outline-none focus:border-accent" aria-label="Filter by status">
                        <option value="">All Statuses</option>
                        {REPAIR_STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                    </select>
                </div>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : repairs.length === 0 ? <EmptyState icon={Wrench} title="No repairs found" />
                    : (
                        <div className="space-y-2">
                            {repairs.map(r => (
                                <div key={r._id} className="bg-bg-card border border-primary/20 p-4 grid sm:grid-cols-5 gap-4 items-center">
                                    <div className="sm:col-span-2">
                                        <p className="font-display font-bold text-accent text-xs tracking-wider mb-1">{r.trackingId}</p>
                                        <p className="font-display font-semibold text-text-primary text-sm">{capitalize(r.deviceCategory)} — {r.deviceBrand}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{r.customer?.firstName} {r.customer?.lastName} &bull; {r.customer?.phone}</p>
                                    </div>
                                    <div>
                                        <Badge status={r.status} />
                                        <p className="text-text-muted text-xs mt-1">{formatDate(r.createdAt)}</p>
                                    </div>
                                    <div>
                                        {r.estimatedCost && <p className="text-text-muted text-xs">Est: <span className="text-accent">{formatCurrency(r.estimatedCost)}</span></p>}
                                        {r.finalCost && <p className="text-text-muted text-xs">Final: <span className="text-accent">{formatCurrency(r.finalCost)}</span></p>}
                                        <p className="text-text-muted text-xs mt-1">{r.priority} priority</p>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => { setSelected(r); setNewStatus(r.status) }}
                                            className="text-xs border border-primary/30 text-text-muted hover:border-accent hover:text-accent px-3 py-1.5 font-display transition-colors">
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            {total > 15 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-primary/30 text-text-muted hover:border-primary text-sm font-display disabled:opacity-40 transition-colors">
                        Previous
                    </button>
                    <span className="text-text-muted text-sm">Page {page} of {Math.ceil(total / 15)}</span>
                    <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-primary/30 text-text-muted hover:border-primary text-sm font-display disabled:opacity-40 transition-colors">
                        Next
                    </button>
                </div>
            )}

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Update Repair Status">
                {selected && (
                    <div className="space-y-4">
                        <div className="bg-bg-secondary p-4 text-sm">
                            <p className="text-text-muted">Tracking ID: <span className="text-accent font-display font-bold">{selected.trackingId}</span></p>
                            <p className="text-text-muted mt-1">Device: {capitalize(selected.deviceCategory)} — {selected.deviceBrand}</p>
                            <p className="text-text-muted mt-1">Current: <Badge status={selected.status} /></p>
                        </div>
                        <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                            {REPAIR_STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
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
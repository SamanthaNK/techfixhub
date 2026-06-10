import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Wrench } from 'lucide-react'
import { getMyRepairs } from '../../api/repairs'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatCurrency, capitalize } from '../../utils/helpers'

export default function MyRepairs() {
    const [repairs, setRepairs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyRepairs()
            .then(({ data }) => setRepairs(data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">My Repairs</h1>
                    <p className="text-text-muted text-sm mt-1">Track all your repair requests.</p>
                </div>
                <Link to="/dashboard/repairs/submit" className="bg-primary hover:bg-accent text-white hover:text-bg px-5 py-2.5 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all">
                    <Plus size={14} /> New Request
                </Link>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : repairs.length === 0 ? (
                    <EmptyState icon={Wrench} title="No repair requests yet" description="Submit your first repair request to get started."
                        action={<Link to="/dashboard/repairs/submit" className="bg-primary hover:bg-accent text-white hover:text-bg px-6 py-3 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all"><Plus size={14} /> Submit Repair</Link>}
                    />
                ) : (
                    <div className="space-y-3">
                        {repairs.map(r => (
                            <div key={r._id} className="bg-bg-card border border-primary/20 p-5 grid sm:grid-cols-4 gap-4 items-center">
                                <div className="sm:col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-display font-bold text-accent text-sm tracking-wider">{r.trackingId}</span>
                                    </div>
                                    <p className="font-display font-semibold text-text-primary">{capitalize(r.deviceCategory)} — {r.deviceBrand} {r.deviceModel || ''}</p>
                                    <p className="text-text-muted text-xs mt-1 line-clamp-1">{r.issueDescription}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Badge status={r.status} />
                                    <span className="text-text-muted text-xs">{formatDate(r.createdAt)}</span>
                                </div>
                                <div className="text-right">
                                    {r.estimatedCost && <p className="text-accent font-display font-bold text-sm">{formatCurrency(r.estimatedCost)}</p>}
                                    {r.finalCost && <p className="text-text-muted text-xs">Final: {formatCurrency(r.finalCost)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}
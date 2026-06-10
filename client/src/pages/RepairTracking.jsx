import { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import { trackRepair } from '../api/repairs'
import { formatCurrency, formatDateTime, capitalize } from '../utils/helpers'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function RepairTracking() {
    const [trackingId, setTrackingId] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleTrack = async (e) => {
        e.preventDefault()
        if (!trackingId.trim()) return
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const { data } = await trackRepair(trackingId.trim())
            setResult(data.data)
        } catch (err) {
            setError(err.response?.data?.message || 'No repair found with that tracking ID.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="animate-fade-in py-16">
            <section className="bg-bg-secondary border-b border-primary/20 py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="w-8 h-px bg-accent" />
                        <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Track Your Repair</span>
                        <span className="w-8 h-px bg-accent" />
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary mb-4">Repair Status</h1>
                    <p className="text-text-muted text-lg">
                        Enter your Tracking ID (format: TFH-XXXXXXXX) to get real-time updates on your repair.
                    </p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                <form onSubmit={handleTrack} className="flex gap-3 mb-8" role="search">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            value={trackingId}
                            onChange={e => setTrackingId(e.target.value.toUpperCase())}
                            placeholder="TFH-XXXXXXXX"
                            className="w-full bg-bg-secondary border border-primary/30 text-text-primary placeholder-text-muted pl-10 pr-4 py-4 focus:outline-none focus:border-accent transition-colors font-display tracking-wider text-lg"
                            aria-label="Enter tracking ID"
                            maxLength={20}
                        />
                    </div>
                    <Button type="submit" loading={loading} size="lg">
                        Track
                    </Button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 text-sm mb-6">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-5 animate-slide-up">
                        <div className="bg-bg-card border border-primary/30 p-6">
                            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                                <div>
                                    <p className="text-text-muted text-xs font-display mb-1">TRACKING ID</p>
                                    <p className="font-display font-bold text-accent text-2xl tracking-widest">{result.trackingId}</p>
                                </div>
                                <Badge status={result.status} />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div className="bg-bg-secondary p-4">
                                    <p className="text-text-muted text-xs mb-1">Device</p>
                                    <p className="text-text-primary font-display font-semibold">{capitalize(result.deviceCategory)} — {result.deviceBrand} {result.deviceModel || ''}</p>
                                </div>
                                {result.estimatedCost && (
                                    <div className="bg-bg-secondary p-4">
                                        <p className="text-text-muted text-xs mb-1">Estimated Cost</p>
                                        <p className="text-accent font-display font-bold">{formatCurrency(result.estimatedCost)}</p>
                                    </div>
                                )}
                                {result.finalCost && (
                                    <div className="bg-bg-secondary p-4">
                                        <p className="text-text-muted text-xs mb-1">Final Cost</p>
                                        <p className="text-accent font-display font-bold">{formatCurrency(result.finalCost)}</p>
                                    </div>
                                )}
                                {result.assignedTechnician && (
                                    <div className="bg-bg-secondary p-4">
                                        <p className="text-text-muted text-xs mb-1">Technician</p>
                                        <p className="text-text-primary font-display font-semibold">{result.assignedTechnician.firstName} {result.assignedTechnician.lastName}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {result.statusHistory?.length > 0 && (
                            <div className="bg-bg-card border border-primary/20 p-6">
                                <h2 className="font-display font-bold text-xl text-text-primary mb-5 flex items-center gap-2">
                                    <Clock size={18} className="text-accent" /> Status History
                                </h2>
                                <div className="relative space-y-4 pl-4 border-l border-primary/20">
                                    {[...result.statusHistory].reverse().map((update, i) => (
                                        <div key={i} className="relative pl-5">
                                            <span className="absolute -left-[1.35rem] top-1.5 w-2.5 h-2.5 bg-primary border-2 border-bg-card rounded-full block" />
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <Badge status={update.status} />
                                                    {update.note && <p className="text-text-muted text-sm mt-1.5">{update.note}</p>}
                                                </div>
                                                <span className="text-xs text-text-muted shrink-0">{formatDateTime(update.createdAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!result && !error && (
                    <div className="text-center py-12 text-text-muted">
                        <Search size={40} className="mx-auto mb-4 text-primary/30" />
                        <p className="text-sm">Enter a tracking ID above to see your repair status.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
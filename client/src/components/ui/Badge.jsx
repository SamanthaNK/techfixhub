import { capitalize } from '../../utils/helpers'

export default function Badge({ status, label }) {
    const colorMap = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        received: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        diagnosing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        awaiting_approval: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        in_repair: 'bg-primary/20 text-accent border-primary/30',
        quality_check: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
        ready: 'bg-accent/20 text-accent border-accent/30',
        completed: 'bg-green-700/20 text-green-400 border-green-700/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        in_progress: 'bg-primary/20 text-accent border-primary/30',
        active: 'bg-accent/20 text-accent border-accent/30',
        inactive: 'bg-text-muted/10 text-text-muted border-text-muted/20',
        paid: 'bg-green-700/20 text-green-400 border-green-700/30',
        unpaid: 'bg-red-500/20 text-red-400 border-red-500/30',
        partial: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    }
    const cls = colorMap[status] || 'bg-text-muted/10 text-text-muted border-text-muted/20'
    return (
        <span className={`inline-block px-2.5 py-0.5 text-xs font-display font-semibold border ${cls}`}>
            {label || capitalize(status)}
        </span>
    )
}
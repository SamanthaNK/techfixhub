export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '—'
    return `${Number(amount).toLocaleString('fr-CM')} FCFA`
}

export function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB')
}

export function formatDateTime(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}

export function getStatusColor(status) {
    const map = {
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
    }
    return map[status] || 'bg-text-muted/10 text-text-muted border-text-muted/20'
}

export function capitalize(str) {
    if (!str) return ''
    return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const DEVICE_CATEGORIES = [
    { value: 'phone', label: 'Phone' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'smartwatch', label: 'Smartwatch' },
    { value: 'medical_equipment', label: 'Medical Equipment' },
    { value: 'kitchen_equipment', label: 'Kitchen Equipment' },
    { value: 'solar_system', label: 'Solar System' },
    { value: 'ict_infrastructure', label: 'ICT Infrastructure' },
    { value: 'other', label: 'Other' },
]

export const SERVICE_TYPES = [
    { value: 'repair', label: 'Repair' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'refurbishment', label: 'Refurbishment' },
    { value: 'training', label: 'Training' },
    { value: 'consultation', label: 'Consultation' },
]

export const REPAIR_STATUSES = [
    'pending', 'received', 'diagnosing', 'awaiting_approval',
    'in_repair', 'quality_check', 'ready', 'completed', 'cancelled',
]
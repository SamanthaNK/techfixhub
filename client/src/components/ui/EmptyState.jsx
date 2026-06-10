import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data available yet', description = '', icon: Icon = Inbox, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-bg-card border border-primary/20 mb-4">
                <Icon size={32} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-text-primary">{title}</h3>
            {description && <p className="text-text-muted text-sm mt-2 max-w-xs">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    )
}
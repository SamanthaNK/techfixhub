export default function Input({
    label,
    error,
    id,
    className = '',
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-display font-medium text-text-primary">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full bg-bg-secondary border ${error ? 'border-red-500' : 'border-primary/30'} text-text-primary placeholder-text-muted px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 ${className}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    )
}

export function Select({ label, error, id, children, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-display font-medium text-text-primary">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`w-full bg-bg-secondary border ${error ? 'border-red-500' : 'border-primary/30'} text-text-primary px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    )
}

export function Textarea({ label, error, id, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-display font-medium text-text-primary">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`w-full bg-bg-secondary border ${error ? 'border-red-500' : 'border-primary/30'} text-text-primary placeholder-text-muted px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none ${className}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    )
}
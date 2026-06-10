export default function Spinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
    return (
        <div
            className={`${sizes[size]} border-2 border-primary/30 border-t-accent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    )
}
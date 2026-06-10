export default function Card({ children, className = '', hover = false }) {
    return (
        <div className={`bg-bg-card border border-primary/20 ${hover ? 'hover:border-primary/50 transition-colors duration-200' : ''} ${className}`}>
            {children}
        </div>
    )
}
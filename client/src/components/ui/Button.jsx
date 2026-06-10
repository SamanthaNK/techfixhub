import Spinner from './Spinner'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) {
    const base = 'font-display font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center'
    const variants = {
        primary: 'bg-primary hover:bg-accent text-white hover:text-bg',
        outline: 'border border-primary text-accent hover:bg-primary hover:text-white',
        ghost: 'text-accent hover:bg-primary/10',
        danger: 'bg-red-600 hover:bg-red-500 text-white',
    }
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    )
}
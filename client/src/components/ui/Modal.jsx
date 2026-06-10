import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-bg-secondary border border-primary/30 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-slide-up`}>
                <div className="flex items-center justify-between p-5 border-b border-primary/20">
                    <h2 className="font-display font-bold text-xl text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-accent transition-colors" aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    )
}
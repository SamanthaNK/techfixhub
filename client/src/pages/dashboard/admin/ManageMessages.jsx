import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import { getMessages, markMessageRead } from '../../../api/contact'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import { formatDate } from '../../../utils/helpers'
import toast from 'react-hot-toast'

export default function ManageMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [marking, setMarking] = useState(null)

    const loadMessages = async () => {
        setLoading(true)
        try {
            const { data } = await getMessages({ isRead: false, page, limit: 15 })
            setMessages(data.data || [])
            setTotal(data.total || 0)
        } catch (error) {
            toast.error('Failed to load messages')
            setMessages([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMessages()
    }, [page])

    const handleMarkAsRead = async (id) => {
        setMarking(id)
        try {
            await markMessageRead(id)
            toast.success('Message marked as read')
            loadMessages()
        } catch (error) {
            toast.error('Failed to update message status')
        } finally {
            setMarking(null)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display font-black text-3xl text-text-primary">Unread Messages</h1>
                <p className="text-text-muted text-sm mt-1">Review the latest unread contact messages from customers.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : messages.length === 0 ? (
                <EmptyState
                    icon={Mail}
                    title="No unread messages"
                    subtitle="You're all caught up. New messages will appear here as they arrive."
                />
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message._id} className="bg-bg-card border border-primary/20 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div>
                                    <p className="font-display font-bold text-text-primary">{message.fullName}</p>
                                    <p className="text-text-muted text-xs mt-1">{message.email} • {message.phone || 'No phone provided'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-muted text-xs">{formatDate(message.createdAt)}</p>
                                    <span className="text-xs mt-1 inline-block border border-primary/20 px-2 py-1 text-text-muted">{message.subject.replace(/_/g, ' ')}</span>
                                </div>
                            </div>

                            <p className="text-text-muted text-sm leading-relaxed mb-4 whitespace-pre-line">{message.message}</p>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs font-display text-accent">Unread</span>
                                <Button
                                    loading={marking === message._id}
                                    onClick={() => handleMarkAsRead(message._id)}
                                >
                                    Mark as read
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {total > 15 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="px-4 py-2 border border-primary/30 text-text-muted text-sm font-display disabled:opacity-40 hover:border-primary transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-text-muted text-sm">Page {page} of {Math.ceil(total / 15)}</span>
                    <button
                        disabled={page >= Math.ceil(total / 15)}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 border border-primary/30 text-text-muted text-sm font-display disabled:opacity-40 hover:border-primary transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setLoading(true)
        try {
            await forgotPassword(email)
            setSent(true)
            toast.success('Reset link sent if the email exists.')
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-bg dot-pattern">
            <div className="w-full max-w-md">
                <div className="bg-bg-secondary border border-primary/30 p-8 animate-slide-up">
                    {sent ? (
                        <div className="text-center">
                            <h1 className="font-display font-black text-3xl text-text-primary mb-3">Check Your Email</h1>
                            <p className="text-text-muted text-sm">If an account exists with that email, we sent a password reset link. Check your inbox.</p>
                            <Link to="/login" className="mt-6 inline-block text-accent hover:underline text-sm">Back to Sign In</Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="font-display font-black text-3xl text-text-primary">Reset Password</h1>
                                <p className="text-text-muted text-sm mt-2">Enter your email and we will send you a reset link.</p>
                            </div>
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <Input id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@example.com" required />
                                <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
                            </form>
                            <p className="text-center text-text-muted text-sm mt-6">
                                <Link to="/login" className="text-accent hover:underline">Back to Sign In</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
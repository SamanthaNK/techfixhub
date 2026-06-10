import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await loginUser(form)
            login(data.token, data.user)
            toast.success(`Welcome back, ${data.user.firstName}!`)
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-bg dot-pattern">
            <div className="w-full max-w-md">
                <div className="bg-bg-secondary border border-primary/30 p-8 animate-slide-up">
                    <div className="mb-8">
                        <h1 className="font-display font-black text-3xl text-text-primary">Sign In</h1>
                        <p className="text-text-muted text-sm mt-2">Access your TechFix Hub dashboard.</p>
                    </div>
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <Input id="email" label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jean@example.com" required />
                        <Input id="password" label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" required />
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                        </div>
                        <Button type="submit" loading={loading} className="w-full">Sign In</Button>
                    </form>
                    <p className="text-center text-text-muted text-sm mt-6">
                        No account yet?{' '}
                        <Link to="/register" className="text-accent hover:underline font-medium">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
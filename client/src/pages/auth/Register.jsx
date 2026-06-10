import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function Register() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'First name is required'
        if (!form.lastName.trim()) e.lastName = 'Last name is required'
        if (!form.email.trim()) e.email = 'Email is required'
        if (!/^(\+237|237)?[6-9][0-9]{8}$/.test(form.phone)) e.phone = 'Valid Cameroon phone number required'
        if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
        if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            const { data } = await registerUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password })
            login(data.token, data.user)
            toast.success('Account created successfully!')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-bg dot-pattern">
            <div className="w-full max-w-md">
                <div className="bg-bg-secondary border border-primary/30 p-8 animate-slide-up">
                    <div className="mb-8">
                        <h1 className="font-display font-black text-3xl text-text-primary">Create Account</h1>
                        <p className="text-text-muted text-sm mt-2">Join TechFix Hub and manage your repairs online.</p>
                    </div>
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input id="firstName" label="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} error={errors.firstName} placeholder="Jean" required />
                            <Input id="lastName" label="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} error={errors.lastName} placeholder="Dupont" required />
                        </div>
                        <Input id="email" label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} placeholder="jean@example.com" required />
                        <Input id="phone" label="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={errors.phone} placeholder="+237 6XX XXX XXX" required />
                        <Input id="password" label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} placeholder="Min. 8 characters" required />
                        <Input id="confirm" label="Confirm Password" type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} error={errors.confirm} placeholder="Repeat password" required />
                        <Button type="submit" loading={loading} className="w-full mt-2">Create Account</Button>
                    </form>
                    <p className="text-center text-text-muted text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent hover:underline font-medium">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
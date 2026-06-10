import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { submitContact } from '../api/contact'
import Button from '../components/ui/Button'
import Input, { Select, Textarea } from '../components/ui/Input'
import toast from 'react-hot-toast'

const SUBJECTS = [
    { value: '', label: 'Select a subject...' },
    { value: 'repair_inquiry', label: 'Repair Inquiry' },
    { value: 'maintenance_inquiry', label: 'Maintenance Inquiry' },
    { value: 'training_inquiry', label: 'Training Inquiry' },
    { value: 'quotation', label: 'Request a Quotation' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'complaint', label: 'Complaint' },
]

export default function Contact() {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.fullName.trim()) e.fullName = 'Full name is required'
        if (!form.email.trim()) e.email = 'Email is required'
        if (!form.subject) e.subject = 'Please select a subject'
        if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
        return e
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await submitContact(form)
            setSent(true)
            toast.success('Message sent! We will get back to you shortly.')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="animate-fade-in py-16">
            <section className="bg-bg-secondary border-b border-primary/20 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-px bg-accent" />
                        <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Get In Touch</span>
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary">Contact Us</h1>
                    <p className="text-text-muted text-xl mt-4 max-w-xl">
                        Have a question, need a quote, or want to schedule a service? We are here for you.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="space-y-5">
                        <h2 className="font-display font-bold text-2xl text-text-primary">Reach Us Directly</h2>
                        {[
                            { icon: MapPin, label: 'Location', value: 'Yaounde, Cameroon' },
                            { icon: Phone, label: 'Phone', value: '+237 6XX XXX XXX' },
                            { icon: Mail, label: 'Email', value: 'joonsclare@gmail.com' },
                            { icon: Clock, label: 'Hours', value: 'Mon–Fri: 8:00 – 18:00\nSat: 9:00 – 14:00' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-start gap-4 bg-bg-card border border-primary/20 p-5">
                                <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <Icon size={16} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-xs font-display font-semibold text-text-muted mb-1">{label}</p>
                                    <p className="text-text-primary text-sm whitespace-pre-line">{value}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-bg-card border border-primary/20 p-5">
                            <h3 className="font-display font-semibold text-text-primary mb-2">FAQ</h3>
                            {[
                                ['How long does a repair take?', 'Most repairs are completed within 1–3 business days depending on parts availability.'],
                                ['Do you offer on-site service?', 'Yes, for maintenance contracts and certain repair types. Book an appointment to get started.'],
                                ['What is your warranty policy?', 'All repairs come with a 30-day warranty on workmanship and replaced parts.'],
                            ].map(([q, a]) => (
                                <div key={q} className="border-b border-primary/10 py-3 last:border-0">
                                    <p className="text-text-primary text-sm font-display font-medium">{q}</p>
                                    <p className="text-text-muted text-xs mt-1 leading-relaxed">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        {sent ? (
                            <div className="bg-bg-card border border-accent/30 p-10 text-center">
                                <div className="w-12 h-12 bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                                    <Mail size={20} className="text-accent" />
                                </div>
                                <h3 className="font-display font-bold text-2xl text-text-primary mb-2">Message Sent</h3>
                                <p className="text-text-muted">Thank you for reaching out. Our team will respond within 1 business day.</p>
                                <button onClick={() => setSent(false)} className="mt-6 text-accent hover:underline text-sm">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="bg-bg-card border border-primary/20 p-8 space-y-5">
                                <h2 className="font-display font-bold text-2xl text-text-primary">Send a Message</h2>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <Input id="fullName" label="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} error={errors.fullName} placeholder="Jean Dupont" required />
                                    <Input id="email" label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} placeholder="jean@example.com" required />
                                </div>
                                <Input id="phone" label="Phone Number (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+237 6XX XXX XXX" />
                                <Select id="subject" label="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} error={errors.subject}>
                                    {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </Select>
                                <Textarea id="message" label="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} error={errors.message} placeholder="Describe your issue or inquiry..." rows={5} required />
                                <Button type="submit" loading={loading} size="lg" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
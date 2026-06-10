import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Clock, Cpu, CheckCircle, ArrowRight } from 'lucide-react'
import { getPlans } from '../api/maintenance'
import { formatCurrency, capitalize } from '../utils/helpers'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const sectors = [
    { key: 'school', label: 'Schools', icon: Cpu, desc: 'Comprehensive ICT and electronics maintenance for educational institutions.' },
    { key: 'hospital', label: 'Hospitals & Clinics', icon: Shield, desc: 'Critical maintenance for medical devices, ICT, and building systems.' },
    { key: 'sme', label: 'SMEs & Businesses', icon: CheckCircle, desc: 'Tailored plans for small and medium enterprises to keep operations running.' },
    { key: 'individual', label: 'Individuals', icon: Clock, desc: 'Personal device maintenance and priority repair access for individuals.' },
]

export default function Maintenance() {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeSector, setActiveSector] = useState('all')

    useEffect(() => {
        async function load() {
            try {
                const { data } = await getPlans()
                setPlans(data.data || [])
            } catch {
                setPlans([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filtered = activeSector === 'all' ? plans : plans.filter(p => p.targetSector === activeSector)

    return (
        <div className="animate-fade-in py-16">
            <section className="bg-bg-secondary border-b border-primary/20 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-px bg-accent" />
                        <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Maintenance Plans</span>
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary">Preventive Maintenance</h1>
                    <p className="text-text-muted text-xl mt-4 max-w-2xl">
                        Subscription-based maintenance contracts for schools, hospitals, businesses, and individuals. Keep your equipment running — before it breaks.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="font-display font-bold text-3xl text-text-primary mb-8">Who Is It For?</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {sectors.map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="bg-bg-card border border-primary/20 p-6">
                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                <Icon size={18} className="text-accent" />
                            </div>
                            <h3 className="font-display font-bold text-text-primary mb-2">{label}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 mb-8 flex-wrap">
                    {[{ value: 'all', label: 'All Plans' }, ...sectors.map(s => ({ value: s.key, label: s.label }))].map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setActiveSector(opt.value)}
                            className={`px-4 py-2 text-sm font-display font-medium transition-all ${activeSector === opt.value ? 'bg-primary text-white' : 'border border-primary/30 text-text-muted hover:border-primary hover:text-text-primary'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Shield}
                        title="No plans available yet"
                        description="Maintenance plans are coming soon. Contact us for a custom quote."
                        action={<Link to="/contact" className="bg-primary hover:bg-accent text-white hover:text-bg px-6 py-3 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all">Contact Us <ArrowRight size={14} /></Link>}
                    />
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(plan => (
                            <div key={plan._id} className="bg-bg-card border border-primary/20 hover:border-primary/50 flex flex-col transition-all">
                                <div className="p-6 flex-1">
                                    <span className="text-xs font-display font-semibold text-accent border border-accent/30 px-2.5 py-0.5 mb-4 inline-block">
                                        {capitalize(plan.targetSector)}
                                    </span>
                                    <h3 className="font-display font-bold text-2xl text-text-primary mt-3 mb-3">{plan.name}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed mb-5">{plan.description}</p>

                                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                                        <div className="bg-bg-secondary p-3">
                                            <p className="text-text-muted text-xs">Max Devices</p>
                                            <p className="font-display font-bold text-text-primary">{plan.maxDevices}</p>
                                        </div>
                                        <div className="bg-bg-secondary p-3">
                                            <p className="text-text-muted text-xs">Response Time</p>
                                            <p className="font-display font-bold text-text-primary">{plan.responseTimeHours}h</p>
                                        </div>
                                    </div>

                                    {plan.features?.length > 0 && (
                                        <ul className="space-y-2">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-text-muted text-sm">
                                                    <CheckCircle size={12} className="text-accent shrink-0" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="p-6 border-t border-primary/20">
                                    <p className="font-display font-black text-2xl text-accent">{formatCurrency(plan.priceMonthly)}<span className="text-sm font-body font-normal text-text-muted">/month</span></p>
                                    {plan.priceAnnual && <p className="text-text-muted text-xs mt-1">{formatCurrency(plan.priceAnnual)}/year</p>}
                                    <Link to="/contact" className="mt-4 w-full bg-primary hover:bg-accent text-white hover:text-bg py-3 font-display font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all">
                                        Get This Plan <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
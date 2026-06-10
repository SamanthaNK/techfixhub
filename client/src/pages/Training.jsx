import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Clock, Users, ChevronRight, Filter } from 'lucide-react'
import { getPrograms } from '../api/training'
import { formatCurrency, capitalize } from '../utils/helpers'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'

const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'phone_repair', label: 'Phone Repair' },
    { value: 'laptop_repair', label: 'Laptop Repair' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'networking', label: 'Networking' },
    { value: 'solar', label: 'Solar' },
    { value: 'medical_equipment', label: 'Medical Equipment' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
]

const LEVELS = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
]

export default function Training() {
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const [level, setLevel] = useState('')

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const params = {}
                if (category) params.category = category
                if (level) params.level = level
                const { data } = await getPrograms(params)
                setPrograms(data.data || [])
            } catch {
                setPrograms([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [category, level])

    return (
        <div className="animate-fade-in py-16">
            <section className="bg-bg-secondary border-b border-primary/20 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-px bg-accent" />
                        <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Training Academy</span>
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary">Build Your Skills</h1>
                    <p className="text-text-muted text-xl mt-4 max-w-2xl">
                        Hands-on technical training programs designed for aspiring technicians in Cameroon.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-text-muted">
                        <Filter size={14} />
                        <span className="text-sm font-display">Filter:</span>
                    </div>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="bg-bg-secondary border border-primary/30 text-text-primary px-4 py-2 text-sm focus:outline-none focus:border-accent"
                        aria-label="Filter by category"
                    >
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <select
                        value={level}
                        onChange={e => setLevel(e.target.value)}
                        className="bg-bg-secondary border border-primary/30 text-text-primary px-4 py-2 text-sm focus:outline-none focus:border-accent"
                        aria-label="Filter by level"
                    >
                        {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (
                    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                ) : programs.length === 0 ? (
                    <EmptyState
                        icon={GraduationCap}
                        title="No programs available yet"
                        description="Training programs are being set up. Check back soon."
                    />
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {programs.map(program => (
                            <Link
                                key={program._id}
                                to={`/training/${program._id}`}
                                className="bg-bg-card border border-primary/20 hover:border-primary/60 flex flex-col group transition-all"
                                aria-label={`View ${program.title}`}
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <Badge status={program.level} />
                                        <span className="text-xs text-text-muted font-body">{capitalize(program.category)}</span>
                                    </div>
                                    <h3 className="font-display font-bold text-text-primary text-xl mb-2 group-hover:text-accent transition-colors">{program.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed line-clamp-3">{program.description}</p>
                                </div>
                                <div className="px-6 py-4 border-t border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-text-muted">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {program.durationWeeks}w</span>
                                        <span className="flex items-center gap-1"><Users size={12} /> {program.availableSlots ?? program.maxEnrollment - program.currentEnrollment} slots</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-accent font-display font-bold text-sm">{formatCurrency(program.priceFCFA)}</p>
                                    </div>
                                </div>
                                <div className="px-6 pb-5">
                                    <span className="flex items-center gap-1.5 text-accent text-xs font-display font-medium group-hover:gap-2.5 transition-all">
                                        View Details <ChevronRight size={12} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
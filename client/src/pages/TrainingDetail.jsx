import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Users, BookOpen, Award, ArrowLeft } from 'lucide-react'
import { getProgramById, enrollInProgram } from '../api/training'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate, capitalize } from '../utils/helpers'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function TrainingDetail() {
    const { id } = useParams()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [program, setProgram] = useState(null)
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)

    useEffect(() => {
        async function load() {
            try {
                const { data } = await getProgramById(id)
                setProgram(data.data)
            } catch {
                toast.error('Program not found')
                navigate('/training')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, navigate])

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        setEnrolling(true)
        try {
            await enrollInProgram(id)
            toast.success('Enrollment submitted! We will contact you shortly.')
            setProgram(p => ({ ...p, currentEnrollment: p.currentEnrollment + 1 }))
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed')
        } finally {
            setEnrolling(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
    if (!program) return null

    const availableSlots = program.maxEnrollment - program.currentEnrollment

    return (
        <div className="animate-fade-in py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate('/training')} className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-8 text-sm">
                    <ArrowLeft size={14} /> Back to Programs
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge status={program.level} />
                                <span className="text-sm text-text-muted">{capitalize(program.category)}</span>
                            </div>
                            <h1 className="font-display font-black text-4xl text-text-primary mb-4">{program.title}</h1>
                            <p className="text-text-muted text-lg leading-relaxed">{program.description}</p>
                        </div>

                        {program.syllabus?.length > 0 && (
                            <div className="bg-bg-card border border-primary/20 p-6">
                                <h2 className="font-display font-bold text-xl text-text-primary mb-4 flex items-center gap-2">
                                    <BookOpen size={18} className="text-accent" /> Syllabus
                                </h2>
                                <ul className="space-y-2">
                                    {program.syllabus.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-text-muted text-sm border-b border-primary/10 pb-2 last:border-0">
                                            <span className="font-display font-bold text-primary/60 text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {program.prerequisites?.length > 0 && (
                            <div className="bg-bg-card border border-primary/20 p-6">
                                <h2 className="font-display font-bold text-xl text-text-primary mb-4">Prerequisites</h2>
                                <ul className="space-y-2">
                                    {program.prerequisites.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-text-muted text-sm">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {program.instructor?.name && (
                            <div className="bg-bg-card border border-primary/20 p-6">
                                <h2 className="font-display font-bold text-xl text-text-primary mb-2">Instructor</h2>
                                <p className="font-display font-semibold text-accent">{program.instructor.name}</p>
                                {program.instructor.bio && <p className="text-text-muted text-sm mt-2">{program.instructor.bio}</p>}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-bg-card border border-primary/30 p-6 sticky top-24">
                            <p className="font-display font-black text-3xl text-accent mb-1">{formatCurrency(program.priceFCFA)}</p>
                            <p className="text-text-muted text-xs mb-5">One-time enrollment fee</p>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex items-center gap-2.5 text-text-muted border-b border-primary/10 pb-3">
                                    <Clock size={14} className="text-primary" />
                                    <span>{program.durationWeeks} week{program.durationWeeks !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-text-muted border-b border-primary/10 pb-3">
                                    <Users size={14} className="text-primary" />
                                    <span>{availableSlots} slot{availableSlots !== 1 ? 's' : ''} available</span>
                                </div>
                                {program.startDate && (
                                    <div className="flex items-center gap-2.5 text-text-muted border-b border-primary/10 pb-3">
                                        <span className="text-primary text-xs font-display">START</span>
                                        <span>{formatDate(program.startDate)}</span>
                                    </div>
                                )}
                                {program.schedule && (
                                    <div className="flex items-center gap-2.5 text-text-muted">
                                        <span className="text-primary text-xs font-display">SCHEDULE</span>
                                        <span>{program.schedule}</span>
                                    </div>
                                )}
                                {program.certificateOffered && (
                                    <div className="flex items-center gap-2.5 text-accent">
                                        <Award size={14} />
                                        <span>Certificate offered</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleEnroll}
                                loading={enrolling}
                                disabled={availableSlots <= 0}
                                className="w-full"
                            >
                                {availableSlots <= 0 ? 'Fully Booked' : 'Enroll Now'}
                            </Button>

                            {!isAuthenticated && (
                                <p className="text-text-muted text-xs text-center mt-3">You need an account to enroll.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
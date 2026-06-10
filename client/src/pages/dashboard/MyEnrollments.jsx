import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { getMyEnrollments } from '../../api/training'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatCurrency, capitalize } from '../../utils/helpers'

export default function MyEnrollments() {
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyEnrollments()
            .then(({ data }) => setEnrollments(data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">My Enrollments</h1>
                    <p className="text-text-muted text-sm mt-1">Training programs you have enrolled in.</p>
                </div>
                <Link to="/training" className="border border-primary text-accent hover:bg-primary hover:text-white px-5 py-2.5 font-display font-semibold text-sm transition-all">
                    Browse Programs
                </Link>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : enrollments.length === 0 ? (
                    <EmptyState icon={GraduationCap} title="No enrollments yet" description="Browse our training programs and enroll today."
                        action={<Link to="/training" className="bg-primary hover:bg-accent text-white hover:text-bg px-6 py-3 font-display font-semibold text-sm transition-all">Browse Programs</Link>}
                    />
                ) : (
                    <div className="space-y-3">
                        {enrollments.map(e => (
                            <div key={e._id} className="bg-bg-card border border-primary/20 p-5 grid sm:grid-cols-3 gap-4 items-center">
                                <div className="sm:col-span-2">
                                    <p className="font-display font-bold text-text-primary">{e.program?.title || 'Program'}</p>
                                    <p className="text-text-muted text-xs mt-1">{capitalize(e.program?.category || '')} &bull; {e.program?.durationWeeks}w &bull; {formatCurrency(e.program?.priceFCFA)}</p>
                                    <p className="text-text-muted text-xs mt-1">Enrolled: {formatDate(e.enrollmentDate)}</p>
                                </div>
                                <div className="flex flex-col gap-2 sm:items-end">
                                    <Badge status={e.status} />
                                    <Badge status={e.paymentStatus} />
                                    <p className="text-text-muted text-xs">Paid: {formatCurrency(e.amountPaidFCFA)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}
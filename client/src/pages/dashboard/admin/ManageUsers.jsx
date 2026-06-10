import { useEffect, useState } from 'react'
import { getUsers, toggleUserStatus, updateUserRole } from '../../../api/admin'
import Badge from '../../../components/ui/Badge'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Input'
import { Users } from 'lucide-react'
import { formatDate } from '../../../utils/helpers'
import toast from 'react-hot-toast'

const ROLES = ['customer', 'technician', 'admin', 'super_admin']

export default function ManageUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState(null)
    const [newRole, setNewRole] = useState('')
    const [updating, setUpdating] = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const { data } = await getUsers({ page, limit: 15 })
            setUsers(data.data || [])
            setTotal(data.total || 0)
        } catch { setUsers([]) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [page])

    const handleToggle = async (id) => {
        try {
            await toggleUserStatus(id)
            toast.success('User status updated')
            load()
        } catch { toast.error('Failed to update status') }
    }

    const handleRoleUpdate = async () => {
        setUpdating(true)
        try {
            await updateUserRole(selected._id, newRole)
            toast.success('Role updated')
            setSelected(null)
            load()
        } catch { toast.error('Failed to update role') }
        finally { setUpdating(false) }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display font-black text-3xl text-text-primary">Manage Users</h1>
                <p className="text-text-muted text-sm mt-1">{total} registered users</p>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : users.length === 0 ? <EmptyState icon={Users} title="No users found" />
                    : (
                        <div className="space-y-2">
                            {users.map(u => (
                                <div key={u._id} className="bg-bg-card border border-primary/20 p-4 grid sm:grid-cols-4 gap-4 items-center">
                                    <div className="sm:col-span-2">
                                        <p className="font-display font-bold text-text-primary">{u.firstName} {u.lastName}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{u.email} &bull; {u.phone}</p>
                                        <p className="text-text-muted text-xs mt-0.5">Joined {formatDate(u.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Badge status={u.isActive ? 'active' : 'inactive'} />
                                        <span className="text-xs font-display text-text-muted border border-primary/20 px-2 py-0.5 inline-block w-fit">{u.role}</span>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => handleToggle(u._id)}
                                            className={`text-xs px-3 py-1.5 border font-display transition-colors ${u.isActive ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-accent/30 text-accent hover:bg-accent/10'}`}>
                                            {u.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => { setSelected(u); setNewRole(u.role) }}
                                            className="text-xs px-3 py-1.5 border border-primary/30 text-text-muted hover:border-accent hover:text-accent font-display transition-colors">
                                            Role
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            {total > 15 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-primary/30 text-text-muted text-sm font-display disabled:opacity-40 hover:border-primary transition-colors">Previous</button>
                    <span className="text-text-muted text-sm">Page {page} of {Math.ceil(total / 15)}</span>
                    <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-primary/30 text-text-muted text-sm font-display disabled:opacity-40 hover:border-primary transition-colors">Next</button>
                </div>
            )}

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Change User Role">
                {selected && (
                    <div className="space-y-4">
                        <p className="text-text-muted text-sm">User: <span className="text-text-primary font-medium">{selected.firstName} {selected.lastName}</span></p>
                        <Select label="Role" value={newRole} onChange={e => setNewRole(e.target.value)}>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </Select>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
                            <Button loading={updating} onClick={handleRoleUpdate}>Update Role</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
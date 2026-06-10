import { useEffect, useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { getInventory, createInventoryItem, updateInventoryItem, adjustStock } from '../../../api/admin'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input, { Select } from '../../../components/ui/Input'
import { formatCurrency, capitalize } from '../../../utils/helpers'
import toast from 'react-hot-toast'

const emptyForm = { name: '', category: 'spare_part', description: '', quantity: 0, costPriceFCFA: '', sellingPriceFCFA: '', lowStockThreshold: 5 }

export default function ManageInventory() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [lowStock, setLowStock] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [stockModal, setStockModal] = useState(null)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [adjustment, setAdjustment] = useState(0)
    const [saving, setSaving] = useState(false)

    const load = () => {
        setLoading(true)
        getInventory(lowStock ? { lowStock: 'true' } : {}).then(({ data }) => setItems(data.data || [])).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [lowStock])

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
    const openEdit = (item) => { setEditing(item); setForm({ name: item.name, category: item.category, description: item.description || '', quantity: item.quantity, costPriceFCFA: item.costPriceFCFA, sellingPriceFCFA: item.sellingPriceFCFA || '', lowStockThreshold: item.lowStockThreshold }); setModalOpen(true) }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (editing) { await updateInventoryItem(editing._id, form); toast.success('Item updated') }
            else { await createInventoryItem(form); toast.success('Item added') }
            setModalOpen(false)
            load()
        } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
        finally { setSaving(false) }
    }

    const handleAdjust = async () => {
        setSaving(true)
        try {
            await adjustStock(stockModal._id, Number(adjustment))
            toast.success('Stock adjusted')
            setStockModal(null)
            load()
        } catch (err) { toast.error(err.response?.data?.message || 'Adjustment failed') }
        finally { setSaving(false) }
    }

    const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="font-display font-black text-3xl text-text-primary">Inventory</h1>
                    <p className="text-text-muted text-sm mt-1">{items.length} item(s)</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setLowStock(!lowStock)} className={`text-sm px-4 py-2 border font-display transition-colors ${lowStock ? 'border-accent text-accent' : 'border-primary/30 text-text-muted hover:border-primary'}`}>
                        {lowStock ? 'All Items' : 'Low Stock Only'}
                    </button>
                    <Button onClick={openCreate} size="sm" className="flex items-center gap-2"><Plus size={14} /> Add Item</Button>
                </div>
            </div>

            {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
                : items.length === 0 ? <EmptyState icon={Package} title="No inventory items" action={<Button onClick={openCreate} size="sm">Add Item</Button>} />
                    : (
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item._id} className={`bg-bg-card border p-4 grid sm:grid-cols-5 gap-4 items-center ${item.isLowStock ? 'border-orange-500/30' : 'border-primary/20'}`}>
                                    <div className="sm:col-span-2">
                                        <p className="font-display font-bold text-text-primary text-sm">{item.name}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{item.sku} &bull; {capitalize(item.category)}</p>
                                        {item.isLowStock && <span className="text-orange-400 text-xs font-display">Low Stock</span>}
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-text-primary text-xl">{item.quantity}</p>
                                        <p className="text-text-muted text-xs">in stock</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-xs">Cost: <span className="text-text-primary">{formatCurrency(item.costPriceFCFA)}</span></p>
                                        {item.sellingPriceFCFA && <p className="text-text-muted text-xs mt-0.5">Sell: <span className="text-accent">{formatCurrency(item.sellingPriceFCFA)}</span></p>}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => { setStockModal(item); setAdjustment(0) }} className="text-xs px-3 py-1.5 border border-primary/30 text-text-muted hover:border-accent hover:text-accent font-display transition-colors">Stock</button>
                                        <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 border border-primary/30 text-text-muted hover:border-accent hover:text-accent font-display transition-colors">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Item' : 'Add Inventory Item'} size="lg">
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input label="Item Name" value={form.name} onChange={f('name')} placeholder="e.g. iPhone 14 Battery" required />
                        <Select label="Category" value={form.category} onChange={f('category')}>
                            {['spare_part', 'tool', 'consumable', 'refurbished_device', 'accessory'].map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
                        </Select>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Input label="Quantity" type="number" value={form.quantity} onChange={f('quantity')} min="0" />
                        <Input label="Cost Price (FCFA)" type="number" value={form.costPriceFCFA} onChange={f('costPriceFCFA')} min="0" />
                        <Input label="Selling Price (FCFA)" type="number" value={form.sellingPriceFCFA} onChange={f('sellingPriceFCFA')} min="0" />
                    </div>
                    <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={f('lowStockThreshold')} min="0" />
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button loading={saving} onClick={handleSave}>{editing ? 'Save Changes' : 'Add Item'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Stock Adjust Modal */}
            <Modal isOpen={!!stockModal} onClose={() => setStockModal(null)} title="Adjust Stock" size="sm">
                {stockModal && (
                    <div className="space-y-4">
                        <p className="text-text-muted text-sm">{stockModal.name} — Current stock: <span className="text-text-primary font-bold">{stockModal.quantity}</span></p>
                        <Input label="Adjustment (+ to add, - to remove)" type="number" value={adjustment} onChange={e => setAdjustment(e.target.value)} placeholder="e.g. 10 or -5" />
                        <p className="text-text-muted text-xs">New stock will be: <span className="text-accent font-bold">{stockModal.quantity + Number(adjustment)}</span></p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setStockModal(null)}>Cancel</Button>
                            <Button loading={saving} onClick={handleAdjust}>Confirm</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
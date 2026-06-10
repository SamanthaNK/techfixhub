import { Link } from 'react-router-dom'
import { Wrench, Stethoscope, Utensils, Sun, Network, RefreshCw, Package, ArrowRight } from 'lucide-react'

const categories = [
    {
        icon: Wrench,
        title: 'Electronics Repair',
        desc: 'Professional repair for phones, laptops, desktops, smartwatches, WiFi boxes, and other consumer electronics. We diagnose, source parts, and restore your device.',
        items: ['Smartphone screen & battery replacement', 'Laptop motherboard & keyboard repair', 'Desktop computer assembly & repair', 'Smartwatch servicing', 'WiFi routers & networking devices'],
    },
    {
        icon: Stethoscope,
        title: 'Medical Equipment Maintenance',
        desc: 'Preventive maintenance and corrective repair for medical devices in clinics, hospitals, and laboratories across Cameroon.',
        items: ['Diagnostic equipment servicing', 'Lab instrument calibration', 'Patient monitoring devices', 'Sterilization equipment', 'Scheduled preventive maintenance'],
    },
    {
        icon: Utensils,
        title: 'Commercial Kitchen Equipment',
        desc: 'Servicing and repair of commercial kitchen appliances for restaurants, hotels, and catering businesses.',
        items: ['Industrial refrigeration systems', 'Commercial ovens & fryers', 'Food processing equipment', 'Dishwasher & water heating units', 'Preventive maintenance contracts'],
    },
    {
        icon: Sun,
        title: 'Solar System Maintenance',
        desc: 'Fault diagnosis, panel cleaning, battery checks, and full maintenance for solar energy installations.',
        items: ['Solar panel inspection & cleaning', 'Inverter servicing & repair', 'Battery bank maintenance', 'Charge controller diagnostics', 'System performance audits'],
    },
    {
        icon: Network,
        title: 'ICT Infrastructure',
        desc: 'End-to-end ICT support including structured cabling, server maintenance, and network troubleshooting for businesses and institutions.',
        items: ['Structured cabling & LAN setup', 'Server installation & maintenance', 'Network troubleshooting', 'CCTV & access control systems', 'ICT support contracts'],
    },
    {
        icon: RefreshCw,
        title: 'Refurbishment & Resale',
        desc: 'We refurbish used electronics to like-new condition, reducing e-waste and making quality devices accessible at lower cost.',
        items: ['Laptop & phone refurbishment', 'Component-level restoration', 'Functionality certification', 'Refurbished device sales', 'Device trade-in program'],
    },
]

export default function Services() {
    return (
        <div className="animate-fade-in py-16">
            <section className="bg-bg-secondary border-b border-primary/20 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-px bg-accent" />
                        <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">What We Offer</span>
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary">Our Services</h1>
                    <p className="text-text-muted text-xl mt-4 max-w-2xl">
                        A full spectrum of repair, maintenance, and technical services — purpose-built for Cameroon's unique needs.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-6">
                    {categories.map(({ icon: Icon, title, desc, items }, i) => (
                        <div key={title} className="bg-bg-card border border-primary/20 p-8 grid md:grid-cols-2 gap-8 items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Icon size={18} className="text-accent" />
                                    </div>
                                    <h2 className="font-display font-bold text-2xl text-text-primary">{title}</h2>
                                </div>
                                <p className="text-text-muted leading-relaxed mb-6">{desc}</p>
                                <Link to="/dashboard/repairs/submit" className="bg-primary hover:bg-accent text-white hover:text-bg px-6 py-3 font-display font-semibold text-sm inline-flex items-center gap-2 transition-all">
                                    Submit Request <ArrowRight size={14} />
                                </Link>
                            </div>
                            <ul className="space-y-2.5">
                                {items.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-text-muted text-sm border-b border-primary/10 pb-2.5 last:border-0">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-bg-secondary border border-primary/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Package size={32} className="text-accent shrink-0" />
                        <div>
                            <h3 className="font-display font-bold text-xl text-text-primary">Spare Parts</h3>
                            <p className="text-text-muted text-sm mt-1">We stock and source quality spare parts for a wide range of devices and equipment.</p>
                        </div>
                    </div>
                    <Link to="/contact" className="border border-primary text-accent hover:bg-primary hover:text-white px-6 py-3 font-display font-semibold text-sm transition-all whitespace-nowrap">
                        Request a Part
                    </Link>
                </div>
            </div>
        </div>
    )
}
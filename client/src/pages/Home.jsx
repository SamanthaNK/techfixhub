import { Link } from 'react-router-dom'
import {
    Wrench, Cpu, GraduationCap, RefreshCw, ArrowRight, CheckCircle,
    Stethoscope, Zap, Network, Utensils, Sun, Search, ChevronRight
} from 'lucide-react'

const services = [
    { icon: Wrench, title: 'Electronics Repair', desc: 'Phones, laptops, desktops, smartwatches, and more — diagnosed and fixed right.', link: '/services' },
    { icon: Stethoscope, title: 'Medical Equipment', desc: 'Preventive maintenance and repair for medical devices used in clinics and hospitals.', link: '/services' },
    { icon: Utensils, title: 'Kitchen Equipment', desc: 'Commercial kitchen appliance servicing for restaurants and hospitality businesses.', link: '/services' },
    { icon: Sun, title: 'Solar Systems', desc: 'Installation checks, fault diagnosis, and maintenance for solar energy setups.', link: '/services' },
    { icon: Network, title: 'ICT Infrastructure', desc: 'Network setup, server maintenance, and structured cabling for businesses.', link: '/services' },
    { icon: GraduationCap, title: 'Technical Training', desc: 'Hands-on repair and maintenance training programs with certification.', link: '/training' },
]

const steps = [
    { num: '01', title: 'Submit Request', desc: 'Describe your device and issue through our online form.' },
    { num: '02', title: 'Diagnosis', desc: 'Our technicians evaluate the problem and provide a cost estimate.' },
    { num: '03', title: 'Repair', desc: 'Certified technicians carry out the repair with quality parts.' },
    { num: '04', title: 'Quality Check', desc: 'Every repair undergoes a final quality inspection.' },
    { num: '05', title: 'Collect', desc: 'Pick up your device or request on-site service delivery.' },
]

const whyUs = [
    'Trained and certified technicians',
    'Specialized medical and industrial equipment expertise',
    'Transparent pricing in FCFA — no hidden fees',
    'Real-time repair tracking with unique IDs',
    'Preventive maintenance plans for businesses',
    'Hands-on workforce development programs',
    'Sustainable refurbishment reducing e-waste',
    'Tailored ICT solutions for schools and hospitals',
]

export default function Home() {
    return (
        <div className="animate-fade-in">
            <section className="relative min-h-[90vh] flex items-center dot-pattern" aria-label="Hero">
                <div className="absolute inset-0 bg-bg-secondary/40" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-px bg-accent" />
                            <span className="text-accent text-sm font-display font-semibold tracking-widest uppercase">Cameroon's Technical Hub</span>
                        </div>
                        <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight mb-6">
                            Smart Equipment<br />
                            <span className="text-accent">Repair</span> &amp; Technical<br />
                            <span className="text-primary">Training</span> Solutions
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                            From broken phones to hospital equipment, solar systems to ICT networks, TechFix Hub delivers professional repair, preventive maintenance, and workforce training across Cameroon.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/dashboard/repairs/submit" className="bg-primary hover:bg-accent text-white hover:text-bg px-8 py-4 font-display font-bold text-base transition-all flex items-center gap-2">
                                Submit a Repair <ArrowRight size={16} />
                            </Link>
                            <Link to="/track" className="border border-primary/50 hover:border-accent text-text-primary hover:text-accent px-8 py-4 font-display font-semibold text-base transition-all flex items-center gap-2">
                                <Search size={16} /> Track My Repair
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-bg" aria-labelledby="services-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-px bg-accent" />
                            <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">What We Do</span>
                        </div>
                        <h2 id="services-heading" className="font-display font-bold text-4xl md:text-5xl text-text-primary">
                            Our Services
                        </h2>
                        <p className="text-text-muted text-lg mt-3 max-w-2xl">
                            Comprehensive technical solutions built for Cameroon's evolving technology needs.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map(({ icon: Icon, title, desc, link }) => (
                            <Link
                                key={title}
                                to={link}
                                className="bg-bg-card border border-primary/20 hover:border-primary/60 p-6 group transition-all duration-200"
                                aria-label={title}
                            >
                                <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <Icon size={18} className="text-accent" />
                                </div>
                                <h3 className="font-display font-bold text-text-primary text-lg mb-2">{title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                                <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-display font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more <ChevronRight size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-bg-secondary" aria-labelledby="how-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-px bg-accent" />
                            <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">The Process</span>
                        </div>
                        <h2 id="how-heading" className="font-display font-bold text-4xl md:text-5xl text-text-primary">How It Works</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {steps.map((step, i) => (
                            <div key={step.num} className="relative bg-bg-card border border-primary/20 p-6">
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 -right-2 w-4 h-px bg-primary/30 z-10" />
                                )}
                                <span className="font-display font-black text-4xl text-primary/30 block mb-3">{step.num}</span>
                                <h3 className="font-display font-bold text-text-primary mb-2">{step.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-bg" aria-labelledby="training-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-8 h-px bg-accent" />
                                <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Training Academy</span>
                            </div>
                            <h2 id="training-heading" className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
                                Build Real Technical Skills
                            </h2>
                            <p className="text-text-muted text-lg leading-relaxed mb-6">
                                Our hands-on training programs are designed for aspiring technicians and professionals across Cameroon. From phone repair to solar systems and networking build the skills that matter.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {['Phone & Laptop Repair', 'Electrical & Solar Systems', 'Network Infrastructure', 'Medical Equipment Maintenance', 'Entrepreneurship for Technicians'].map(item => (
                                    <li key={item} className="flex items-center gap-2.5 text-text-muted text-sm">
                                        <CheckCircle size={14} className="text-accent shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/training" className="bg-primary hover:bg-accent text-white hover:text-bg px-8 py-4 font-display font-bold inline-flex items-center gap-2 transition-all">
                                Browse Programs <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: GraduationCap, label: 'Beginner to Advanced', sub: 'Structured learning paths' },
                                { icon: Wrench, label: 'Hands-On Training', sub: 'Real devices, real repairs' },
                                { icon: Cpu, label: 'Modern Curriculum', sub: 'Updated for today\'s market' },
                                { icon: RefreshCw, label: 'Certification', sub: 'Coming soon' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="bg-bg-card border border-primary/20 p-5">
                                    <Icon size={20} className="text-accent mb-3" />
                                    <p className="font-display font-semibold text-text-primary text-sm">{label}</p>
                                    <p className="text-text-muted text-xs mt-1">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-bg-secondary dot-pattern" aria-labelledby="why-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="w-8 h-px bg-accent" />
                            <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Why TechFix Hub</span>
                            <span className="w-8 h-px bg-accent" />
                        </div>
                        <h2 id="why-heading" className="font-display font-bold text-4xl md:text-5xl text-text-primary">
                            Built Different
                        </h2>
                        <p className="text-text-muted text-lg mt-3 max-w-xl mx-auto">
                            We are not just a repair shop. We are a full technical ecosystem built for Cameroon.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {whyUs.map((item) => (
                            <div key={item} className="bg-bg border border-primary/20 px-5 py-4 flex items-start gap-3">
                                <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" />
                                <span className="text-text-muted text-sm leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-bg-card border-y border-primary/20" aria-labelledby="vision-heading">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-accent text-xs font-display font-semibold tracking-widest uppercase">Our Vision</span>
                    <h2 id="vision-heading" className="font-display font-black text-4xl md:text-5xl text-text-primary mt-4 mb-6 leading-tight">
                        To Become Cameroon's Leading Technical Repair, Maintenance, and Workforce Development Hub
                    </h2>
                    <p className="text-text-muted text-lg leading-relaxed mb-10">
                        From individual device owners to hospitals, schools, and SMEs — TechFix Hub is building the infrastructure that keeps Cameroon's technology running.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register" className="bg-primary hover:bg-accent text-white hover:text-bg px-8 py-4 font-display font-bold inline-flex items-center gap-2 transition-all">
                            Create Account <ArrowRight size={16} />
                        </Link>
                        <Link to="/contact" className="border border-primary/50 hover:border-accent text-text-primary hover:text-accent px-8 py-4 font-display font-semibold inline-flex items-center gap-2 transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
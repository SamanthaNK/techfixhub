import { Link } from 'react-router-dom'
import { Wrench, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-bg-secondary border-t border-primary/20 mt-auto" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center">
                                <Wrench size={16} className="text-white" />
                            </div>
                            <span className="font-display font-bold text-lg text-text-primary">
                                TechFix<span className="text-accent">Hub</span>
                            </span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Cameroon's dedicated platform for electronics repair, preventive maintenance, and technical workforce development.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-display font-semibold text-text-primary mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            {['Electronics Repair', 'Medical Equipment Maintenance', 'Solar System Maintenance', 'ICT Infrastructure', 'Refurbishment', 'Spare Parts'].map(s => (
                                <li key={s}><Link to="/services" className="hover:text-accent transition-colors">{s}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-display font-semibold text-text-primary mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="/training" className="hover:text-accent transition-colors">Training Academy</Link></li>
                            <li><Link to="/maintenance" className="hover:text-accent transition-colors">Maintenance Plans</Link></li>
                            <li><Link to="/track" className="hover:text-accent transition-colors">Track Repair</Link></li>
                            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            <li><Link to="/register" className="hover:text-accent transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-display font-semibold text-text-primary mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-start gap-2.5">
                                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                                <span>Yaounde, Cameroon</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone size={14} className="text-primary shrink-0" />
                                <a href="tel:+237600000000" className="hover:text-accent transition-colors">+237 6XX XXX XXX</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail size={14} className="text-primary shrink-0" />
                                <a href="mailto:joonsclare@gmail.com" className="hover:text-accent transition-colors">joonsclare@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
                    <p>&copy; {new Date().getFullYear()} TechFix Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
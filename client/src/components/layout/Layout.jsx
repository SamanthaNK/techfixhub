import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
    const { pathname } = useLocation()
    const hideFooter = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            <Navbar />
            <main className="flex-1 pt-16" id="main-content">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
        </div>
    )
}
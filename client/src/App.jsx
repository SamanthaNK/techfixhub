import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Training from './pages/Training'
import TrainingDetail from './pages/TrainingDetail'
import Maintenance from './pages/Maintenance'
import RepairTracking from './pages/RepairTracking'
import Contact from './pages/Contact'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import CustomerDashboard from './pages/dashboard/CustomerDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import MyRepairs from './pages/dashboard/MyRepairs'
import SubmitRepair from './pages/dashboard/SubmitRepair'
import MyEnrollments from './pages/dashboard/MyEnrollments'
import MyAppointments from './pages/dashboard/MyAppointments'
import BookAppointment from './pages/dashboard/BookAppointment'
import ManageRepairs from './pages/dashboard/admin/ManageRepairs'
import ManageUsers from './pages/dashboard/admin/ManageUsers'
import ManageTraining from './pages/dashboard/admin/ManageTraining'
import ManageInventory from './pages/dashboard/admin/ManageInventory'
import ManageAppointments from './pages/dashboard/admin/ManageAppointments'
import ManageMessages from './pages/dashboard/admin/ManageMessages'
import Spinner from './components/ui/Spinner'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-bg"><Spinner /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-bg"><Spinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!['admin', 'super_admin'].includes(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="training" element={<Training />} />
        <Route path="training/:id" element={<TrainingDetail />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="track" element={<RepairTracking />} />
        <Route path="contact" element={<Contact />} />

        <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        <Route path="dashboard" element={<ProtectedRoute>{user?.role === 'admin' || user?.role === 'super_admin' ? <AdminDashboard /> : <CustomerDashboard />}</ProtectedRoute>} />
        <Route path="dashboard/repairs" element={<ProtectedRoute><MyRepairs /></ProtectedRoute>} />
        <Route path="dashboard/repairs/submit" element={<ProtectedRoute><SubmitRepair /></ProtectedRoute>} />
        <Route path="dashboard/enrollments" element={<ProtectedRoute><MyEnrollments /></ProtectedRoute>} />
        <Route path="dashboard/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="dashboard/appointments/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />

        <Route path="admin/repairs" element={<AdminRoute><ManageRepairs /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="admin/messages" element={<AdminRoute><ManageMessages /></AdminRoute>} />
        <Route path="admin/training" element={<AdminRoute><ManageTraining /></AdminRoute>} />
        <Route path="admin/inventory" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="admin/appointments" element={<AdminRoute><ManageAppointments /></AdminRoute>} />

        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="font-display text-6xl font-bold text-accent">404</h1>
            <p className="text-text-muted mt-3 text-lg">Page not found.</p>
            <a href="/" className="mt-6 btn-primary">Back to Home</a>
          </div>
        } />
      </Route>
    </Routes>
  )
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#04471C',
                            color: '#E5E7EB',
                            border: '1px solid rgba(5,140,66,0.4)',
                            fontFamily: 'DM Sans, sans-serif',
                            borderRadius: '0px',
                        },
                        success: { iconTheme: { primary: '#16DB65', secondary: '#04471C' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#04471C' } },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
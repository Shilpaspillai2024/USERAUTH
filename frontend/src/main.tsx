import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminApp from './AdminApp.tsx'

const isAdminMode = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}

    {isAdminMode ? <AdminApp /> : <App />}
  </StrictMode>,
)

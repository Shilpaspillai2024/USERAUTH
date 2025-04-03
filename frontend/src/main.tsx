import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'
//import App from './App.tsx'
//import AdminApp from './AdminApp.tsx'
import AppWrapper from './AppWrapper.tsx';

//const isAdminMode = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
   <Router>
    {/* {isAdminMode ? <AdminApp /> : <App />} */}
    <AppWrapper/>
    </Router>
  </StrictMode>,
)

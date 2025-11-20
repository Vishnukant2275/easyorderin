import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Admin from '../layouts/Admin'
import PageNotFound from '../pages/PageNotFound'
// Import your admin pages
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Restaurants from '../pages/admin/Restaurants'
import InvoiceGenerator from '../pages/admin/InvoiceGenerator'
import HardcopyRegister from '../pages/admin/HardcopyRegister'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminSignup from '../pages/admin/AdminSignup'
// import Settings from '../pages/admin/Settings'

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        {/* Nested routes that will render inside Admin's Outlet */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="users" element={<Users />} />
        <Route path="revenue" element={<InvoiceGenerator />} />
        <Route path="analytics" element={<HardcopyRegister />} />
        <Route path='login' element={<AdminLogin/>}/>
         <Route path='signup' element={<AdminSignup/>}/>
        {/* <Route path="settings" element={<Settings />} /> */}
        
        {/* Catch-all route for admin 404 */}
        <Route path="*" element={<PageNotFound homeUrl='/admin' buttonText='Take me back'/>} />
      </Route>
    </Routes>
  )
}

export default AdminRouter
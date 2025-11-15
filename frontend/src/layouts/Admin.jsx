import React from 'react'
import { Outlet } from "react-router-dom";
import AdminHeader from '../pages/admin/AdminHeader';
import AdminFooter from '../pages/admin/AdminFooter';
const Admin = () => {
  return (
    <div>
      <AdminHeader/>
      <Outlet/>
      <AdminFooter/>
    </div>
  )
}

export default Admin

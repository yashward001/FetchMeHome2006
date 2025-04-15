import React from 'react'
import AdminNavBar from "./AdminNavBar";
import AdminScreen from './AdminScreen';
import Footer from "../Footer/Footer"

const AdminPanel = () => {
  return (
    <div>
      <AdminNavBar/>
      <AdminScreen/>
      <Footer/>
    </div>
  )
}

export default AdminPanel

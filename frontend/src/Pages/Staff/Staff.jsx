import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateStaff from '../../components/StaffPages/CreateStaff';
import CreateStore from '../../components/StaffPages/CreateStore';
import Header from '../../components/SideBar/Header'

const Staff = () => {

  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="create-staff" element={< CreateStaff />} />
        <Route path="create-store" element={< CreateStore />} />
      </Routes>
    </div>
  )
}

export default Staff;

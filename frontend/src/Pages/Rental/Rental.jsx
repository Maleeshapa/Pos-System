import React from 'react'
import { Route, Routes } from 'react-router-dom';
import NewRental from '../../components/RentalPages/NewRental';
import RentalHistory from '../../components/RentalPages/RentalHistory';
import Header from '../../components/SideBar/Header'

const Rental = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="new" element={<NewRental />} />
        <Route path="history" element={<RentalHistory />} />
      </Routes>
    </div>
  )
}

export default Rental
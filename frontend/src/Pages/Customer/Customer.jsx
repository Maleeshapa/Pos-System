import React from 'react'
import { Route, Routes } from 'react-router-dom';
import './Customer.css'
import Header from '../../components/SideBar/Header'

import CustomerList from '../../components/CustomerPages/CustomerList'
import JobDuePayment from '../../components/CustomerPages/JobDuePayment'
import SaleDuePayment from '../../components/CustomerPages/SaleDuePayment'

const Customer = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
        <Routes>
            <Route path='/customer-list' element={<CustomerList/>} />
            <Route path='/jobDue-payment' element={<JobDuePayment/>} />
            <Route path='/sale-due-payment' element={<SaleDuePayment/>} />
        </Routes>
    </div>
  )
}

export default Customer
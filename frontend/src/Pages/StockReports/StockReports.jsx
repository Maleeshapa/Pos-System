import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CurrentStock from '../../components/StockReportPages/CurrentStock'
import StockHistory from '../../components/StockReportPages/StockHistory'
import Header from '../../components/SideBar/Header'

function StockReports() {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="current-stock" element={< CurrentStock />} />
        <Route path="stock-history" element={< StockHistory />} />

      </Routes>
    </div>

  )
}

export default StockReports
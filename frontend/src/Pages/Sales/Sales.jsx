import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NewSales from '../../components/SalesPages/NewSales';
import SalesHistory from '../../components/SalesPages/SalesHistory';
import Header from '../../components/SideBar/Header'

const Sales = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path="new" element={<NewSales />} />
        <Route path="history" element={<SalesHistory />} />
      </Routes>
    </div>
  );
};

export default Sales;
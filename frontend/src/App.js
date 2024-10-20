import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar/SideBar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Sales from './Pages/Sales/Sales';
import Customer from './Pages/Customer/Customer';
import Product from './Pages/Product/Product';
import GRN from './Pages/GRN/GRN';
import Stock from './Pages/Stock/Stock';
import Staff from './Pages/Staff/Staff';
import StockReports from './Pages/StockReports/StockReports';
import SalesReports from './Pages/SalesReport/SalesReports';
import Supplier from './Pages/Supplier/Supplier';
import Rental from './Pages/Rental/Rental';
import Login from './Pages/Login';
import Header from './components/SideBar/Header';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase() === '/login';

  return (
    <div>
      <div className='Header-show'>{!isLoginPage && <Header />}</div>
      <div className="d-flex flex-grow-1">
        {!isLoginPage && <SideBar />}
        <div className="d-flex flex-column flex-grow-1" style={{ margin: '0px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sales/*" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/rental/*" element={<ProtectedRoute><Rental /></ProtectedRoute>} />
            <Route path="/customer/*" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
            <Route path="/product/*" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="/grn/*" element={<ProtectedRoute><GRN /></ProtectedRoute>} />
            <Route path="/stock/*" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/supplier/*" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
            <Route path="/sales-reports/*" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
            <Route path="/stock-reports/*" element={<ProtectedRoute><StockReports /></ProtectedRoute>} />
            <Route path="/staff/*" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
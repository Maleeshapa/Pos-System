import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Boxes, Truck, FileText, Menu } from 'lucide-react';
import './SideBar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userStatus');

        navigate('/login');
    };

    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;

        if (payload.exp < now) {
            handleLogout();
        }
    };

    useEffect(() => {
        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    });

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSubmenuToggle = (index) => {
        if (activeSubmenu === index) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(index);
        }
    };

    const menuItems = [
        {
            title: 'Sales Invoice',
            icon: <ShoppingCart size={20} />,
            path: '/sales',
            submenus: [
                { title: 'Create Sale Invoice', path: '/sales/new' },
                { title: 'Sales History', path: '/sales/history' },
            ]
        },
        /*{
            title: 'Rental Invoice',
            icon: <ShoppingCart size={20} />,
            path: '/sales',
            submenus: [
                { title: 'Create Rental Invoice', path: '/Rental/new' },
                { title: 'Sales History', path: '/Rental/history' },
            ]
        },*/
        {
            title: 'Customer',
            icon: <Users size={20} />,
            path: '/customer',
            submenus: [
                { title: 'Customer List', path: '/customer/customer-list' },
                // { title: 'Job Due Payment', path: '/customer/jobDue-payment' },
                // { title: 'Sale Due Payment', path: '/customer/sale-due-payment' },
            ]
        },
        {
            title: 'Product',
            icon: <Package size={20} />,
            path: '/product',
            submenus: [
                { title: 'Create Product', path: '/product/create' },
                { title: 'Product Category', path: '/product/category' },
                { title: 'Product List', path: '/product/product-list' }
            ]
        },
        // {
        //     title: 'GRN',
        //     icon: <File size={20} />,
        //     path: '/grn',
        //     submenus: [
        //         { title: 'Create GRN', path: '/grn/create-grn' },
        //         { title: 'GRN List', path: '/grn/list-grn' },
        //         { title: 'GRN Search', path: '/grn/search-grn' }
        //     ]
        // },
        {
            title: 'Stock',
            icon: <Boxes size={20} />,
            path: '/stock',
            submenus: [
                { title: 'Add New Stock', path: '/stock/new-stock' },
                { title: 'Create Product Return', path: '/stock/create' },
                { title: 'Returned Product List', path: '/stock/list' },
            ]
        },
        {
            title: 'Supplier',
            icon: <Truck size={20} />,
            path: '/Supplier',
            submenus: [
                { title: 'Supplier Details', path: '/supplier/supplier' },
                // { title: 'Supplier Payment', path: '/supplier/supplier-payments' },
            ]
        },
        // {
        //     title: 'Finance',
        //     icon: <BadgeDollarSignIcon size={20} />,
        //     path: '/finance',
        //     submenus: [
        //         { title: 'Daily Summary', path: '/finance/daily' },
        //         { title: 'Financial finance', path: '/finance/financial' },
        //         { title: 'Product Performance', path: '/finance/product' }
        //     ]
        // }, 
        {
            title: 'Sales Reports',
            icon: <FileText size={20} />,
            path: '/sales-reports',
            submenus: [
                { title: 'Daily Summary', path: '/sales-reports/daily-summary' },
                { title: 'Sales History', path: '/sales-reports/sales-history' },

            ]
        }, {
            title: 'Stock Reports',
            icon: <FileText size={20} />,
            path: '/stock-reports',
            submenus: [
                { title: 'Current Stock', path: '/stock-reports/current-stock' },
                { title: 'Stock History', path: '/stock-reports/stock-history' },
            ]
        },
        {
            title: 'Staff',
            icon: <FileText size={20} />,
            path: '/staff',
            submenus: [
                { title: 'Create Staff', path: '/staff/create-staff' },
                { title: 'Departments', path: '/staff/create-store' },
            ]
        },
    ];

    return (
        <>

            <button
                className="toggle-btn d-md-none rounded bg-warning mr-4"
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    zIndex: 1030,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Menu size={24} />
            </button>
            <div className="scrolling-sidebar">
                <nav className={`col-md-3 col-lg-2 d-md-block bg-color sidebar ${isCollapsed ? 'collapsed' : ''}`}
                    style={{
                        transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <div className="text-center mt-2 p-2">
                        <h1>LOGO</h1>
                    </div>
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <div onClick={() => handleSubmenuToggle()} style={{ cursor: 'pointer' }}>
                                    <Link to={'/'} className="nav-link d-flex align-items-center">
                                        <span className="me-2"><LayoutDashboard size={20} /></span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">Dashboard</span>
                                    </Link>
                                </div>
                            </li>
                            {menuItems.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <div className="nav-link d-flex align-items-center" onClick={() => handleSubmenuToggle(index)} style={{ cursor: 'pointer' }} >
                                        <span className="me-2">{item.icon}</span>
                                        <span className="fs-8 p-2 menu-link d-md-inline">{item.title}</span>
                                    </div>
                                    <div className={`submenu ${activeSubmenu === index ? 'expanded' : 'collapsed'}`}>
                                        <ul className="nav flex-column ms-3">
                                            {item.submenus.map((submenu, subIndex) => (
                                                <li key={subIndex} className="nav-item nav-sub">
                                                    <Link to={submenu.path} className="nav-link">{submenu.title}</Link>
                                                </li>

                                            ))}

                                        </ul>

                                    </div>

                                </li>

                            ))}

                        </ul>

                    </div>
                    <div className="d-flex justify-content-center mt-auto p-5">
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    </div>
                </nav>

            </div>
        </>
    );
};

export default Sidebar;
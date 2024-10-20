import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import Switch from './Switch';

const Header = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMaster, setIsMaster] = useState(false);

  const trialStartDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
  const trialDuration = 30;

  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + trialDuration);

  const remainingDays = Math.max(0, Math.ceil((trialEndDate - currentTime) / (1000 * 60 * 60 * 24)));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if the logged-in user is "master"
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userName === 'master') {
      setIsMaster(true);
    }
  }, []);

  const handleNewSaleClick = () => {
    navigate('/sales/new');
  };

  const formattedDate = currentTime.toLocaleDateString('en-SL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-secondary text-light">
      <div className="d-flex align-items-center">
        {isMaster && <Switch />} 
      </div>
      <div className="d-flex align-items-center">
        <span className="trial-message text-white me-3 d-none d-md-block">
          {remainingDays > 0
            ? `Trial Version: Only ${remainingDays} day${remainingDays > 1 ? 's' : ''} remaining`
            : 'Trial Expired'}
        </span>
        <div className="text-light">
          <div className='date'>
            <span>{formattedDate}</span>
          </div>
          <div className='time'>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
      <button className="btn btn-danger" onClick={handleNewSaleClick}>
        New Sale
      </button>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import './Switch.css';
import config from '../../config';

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/switch`);
      if (!response.ok) {
        throw new Error('Failed to fetch switch status');
      }
      const { status } = await response.json();
      setIsChecked(status);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);

    try {
      const response = await fetch(`${config.BASE_URL}/api/switch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update switch status');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <label >
        <input
          className='toggle-checkbox'
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div class="toggle-slot">
          <div class="sun-icon-wrapper">
            <div class="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
          </div>
          <div class="toggle-button"></div>
          <div class="moon-icon-wrapper">
            <div class="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default Switch;

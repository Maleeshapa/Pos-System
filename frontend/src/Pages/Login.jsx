import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

function Login() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [switchStatus, setSwitchStatus] = useState(null);
  const navigate = useNavigate();

  // Fetch switch status from the 'switch' table
  useEffect(() => {
    const fetchSwitchStatus = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/switch`);
        setSwitchStatus(response.data.status);
      } catch (err) {
        setError('Failed to fetch system status. Please try again later.');
      }
    };
    fetchSwitchStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (switchStatus === null) {
        setError('Unable to verify system status. Please try again.');
        return;
      }

      // Fetch user data by login
      const response = await axios.post(`${config.BASE_URL}/userLogin`, { userName, userPassword });
      const { token, user } = response.data;

      // Check if the user's status is active
      if (user.userStatus && token === 'active') {
        setError('Your account is inactive. Please contact support.');
        return;
      }

      // If switch is off and the user is not 'master', deny login
      if (switchStatus === false && user.userName !== 'master') {
        setError('NM Digital Solutions Kandy එකට කෝල් කරන්න');
        return;
      }

      // Verify if the token is still valid by decoding it
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp < currentTime) {
        setError('Session expired. Please log in again.');
        return;
      }

      // If all conditions are met, allow login
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');

    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setError('Access denied. Please contact the administrator.');
        } else if (error.response.status === 404) {
          setError('User not found.');
        } else if (error.response.status === 401) {
          setError('Incorrect password.');
        } else {
          setError(error.response.data.error || 'An error occurred during login.');
        }
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 rounded shadow-lg w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1>Pos System</h1>
        </div>
        <h2 className="text-center mb-4">Welcome!</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="#signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

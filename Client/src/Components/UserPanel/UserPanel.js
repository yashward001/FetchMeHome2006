import React, { useState, useEffect } from 'react';
import UserScreen from './UserScreen';
import "../../Styles/UserPanel.css";
import { useNavigate } from 'react-router-dom';

const UserPanel = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="panel-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-panel-container">
      <div className="user-panel-header">
        <div className="user-welcome">
          <h1>Welcome, {userData?.name || 'Pet Lover'}!</h1>
          <p>Manage your pet adoption activities and account settings</p>
        </div>
      </div>
      
      <UserScreen />
      
      <div className="user-panel-footer">
        <p>Have questions or need help? <a href="/faq">Visit our FAQ page</a></p>
      </div>
    </div>
  );
};

export default UserPanel;
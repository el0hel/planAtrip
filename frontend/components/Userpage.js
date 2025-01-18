// all necessary imports
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import '../styles/Userpage.css';

// functional component to allow for viewing of user details  
const UserPage = () => {
const [user, setUser] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="user-page">
        <div className="profile-container">
          <h1>Traveller's Profile</h1>
          <div className="user-details">
            <div className="detail-item">
              <label>Username:</label>
              <input
                type="text"
                value={user.username}
                readOnly
              /> 
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <input
                type="email"
                value={user.email}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

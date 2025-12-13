import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. State: Variables that update as you type
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // 2. Hooks: Tools to navigate and access global data
  const { login } = useContext(AuthContext); // Get the login function from our "Brain"
  const navigate = useNavigate(); // Tool to change pages

  // 3. Handle Input Change
  // When you type, this updates the specific field (email or password) in State
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from reloading
    try {
      // Send data to Backend
      const res = await axios.post('/api/auth/login', formData);
      
      // If successful, save token and move to Dashboard
      login(res.data.token);
      navigate('/dashboard'); 
    } catch (err) {
      // If error, show the message from backend
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    // OUTER CONTAINER: Takes full screen height and centers content
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      backgroundColor: '#202322' 
    }}>
      
      {/* CARD: The white box holding the form */}
      <div style={{ 
        padding: '40px', 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle drop shadow
        color: '#333'
      }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login to UniGo</h2>
        
        {error && <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '16px', 
            cursor: 'pointer' 
          }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
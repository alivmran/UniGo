import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostRide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seatsAvailable: 3,
    price: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/rides', formData, config);
      alert('Ride Posted Successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error posting ride');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '40px' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ maxWidth: '600px', margin: 'auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Post a New Ride</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div style={formGroup}>
            <label style={labelStyle}>Origin (From):</label>
            <input type="text" name="origin" required onChange={handleChange} style={inputStyle} placeholder="e.g. DHA Phase 6" />
          </div>

          <div style={formGroup}>
            <label style={labelStyle}>Destination (To):</label>
            <input type="text" name="destination" required onChange={handleChange} style={inputStyle} placeholder="e.g. SZABIST Campus 100" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Date:</label>
              <input type="date" name="date" required onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Time:</label>
              <input type="time" name="time" required onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Seats Available:</label>
              <input type="number" name="seatsAvailable" min="1" max="6" value={formData.seatsAvailable} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Price (Rs):</label>
              <input type="number" name="price" required onChange={handleChange} style={inputStyle} placeholder="500" />
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: '#202322', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '18px', 
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            Publish Ride
          </button>
        </form>
      </div>
    </div>
  );
};

const formGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

export default PostRide;
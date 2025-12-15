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
    <div style={{ minHeight: '100vh', backgroundColor: '#2E2D2D', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '550px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', 
        padding: '40px',
        position: 'relative'
      }}>
        
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' 
          }}
        >
          ✕
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#222', fontSize: '28px' }}>Post a New Ride</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Origin (From):</label>
            <input type="text" name="origin" required onChange={handleChange} style={inputStyle} placeholder="e.g. DHA Phase 6" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Destination (To):</label>
            <input type="text" name="destination" required onChange={handleChange} style={inputStyle} placeholder="e.g. SZABIST Campus 100" />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date:</label>
              <input type="date" name="date" required onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Time:</label>
              <input type="time" name="time" required onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Seats:</label>
              <input type="number" name="seatsAvailable" min="1" max="6" value={formData.seatsAvailable} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price (Rs):</label>
              <input type="number" name="price" required onChange={handleChange} style={inputStyle} placeholder="500" />
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: '#00d4ff', 
            color: '#000', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 212, 255, 0.3)'
          }}>
            Publish Ride
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#f9f9f9' };

export default PostRide;
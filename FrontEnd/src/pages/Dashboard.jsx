import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  // 1. Fetch Rides when the page loads
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get('/api/rides');
        setRides(res.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };
    fetchRides();
  }, []);

  // 2. Handle Booking Logic
  const handleBookRide = async (rideId) => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/bookings', { rideId }, config);
      alert("Booking Request Sent! Wait for driver approval.");
    } catch (err) {
      alert(err.response?.data?.msg || "Booking Failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        backgroundColor: '#202322', 
        color: 'white', 
        padding: '15px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0 }}>UniGo</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user && user.name}</span>
          
          {/* Requests Button (For Drivers) */}
          <button 
            onClick={() => navigate('/ride-requests')}
            style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Requests
          </button>

          {/* My Bookings Button */}
          <button 
            onClick={() => navigate('/my-bookings')}
            style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            My Bookings
          </button>

          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1>Available Rides</h1>
          <button 
            onClick={() => navigate('/post-ride')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            + Post a Ride
          </button>
        </div>

        {/* Ride List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          
          {rides.length === 0 ? (
            <p>No rides available right now.</p>
          ) : (
            rides.map((ride) => (
              <div key={ride._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#202322' }}>{ride.origin} ➔ {ride.destination}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>📅 {ride.date} at {ride.time}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold' }}>
                  <span style={{ color: '#28a745' }}>Rs. {ride.price}</span>
                  <span style={{ color: ride.seatsAvailable > 0 ? '#007bff' : 'red' }}>
                    {ride.seatsAvailable} seats left
                  </span>
                </div>

                {user && user.id === ride.driver ? (
                  <button disabled style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }}>
                    Your Ride
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBookRide(ride._id)}
                    style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#202322', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Book Seat
                  </button>
                )}
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
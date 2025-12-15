import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  // 1. Fetch Rides
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

  const filteredRides = rides.filter((ride) => {
    if (searchTerm === "") return true;
    return (
      ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 3. Actions
  const handleBookRide = async (rideId) => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/bookings', { rideId }, config);
      alert("Booking Request Sent!");
    } catch (err) {
      alert(err.response?.data?.msg || "Booking Failed");
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm("Delete this ride?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`/api/rides/${rideId}`, config);
      setRides(rides.filter(ride => ride._id !== rideId));
    } catch (err) {
      alert("Error deleting ride");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      
      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#202322', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>UniGo</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user && user.name}</span>
          <button onClick={() => navigate('/ride-requests')} style={navBtnStyle}>Requests</button>
          <button onClick={() => navigate('/my-bookings')} style={{...navBtnStyle, backgroundColor: '#555'}}>My Bookings</button>
          <button onClick={handleLogout} style={{...navBtnStyle, backgroundColor: '#d9534f'}}>Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
          <h1>Available Rides</h1>
          <button onClick={() => navigate('/post-ride')} style={postBtnStyle}>+ Post a Ride</button>
        </div>

        {/* --- NEW: SEARCH BAR --- */}
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Search location (e.g. Clifton, SZABIST)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {/* RIDE GRID - Uses 'filteredRides' instead of 'rides' */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          
          {filteredRides.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
              No rides found matching "{searchTerm}"
            </p>
          ) : (
            filteredRides.map((ride) => (
              <div key={ride._id} style={cardStyle}>
                <h3 style={{ marginTop: 0, color: '#202322' }}>{ride.origin} ➔ {ride.destination}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>📅 {ride.date} at {ride.time}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold' }}>
                  <span style={{ color: '#28a745' }}>Rs. {ride.price}</span>
                  <span style={{ color: ride.seatsAvailable > 0 ? '#007bff' : 'red' }}>
                    {ride.seatsAvailable} seats left
                  </span>
                </div>

                {user && user.id === ride.driver ? (
                  <button onClick={() => handleDeleteRide(ride._id)} style={deleteBtnStyle}>Delete Ride</button>
                ) : (
                  <button onClick={() => handleBookRide(ride._id)} style={bookBtnStyle}>Book Seat</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const navBtnStyle = { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const postBtnStyle = { padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const deleteBtnStyle = { width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const bookBtnStyle = { width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#202322', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Dashboard;
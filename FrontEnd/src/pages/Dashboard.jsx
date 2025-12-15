import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, loadUser } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) loadUser();
  }, []);

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
    const rideDate = new Date(ride.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rideDate < today) return false;

    if (searchTerm === "") return true;
    return (
      ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
    <div style={{ minHeight: '100vh', backgroundColor: '#2E2D2D' }}>
      
      {/* NAVBAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '45px', objectFit: 'contain' }} />
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '600', letterSpacing: '1px' }}>UniGo</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          
          {/* Simple Welcome */}
            <span 
                  onClick={() => navigate('/profile')} 
                  style={{ fontSize: '18px', color: '#e0e0e0', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Welcome (View Profile)
             </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button disabled style={{ ...navBtnStyle, backgroundColor: '#0056b3', cursor: 'default' }}>Dashboard</button>
            <button onClick={() => navigate('/ride-requests')} style={navBtnStyle}>Requests</button>
            <button onClick={() => navigate('/my-bookings')} style={{...navBtnStyle, backgroundColor: '#555'}}>My Bookings</button>
            <button onClick={handleLogout} style={{...navBtnStyle, backgroundColor: '#d9534f'}}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1100px', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '32px', margin: 0 }}>Available Rides</h1>
          <button onClick={() => navigate('/post-ride')} style={postBtnStyle}>+ Post a Ride</button>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Search location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredRides.map((ride) => (
              <div key={ride._id} style={cardStyle}>
                
                <div style={{ flex: 1 }}>
                    <h3 style={cardHeaderStyle}>{ride.origin} <span style={{ color: '#888' }}>➔</span> {ride.destination}</h3>
                    
                    <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                        <strong>Driver:</strong> {ride.driverName} 
                        <span style={{ 
                            marginLeft: '10px', 
                            color: ride.driverRating === 'New' ? '#f39c12' : '#28a745', 
                            fontWeight: 'bold' 
                        }}>
                            ★ {ride.driverRating}
                        </span>
                    </div>

                    <div style={cardMetaStyle}>
                        <span>📅 {ride.date}</span>
                        <span>⏰ {ride.time}</span>
                    </div>
                    
                    <div style={{ height: '1px', backgroundColor: '#eee', margin: '15px 0' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', marginBottom: '15px' }}>
                        <span style={{ color: '#28a745', fontSize: '18px' }}>Rs. {ride.price}</span>
                        <span style={{ color: ride.seatsAvailable > 0 ? '#007bff' : 'red', fontSize: '14px' }}>
                            {ride.seatsAvailable} seats left
                        </span>
                    </div>
                </div>

                {/* Compare user.id with ride.driver._id */}
                {user && ride.driver && user.id === ride.driver._id ? (
                  <button onClick={() => handleDeleteRide(ride._id)} style={deleteBtnStyle}>Delete Ride</button>
                ) : (
                  <button onClick={() => handleBookRide(ride._id)} style={bookBtnStyle}>Book Seat</button>
                )}
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const navStyle = { backgroundColor: '#1a1a1a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' };
const navBtnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' };
const postBtnStyle = { padding: '14px 28px', backgroundColor: '#00d4ff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,212,255, 0.3)' };
const searchStyle = { width: '100%', padding: '18px', fontSize: '16px', borderRadius: '10px', border: 'none', backgroundColor: '#3E3E3E', color: 'white', outline: 'none' };
const cardStyle = { 
    backgroundColor: 'white', 
    padding: '25px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)', 
    color: '#333',
    display: 'flex',          
    flexDirection: 'column',  
    justifyContent: 'space-between', 
    height: '100%',           
    boxSizing: 'border-box'   
};
const cardHeaderStyle = { marginTop: 0, marginBottom: '5px', color: '#222', fontSize: '18px', lineHeight: '1.4' };
const cardMetaStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: '#555', fontSize: '14px' };
const deleteBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const bookBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#222', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

export default Dashboard;
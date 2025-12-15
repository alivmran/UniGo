import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('/api/auth/profile', config);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div style={{ color: 'white', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2E2D2D' }}>
      
      {/* NAVBAR */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="Logo" style={{ height: '45px', objectFit: 'contain' }} />
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '600', letterSpacing: '1px' }}>UniGo</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <span style={{ fontSize: '18px', color: '#e0e0e0', fontWeight: '500' }}>Welcome</span>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={() => navigate('/dashboard')} style={navBtnStyle}>Dashboard</button>
             <button onClick={() => navigate('/ride-requests')} style={navBtnStyle}>Requests</button>
             <button onClick={() => navigate('/my-bookings')} style={navBtnStyle}>My Bookings</button>
             <button onClick={handleLogout} style={{...navBtnStyle, backgroundColor: '#d9534f'}}>Logout</button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '8px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>← Back to Dashboard</button>
        
        <h1 style={{ color: 'white', marginBottom: '30px' }}>My Profile</h1>

        {/* Info */}
        <div style={cardStyle}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>{profile.user.name}</h2>
                <p style={{ margin: '5px 0', color: '#777' }}>University ID: {profile.user.universityID}</p>
                <p style={{ margin: '5px 0', color: '#777' }}>Email: {profile.user.email}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center' }}>
                <div style={statBox}>
                    <h3 style={{ margin: 0, fontSize: '32px', color: '#007bff' }}>{profile.stats.ridesTaken}</h3>
                    <span style={{ color: '#555' }}>Rides Taken</span>
                </div>
                <div style={statBox}>
                    <h3 style={{ margin: 0, fontSize: '32px', color: '#28a745' }}>{profile.stats.ridesGiven}</h3>
                    <span style={{ color: '#555' }}>Rides Given</span>
                </div>
                <div style={statBox}>
                    <h3 style={{ margin: 0, fontSize: '32px', color: '#f39c12' }}>{profile.stats.rating}</h3>
                    <span style={{ color: '#555' }}>Driver Rating</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const navStyle = { backgroundColor: '#1a1a1a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' };
const navBtnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' };
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const statBox = { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' };

export default Profile;
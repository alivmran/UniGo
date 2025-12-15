import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RideRequests = () => {
  const { logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('/api/bookings/incoming-requests', config);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus }, config);
      alert(`Status updated to ${newStatus}`);
      fetchRequests(); 
    } catch (err) {
      alert("Error updating status");
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
          <span 
              onClick={() => navigate('/profile')} 
              style={{ fontSize: '18px', color: '#e0e0e0', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}
          >
             Welcome (View Profile)
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={() => navigate('/dashboard')} style={navBtnStyle}>Dashboard</button>
             <button disabled style={{...navBtnStyle, backgroundColor: '#0056b3', cursor: 'default'}}>Requests</button>
             <button onClick={() => navigate('/my-bookings')} style={{...navBtnStyle, backgroundColor: '#555'}}>My Bookings</button>
             <button onClick={handleLogout} style={{...navBtnStyle, backgroundColor: '#d9534f'}}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1100px', margin: 'auto' }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>Incoming Ride Requests</h1>

        {requests.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '18px' }}>No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#222' }}>
                  Ride: {req.ride.origin} ➔ {req.ride.destination}
              </h3>
              <div style={{ color: '#555', marginBottom: '15px' }}>
                  <p style={{ margin: '5px 0' }}><strong>Passenger:</strong> {req.passenger.name} ({req.passenger.universityID})</p>
                  <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: '#007bff' }}>{req.status}</span></p>
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', gap: '10px' }}>
                {req.status === 'Requested' && (
                  <>
                    <button onClick={() => handleStatusUpdate(req._id, 'Confirmed')} style={acceptBtn}>Accept</button>
                    <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} style={rejectBtn}>Reject</button>
                  </>
                )}
                {req.status === 'Confirmed' && (
                  <button onClick={() => handleStatusUpdate(req._id, 'Completed')} style={completeBtn}>
                    Mark as Completed
                  </button>
                )}
                {req.status === 'Completed' && (
                  <span style={{ color: '#666', fontStyle: 'italic' }}>
                    {req.rating > 0 ? `Passenger rated: ${req.rating} ★` : "Waiting for passenger rating..."}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const navStyle = { backgroundColor: '#1a1a1a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' };
const navBtnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const acceptBtn = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const rejectBtn = { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const completeBtn = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

export default RideRequests;
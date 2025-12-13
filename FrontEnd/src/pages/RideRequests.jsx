import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RideRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch requests when page loads
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

  // Handle Accept/Reject
  const handleStatusUpdate = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`/api/bookings/${bookingId}`, { status: newStatus }, config);
      alert(`Booking ${newStatus}!`);
      fetchRequests(); // Refresh the list
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '8px 12px', cursor: 'pointer' }}>← Back</button>
        <h1>Incoming Ride Requests</h1>

        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} style={{ backgroundColor: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>Ride: {req.ride.origin} ➔ {req.ride.destination}</h3>
              <p><strong>Passenger:</strong> {req.passenger.name} ({req.passenger.universityID})</p>
              <p><strong>Status:</strong> {req.status}</p>
              
              {req.status === 'Requested' && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleStatusUpdate(req._id, 'Confirmed')}
                    style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                    style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideRequests;
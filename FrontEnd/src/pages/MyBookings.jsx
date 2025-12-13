import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Fetch bookings for the logged-in user
        const res = await axios.get('/api/bookings/my-bookings', config);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '20px' }}>
      
      {/* Header with Back Button */}
      <div style={{ maxWidth: '800px', margin: 'auto', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            padding: '8px 12px', 
            cursor: 'pointer', 
            border: 'none', 
            backgroundColor: '#ddd', 
            borderRadius: '4px' 
          }}>
            ← Back
        </button>
        <h1 style={{ margin: 0, color: '#202322' }}>My Bookings</h1>
      </div>

      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        {bookings.length === 0 ? (
          <p>You haven't booked any rides yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: `5px solid ${booking.status === 'Confirmed' ? '#28a745' : '#ffc107'}`
            }}>
              <div>
                {/* Check if ride details exist (in case driver deleted it) */}
                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  {booking.ride ? `${booking.ride.origin} ➔ ${booking.ride.destination}` : "Ride Details Unavailable"}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Status: <span style={{ 
                    fontWeight: 'bold', 
                    color: booking.status === 'Confirmed' ? 'green' : (booking.status === 'Rejected' ? 'red' : 'orange') 
                  }}>
                    {booking.status}
                  </span>
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                 <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{booking.ride ? `Rs. ${booking.ride.price}` : '-'}</p>
                 <span style={{ fontSize: '12px', color: '#999' }}>{booking.ride ? `${booking.ride.date}` : ''}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
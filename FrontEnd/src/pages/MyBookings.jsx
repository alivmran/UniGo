import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('/api/bookings/my-bookings', config);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  // NEW: Handle Cancel
  const handleCancelBooking = async (bookingId) => {
    if(!window.confirm("Cancel this booking?")) return;

    try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/api/bookings/${bookingId}`, config);
        
        // Remove from list immediately
        setBookings(bookings.filter(b => b._id !== bookingId));
        alert("Booking cancelled");
    } catch (err) {
        alert("Error cancelling booking");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '20px' }}>
      
      <div style={{ maxWidth: '800px', margin: 'auto', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '8px 12px', cursor: 'pointer', border: 'none', backgroundColor: '#ddd', borderRadius: '4px' }}>
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
                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                  {booking.ride ? `${booking.ride.origin} ➔ ${booking.ride.destination}` : "Ride Details Unavailable"}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Status: <span style={{ fontWeight: 'bold', color: booking.status === 'Confirmed' ? 'green' : 'orange' }}>
                    {booking.status}
                  </span>
                </p>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <span style={{ fontWeight: 'bold' }}>{booking.ride ? `Rs. ${booking.ride.price}` : '-'}</span>
                 
                 {/* Cancel Button */}
                 <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                 >
                    Cancel
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
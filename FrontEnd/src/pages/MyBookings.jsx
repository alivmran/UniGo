import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const { logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchBookings();
  }, []);

  const handleRateRide = async (bookingId, ratingValue) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.post(`/api/bookings/${bookingId}/rate`, { rating: ratingValue }, config);
        alert("Thanks for rating!");
        window.location.reload(); 
    } catch (err) {
        alert("Error submitting rating");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if(!window.confirm("Cancel this booking?")) return;
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/api/bookings/${bookingId}`, config);
        setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
        alert("Error cancelling booking");
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
            <button onClick={() => navigate('/ride-requests')} style={navBtnStyle}>Requests</button>
            <button disabled style={{...navBtnStyle, backgroundColor: '#333', cursor: 'default', border: '1px solid #555'}}>My Bookings</button>
            <button onClick={handleLogout} style={{...navBtnStyle, backgroundColor: '#d9534f'}}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1100px', margin: 'auto' }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>My Bookings</h1>

        {bookings.length === 0 ? (
           <p style={{ color: '#aaa', fontSize: '18px' }}>You haven't booked any rides yet.</p>
        ) : (
           bookings.map((booking) => (
            <div key={booking._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#222' }}>
                          {booking.ride ? `${booking.ride.origin} ➔ ${booking.ride.destination}` : "Ride Unavailable"}
                        </h3>
                        {/* Display Driver Name */}
                        <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}>
                            <strong>Driver:</strong> {booking.ride && booking.ride.driver ? booking.ride.driver.name : 'Unknown'}
                        </p>
                        <p style={{ margin: 0, color: '#555' }}>
                            Status: <strong style={{ color: booking.status === 'Confirmed' ? 'green' : (booking.status === 'Rejected' ? 'red' : '#e67e22') }}>{booking.status}</strong>
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '18px', color: '#28a745' }}>
                            {booking.ride ? `Rs. ${booking.ride.price}` : ''}
                        </p>
                    </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#eee', margin: '15px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {booking.status === 'Completed' ? (
                    booking.rating > 0 ? (
                        <span style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '16px' }}>
                        You rated: {booking.rating} ★
                        </span>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#555' }}>Rate Driver: </span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => handleRateRide(booking._id, star)} style={starBtnStyle}>
                            {star}★
                            </button>
                        ))}
                        </div>
                    )
                ) : (
                    <button onClick={() => handleCancelBooking(booking._id)} style={cancelBtnStyle}>
                    Cancel Booking
                    </button>
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
const cancelBtnStyle = { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const starBtnStyle = { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', margin: '0 2px', color: '#333' };

export default MyBookings;
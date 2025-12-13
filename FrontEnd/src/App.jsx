import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostRide from './pages/PostRide';
import MyBookings from './pages/MyBookings';
import RideRequests from './pages/RideRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-ride" element={<PostRide />} />
            <Route path="/my-bookings" element={<MyBookings />} /> 
            <Route path="/ride-requests" element={<RideRequests />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
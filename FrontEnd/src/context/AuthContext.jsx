import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Helps us read the token

// 1. Create the Context (The "Box" to hold data)
export const AuthContext = createContext();

// 2. Create the Provider (The "Wrapper" component)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State: Holds the user data (starts as null)
  const [loading, setLoading] = useState(true); // State: Are we still checking if they are logged in?

  // 3. useEffect: Runs ONCE when the app starts
  useEffect(() => {
    // Check if we have a token saved in the browser (LocalStorage)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get User ID
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Delete if expired
            setUser(null);
        } else {
            setUser(decoded.user); // Save user data to State
        }
      } catch (error) {
        console.error("Invalid Token");
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // We are done checking
  }, []);

  // 4. Login Function: Saves token and updates state
  const login = (token) => {
    localStorage.setItem('token', token); // Save to browser
    const decoded = jwtDecode(token);
    setUser(decoded.user);
  };

  // 5. Logout Function: Clears everything
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 6. Return the "Provider" that wraps your app
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
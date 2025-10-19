import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userData');
      
      if (token && storedUser) {
        // Set user immediately from localStorage for better UX
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Then verify with backend
        try {
          const response = await api.get('/users/me');
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem('userData', JSON.stringify(response.data.data));
          }
        } catch (verifyError) {
          console.warn('Token verification failed:', verifyError);
          // Keep user logged in with stored data
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // OTP-based login method
  const loginWithOtp = async (userData, token) => {
    try {
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (phone, name = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let userResponse;
      try {
        userResponse = await api.get(`/users/phone/${phone}`);
      } catch (error) {
        if (error.response?.status === 404) {
          const createUserData = { phone, name: name || 'Customer' };
          userResponse = await api.post('/users', createUserData);
        } else {
          throw error;
        }
      }

      if (userResponse.data.success) {
        const userData = userResponse.data.data;
        const token = `user-token-${Date.now()}`;
        
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateUser = async (updateData) => {
    try {
      if (!user?._id) {
        throw new Error('No user logged in');
      }

      const response = await api.put(`/users/${user._id}`, updateData);
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated && user !== null,
    error,
    login,
    loginWithOtp, // Added OTP login method
    logout,
    updateUser,
    setError,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
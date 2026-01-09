import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Note: Backend URL matches your existing setup
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (email, password, role) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        role
      });

      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register company
  const registerCompany = async (companyData) => {
    try {
      const response = await axios.post('/api/auth/register/company', companyData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Register employee
  const registerEmployee = async (employeeData) => {
    try {
      const response = await axios.post('/api/auth/register/employee', employeeData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    // Redirection is handled by App.jsx or the component calling logout
  };

  // Update user profile (Shared between Company & Employee)
  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/auth/profile', updates);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed'
      };
    }
  };

  // --- BUREAU MODEL HELPER ---
  // Payment success hone par local state update karne ke liye
  const setPaymentStatus = (status) => {
    if (user) {
      setUser({ ...user, isPaid: status });
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    registerCompany,
    registerEmployee,
    updateProfile,
    setPaymentStatus, // Added for Checkout logic
    isAuthenticated: !!user,
    isCompany: user?.role === 'company',
    isEmployee: user?.role === 'employee',
    isAdmin: user?.role === 'admin',
    // CIBIL style report unlock check
    hasPaidForReport: user?.isPaid || false 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

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


  // 1. Check Auth Status on Startup
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  /**
   * Universal Login Function
   * @param {Object} credentials - Can contain email/password OR firstName/dob
   * @param {String} role - 'company' or 'employee'
   */
  const login = async (credentials, role) => {
    try {
      const response = await api.post('/auth/login', {
        ...credentials,
        role
      });

      if (!response.data.success) {
        console.error('Login failed:', response.data.message);
        return {
          success: false,
          error: response.data.message || 'Login failed'
        };
      }

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login'; // Force clear app state
  };

  // Other functions remain robust but synced with backend paths
  const registerCompany = async (data) => {
    try {
      const response = await api.post('/auth/register/company', data);

      if (!response.data.success) {
        console.error('Company registration failed:', response.data.message);
        return {
          success: false,
          error: response.data.message || 'Registration failed'
        };
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during registration'
      };
    }
  };


  const setPaymentStatus = (status) => {
    if (user) setUser({ ...user, isPaid: status });
  };

  const updateProfile = async (profileData) => {
    try {
      const apiMethod = user.role === 'company' ? api.put('/companies/profile', profileData) : api.put('/employees/profile', profileData);
      const response = await apiMethod;
      if (response.data.success) {
        setUser({ ...user, profile: response.data.data });
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Profile Sync Failed' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Security Protocol Failure' };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send verification email' };
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) setUser(response.data.user);
    } catch (_) {}
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    registerCompany,
    updateProfile,
    changePassword,
    resendVerification,
    refreshUser,
    setPaymentStatus,
    isAuthenticated: !!user,
    isCompany: user?.role === 'company',
    isEmployee: user?.role === 'employee',
    emailVerified: user?.emailVerified ?? true,
    hasPaidForReport: user?.isPaid || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
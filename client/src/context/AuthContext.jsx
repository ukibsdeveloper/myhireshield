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
      // Backend expects: { email, password, role } OR { firstName, dateOfBirth, role }
      const response = await api.post('/auth/login', {
        ...credentials,
        role
      });

      if (!response.data.success) {
        return {
          success: false,
          error: response.data.message || 'Login failed'
        };
      }

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Authentication Protocol Failed'
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
  const registerCompany = async (companyData) => {
    try {
      const response = await api.post('/auth/register/company', companyData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error.response?.data);

      // Handle validation errors (array of errors)
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        return { success: false, error: errorMessages };
      }

      // Handle single error message
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const registerEmployee = async (employeeData) => {
    try {
      const response = await api.post('/auth/register/employee', employeeData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const setPaymentStatus = (status) => {
    if (user) setUser({ ...user, isPaid: status });
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    registerCompany,
    registerEmployee,
    setPaymentStatus,
    isAuthenticated: !!user,
    isCompany: user?.role === 'company',
    isEmployee: user?.role === 'employee',
    hasPaidForReport: user?.isPaid || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
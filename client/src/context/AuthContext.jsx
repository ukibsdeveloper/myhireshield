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

  // 1. Axios Security: Token Injection & Auto-Logout Logic
  useEffect(() => {
    // Request Interceptor: Token automatically attach karna
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response Interceptor: Agar token expire ho jaye (401) toh logout karna
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // 2. Check Auth Status on Startup
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
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
      const response = await axios.post('/api/auth/login', {
        ...credentials,
        role
      });

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
      const response = await axios.post('/api/auth/register/company', companyData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const registerEmployee = async (employeeData) => {
    try {
      const response = await axios.post('/api/auth/register/employee', employeeData);
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
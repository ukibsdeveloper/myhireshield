import axios from 'axios';
import toast from 'react-hot-toast';

// API Base URL - in dev use '' (proxy); in prod use VITE_API_URL (e.g. https://api.example.com)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user data if any

      // Only redirect if not already on login page (avoids refresh loop on failed login)
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        toast.error(message);
      }
    } else if (status === 403) {
      // Forbidden - Permission denied
      toast.error(message || 'Access Denied: You do not have permission.');
    } else if (status === 429) {
      // Rate Limit Exceeded
      toast.error('Too many requests. Please try again in a few minutes.');
    } else if (status === 500) {
      // Server Error
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      // Network Error
      toast.error('Network error. Check your connection.');
    } else {
      // Other errors (400, 404, etc.)
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// API Methods

// Authentication
export const authAPI = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  registerCompany: (data) => api.post('/auth/register/company', data),
  registerEmployee: (data) => api.post('/auth/register/employee', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  enable2FA: (phoneNumber) => api.post('/auth/2fa/enable', { phoneNumber }),
  verify2FA: (code) => api.post('/auth/2fa/verify', { code }),
  disable2FA: () => api.post('/auth/2fa/disable'),
};

// Employee APIs
export const employeeAPI = {
  search: (params) => api.get('/employees/search', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getProfile: () => api.get('/employees/profile'),
  updateProfile: (data) => api.put('/employees/profile', data),
  deleteProfile: () => api.delete('/employees/profile'),
  getStats: (id) => api.get(`/employees/${id}/stats`),
  exportData: () => api.get('/employees/export'),
};

// Company APIs
export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getStats: () => api.get('/companies/stats'),
  getEmployees: () => api.get('/companies/employees'),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByEmployee: (employeeId) => api.get(`/reviews/employee/${employeeId}`),
  getByCompany: () => api.get('/reviews/company'),
  getById: (id) => api.get(`/reviews/${id}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getStats: (employeeId) => api.get(`/reviews/stats/${employeeId}`),
  // Admin: verify reviews before they show on website
  getPending: () => api.get('/reviews/admin/pending'),
  moderate: (id, action) => api.put(`/reviews/admin/${id}/moderate`, { action }),
};

// Document APIs
export const documentAPI = {
  getByEmployee: (employeeId) => api.get(`/documents/employee/${employeeId}`),
  companyUpload: (formData, onProgress) => api.post('/documents/company-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  }),
  getEmployeesForUpload: () => api.get('/documents/employees'),
  getPendingVerifications: () => api.get('/documents/pending-verification'),
  performBackgroundCheck: (id, data) => api.post(`/documents/${id}/background-check`, data),
  getMyDocuments: () => api.get('/documents/my'),
  verify: (id, status, notes) => api.put(`/documents/${id}/verify`, { status, rejectionReason: notes }),
  delete: (id) => api.delete(`/documents/${id}`),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  getCompanyAnalytics: () => api.get('/analytics/company'),
  getEmployeeAnalytics: () => api.get('/analytics/employee'),
  trackEvent: (eventType, data) => api.post('/analytics/track', { eventType, data }),
};

// Audit Log APIs
export const auditAPI = {
  getLogs: (params) => api.get('/audit/logs', { params }),
  getMyLogs: () => api.get('/audit/my-logs'),
};

// Consent APIs
export const consentAPI = {
  give: (consentData) => api.post('/consent', consentData),
  withdraw: () => api.post('/consent/withdraw'),
  getStatus: () => api.get('/consent/status'),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getCompanies: (params) => api.get('/admin/companies', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export default api;
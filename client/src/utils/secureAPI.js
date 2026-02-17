import axios from 'axios';

// Enhanced API client with secure token storage and CSRF protection
class SecureAPIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL ?? '';
    this.csrfToken = null;
    this.sessionId = null;

    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL || undefined,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      withCredentials: true, // Send cookies
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token to state-changing requests
        if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
          if (this.csrfToken) {
            config.headers['X-CSRF-Token'] = this.csrfToken;
          }
          if (this.sessionId) {
            config.headers['X-Session-ID'] = this.sessionId;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle CSRF token errors
        if (error.response?.status === 403 && 
            error.response?.data?.message?.includes('CSRF')) {
          try {
            await this.refreshCSRFToken();
            originalRequest.headers['X-CSRF-Token'] = this.csrfToken;
            return this.client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Handle 401 unauthorized
        if (error.response?.status === 401) {
          this.clearTokens();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async initialize() {
    try {
      // Get session ID from cookie or generate one
      this.sessionId = this.getCookie('session') || this.generateSessionId();
      
      // Fetch CSRF token
      await this.refreshCSRFToken();
    } catch (error) {
      console.error('Failed to initialize secure API client:', error);
    }
  }

  async refreshCSRFToken() {
    try {
      const response = await this.client.get('/api/csrf-token');
      if (response.data.success) {
        this.csrfToken = response.data.data.csrfToken;
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
      throw error;
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  generateSessionId() {
    return crypto.randomUUID();
  }

  clearTokens() {
    this.csrfToken = null;
    this.sessionId = null;
    // Clear session cookie
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // API methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }
}

// Create singleton instance
const secureAPI = new SecureAPIClient();

// Initialize on app load
secureAPI.initialize();

export default secureAPI;

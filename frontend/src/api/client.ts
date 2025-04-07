import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
client.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      // Only clear token and redirect if we're not already on the login page
      // and if the request wasn't for login/register
      const isAuthRequest = error.config?.url?.includes('/login/access-token') || 
                          error.config?.url?.includes('/register');
      
      if (!isAuthRequest) {
        console.log('Unauthorized access, clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client; 
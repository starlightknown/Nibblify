import client from './client';

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Sending login request with credentials:', credentials);
      const params = new URLSearchParams();
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      
      const response = await client.post<AuthResponse>('/auth/login/access-token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login request failed:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await client.post<User>('/auth/register', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('Fetching current user');
      const response = await client.get<User>('/auth/me');
      console.log('Current user response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch current user:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authApi; 
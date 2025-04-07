import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authApi, { LoginCredentials } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Log auth state on mount and when it changes
    console.log('Current auth state:', { isAuthenticated });
  }, [isAuthenticated]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        console.log('Step 1: Attempting login...');
        const authResponse = await authApi.login(credentials);
        console.log('Step 2: Login response:', authResponse);
        
        // Store the token first
        localStorage.setItem('token', authResponse.access_token);
        
        console.log('Step 3: Token stored, fetching user data...');
        const user = await authApi.getCurrentUser();
        console.log('Step 4: User data:', user);
        
        return { token: authResponse.access_token, user };
      } catch (error: any) {
        // If there's an error, make sure to clean up any stored token
        localStorage.removeItem('token');
        console.error('Login error details:', {
          response: error.response?.data,
          status: error.response?.status,
          message: error.message
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Step 5: Login successful, updating auth state...');
      login(data.token, data.user);
      console.log('Step 6: Auth state updated, preparing to navigate...');
      // Add a small delay before navigation to see logs
      setTimeout(() => {
        console.log('Step 7: Navigating to documents...');
        navigate('/documents');
      }, 1000);
    },
    onError: (err: any) => {
      console.error('Login mutation error:', {
        error: err,
        response: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.detail || 'Invalid email or password');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setError('');

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      console.log('Starting login process with email:', email);
      await loginMutation.mutateAsync({ username: email, password });
    } catch (err) {
      console.error('Handle submit error:', err);
    }
  };

  // If already authenticated, redirect to documents page
  if (isAuthenticated) {
    console.log('Already authenticated, redirecting to documents...');
    return <Navigate to="/documents" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
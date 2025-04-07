import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Documents from './pages/Documents';
import DocumentForm from './components/documents/DocumentForm';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/documents"
                  element={
                    <PrivateRoute>
                      <Documents />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/documents/new"
                  element={
                    <PrivateRoute>
                      <DocumentForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/documents/:id/edit"
                  element={
                    <PrivateRoute>
                      <DocumentForm />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

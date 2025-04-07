import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import DocumentList from './components/documents/DocumentList';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DocumentForm from './components/documents/DocumentForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <DocumentList />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/documents/new"
                element={
                  <ProtectedRoute>
                    <DocumentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id/edit"
                element={
                  <ProtectedRoute>
                    <DocumentForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/documents" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

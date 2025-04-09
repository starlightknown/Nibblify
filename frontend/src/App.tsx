import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Documents from './pages/Documents';
import DocumentForm from './components/documents/DocumentForm';
import UploadDocument from './components/documents/UploadDocument';
import DocumentView from './components/documents/DocumentView';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with layout */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/documents/new" element={<DocumentForm />} />
                      <Route path="/documents/upload" element={<UploadDocument />} />
                      <Route path="/documents/:id" element={<DocumentView />} />
                      <Route path="/documents/:id/edit" element={<DocumentForm />} />
                      <Route path="/" element={<Documents />} />
                    </Routes>
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GiveawayDetailPage from './pages/GiveawayDetailPage';
import EntryFormPage from './pages/EntryFormPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEntriesPage from './pages/AdminEntriesPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow bg-gray-100 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/giveaway/:id" element={<GiveawayDetailPage />} />
                  
                  <Route 
                    path="/giveaway/:id/entry" 
                    element={
                      <ProtectedRoute>
                        <EntryFormPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="/admin" element={<AdminLoginPage />} />
                  
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/entries/:id" 
                    element={
                      <AdminRoute>
                        <AdminEntriesPage />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/user/:id" 
                    element={
                      <AdminRoute>
                        <AdminUserDetailPage />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </main>
            
            <Footer />
          </div>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
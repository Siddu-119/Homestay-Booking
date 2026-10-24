import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import HomestayDetail from './pages/HomestayDetail';
import BookingsPage from './pages/BookingsPage';
import { useAuth } from './context/AuthContext';
import BackgroundSlideshow from './components/BackgroundSlideshow';

function App() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <BackgroundSlideshow />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homestay/:id" element={<HomestayDetail />} />
          
          <Route path="/admin" element={
            user && user.role === 'ADMIN' ? <AdminPage /> : <Navigate to="/" />
          } />
          
          <Route path="/bookings" element={
            user && user.role === 'GUEST' ? <BookingsPage /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

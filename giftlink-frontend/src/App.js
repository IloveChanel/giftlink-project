import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import GiftDetail from './components/GiftDetail';
import SearchPage from './components/SearchPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (token in localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route 
            path="/home" 
            element={user ? <MainPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/gifts/:id" 
            element={user ? <GiftDetail user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/search" 
            element={user ? <SearchPage user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="App-header">
        <h1>GiftLink</h1>
        <p>Welcome to GiftLink - Your gift sharing platform</p>
        <div className="landing-buttons">
          <a href="/login" className="btn btn-primary">Login</a>
          <a href="/register" className="btn btn-secondary">Register</a>
        </div>
      </header>
    </div>
  );
}

export default App;

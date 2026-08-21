import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const handleAuthLogoutEvent = () => {
      handleLogout();
    };

    window.addEventListener('auth_logout', handleAuthLogoutEvent);

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }

    return () => {
      window.removeEventListener('auth_logout', handleAuthLogoutEvent);
    };
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="content-wrapper">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            user={user} 
            onLogout={handleLogout} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="main-content">
            <Routes>
              <Route 
                path="/login" 
                element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLogin} /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/signup" 
                element={!isAuthenticated ? <SignupPage onSignupSuccess={handleLogin} /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/tasks" 
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/analytics" 
                element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="*" 
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

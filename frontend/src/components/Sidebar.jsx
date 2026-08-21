import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isAuthenticated, onLogout, theme, onToggleTheme }) => {
  const location = useLocation();

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar_width');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 220), 360) : 260;
  });

  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 220 && newWidth <= 360) {
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebar_width', newWidth.toString());
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, resize, stopResizing]);

  if (!isAuthenticated) return null;

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/tasks' || location.pathname === '/';
  const isAnalyticsActive = location.pathname === '/analytics';
  const isProfileActive = location.pathname === '/profile';

  return (
    <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
      {/* Drag Resize Handle */}
      <div
        className="sidebar-resize-handle"
        onMouseDown={startResizing}
        title="Drag to resize sidebar"
      />

      {/* Brand Header */}
      <div className="sidebar-brand">
        <span className="brand-logo">📋</span>
        <span className="brand-title">Task Flow</span>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <Link
            to="/dashboard"
            className={`sidebar-nav-item ${isDashboardActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </Link>

          <Link
            to="/analytics"
            className={`sidebar-nav-item ${isAnalyticsActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Analytics</span>
          </Link>

          <Link
            to="/profile"
            className={`sidebar-nav-item ${isProfileActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </Link>
        </div>

        <div className="nav-section" style={{ marginTop: 'auto' }}>
          <button onClick={onLogout} className="sidebar-nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Dark Mode Control Area */}
      <div className="sidebar-footer">
        <div className="dark-mode-control">
          <div className="dark-mode-info">
            <span className="dark-mode-icon">🌙</span>
            <div>
              <div className="dark-mode-title">Dark Mode</div>
              <div className="dark-mode-subtitle">{theme === 'dark' ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={onToggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

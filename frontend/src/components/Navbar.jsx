import React from 'react';

const Navbar = ({ isAuthenticated, user }) => {
  if (!isAuthenticated) return null;

  return (
    <header className="top-header">
      <div className="top-header-right">
        {/* Logged-in User Email */}
        <span className="header-user-email">{user?.email || 'server@example.com'}</span>
      </div>
    </header>
  );
};

export default Navbar;

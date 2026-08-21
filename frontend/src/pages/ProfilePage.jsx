import React from 'react';

const ProfilePage = ({ user }) => {
  // Retrieve saved user from localStorage if prop is not passed directly
  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'TF';
  };

  const displayName = currentUser?.name || 'Task Flow User';
  const displayEmail = currentUser?.email || 'user@example.com';
  const initials = getInitials(displayName, displayEmail);

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Member';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Overview of your account details and information
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div
        className="metric-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1.75rem',
          padding: '1.75rem'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            flexShrink: 0,
            border: '2px solid var(--color-primary-border)'
          }}
        >
          {initials}
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {displayName}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {displayEmail}
          </p>
          <span className="badge badge-completed">
            Active Account
          </span>
        </div>
      </div>

      {/* Account Information Details Card */}
      <div className="metric-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Account Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 600 }}>
              Full Name
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {displayName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 600 }}>
              Email Address
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {displayEmail}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 600 }}>
              Member Since
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {memberSince}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 600 }}>
              Account Role
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Standard User
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

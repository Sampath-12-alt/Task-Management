import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const SignupPage = ({ onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Register user
      await authService.signup(name.trim(), email.trim(), password);
      
      // 2. Automatically log in user after signup to obtain JWT
      const loginData = await authService.login(email.trim(), password);

      if (loginData.token) {
        localStorage.setItem('token', loginData.token);
      }
      if (loginData.user) {
        localStorage.setItem('user', JSON.stringify(loginData.user));
      }

      setIsSubmitting(false);

      if (onSignupSuccess) {
        onSignupSuccess(loginData.user);
      }

      navigate('/tasks');
    } catch (err) {
      setIsSubmitting(false);
      setGeneralError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <span className="brand-logo">📋</span>
          <span className="brand-title">Task Flow</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="auth-header">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Get started with Task Flow today</p>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="alert alert-danger" role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              className={`form-input ${errors.name ? 'is-invalid' : ''}`}
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <span id="signup-name-error" className="error-text">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              className={`form-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <span id="signup-email-error" className="error-text">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                style={{ paddingRight: '2.5rem' }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'signup-password-error' : undefined}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span id="signup-password-error" className="error-text">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

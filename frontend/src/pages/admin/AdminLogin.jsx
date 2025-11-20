import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AdminAuth.module.css';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍕</span>
            <h1 className={styles.logoText}>Restaurant Admin</h1>
          </div>
          <h2 className={styles.authTitle}>Admin Login</h2>
          <p className={styles.authSubtitle}>Sign in to your admin account</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/admin/signup" className={styles.footerLink}>
              Contact Super Admin
            </Link>
          </p>
          <p className={styles.helpText}>
            Forgot password?{' '}
            <a href="/admin/forgot-password" className={styles.helpLink}>
              Reset here
            </a>
          </p>
        </div>
      </div>

      <div className={styles.authBackground}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.welcomeMessage}>
          <h3>Welcome Back!</h3>
          <p>Manage your restaurant platform with ease and efficiency.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
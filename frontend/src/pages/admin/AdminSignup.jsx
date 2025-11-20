import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AdminAuth.module.css';

const AdminSignup = () => {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'operations'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all required fields';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return 'Please enter a valid 10-digit phone number';
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would be an API call to register
      // For now, we'll simulate registration and auto-login
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    }
    
    setLoading(false);
  };

  const departments = [
    { value: 'operations', label: 'Operations' },
    { value: 'finance', label: 'Finance' },
    { value: 'support', label: 'Support' },
    { value: 'management', label: 'Management' },
    { value: 'technical', label: 'Technical' }
  ];

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍕</span>
            <h1 className={styles.logoText}>Restaurant Admin</h1>
          </div>
          <h2 className={styles.authTitle}>Create Admin Account</h2>
          <p className={styles.authSubtitle}>Set up your admin account</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successAlert}>
            <span className={styles.successIcon}>✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your full name"
              required
              disabled={loading}
              maxLength="100"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address *
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
            <label htmlFor="phone" className={styles.formLabel}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter 10-digit phone number"
              required
              disabled={loading}
              pattern="[0-9]{10}"
              maxLength="10"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department" className={styles.formLabel}>
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={styles.formSelect}
              disabled={loading}
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter password (min 6 characters)"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Confirm your password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className={styles.termsAgreement}>
            <p className={styles.termsText}>
              By creating an account, you agree to our{' '}
              <a href="/admin/terms" className={styles.termsLink}>Terms of Service</a>{' '}
              and{' '}
              <a href="/admin/privacy" className={styles.termsLink}>Privacy Policy</a>.
            </p>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/admin/login" className={styles.footerLink}>
              Sign In
            </Link>
          </p>
          <p className={styles.helpText}>
            * Required fields
          </p>
        </div>
      </div>

      <div className={styles.authBackground}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.welcomeMessage}>
          <h3>Join Our Admin Team</h3>
          <p>Get started with managing restaurants, users, and financial operations.</p>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🏪</span>
              <span>Restaurant Management</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📊</span>
              <span>Analytics & Reports</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>💰</span>
              <span>Financial Operations</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>👥</span>
              <span>User Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
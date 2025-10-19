// LoginComponent.jsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const LoginComponent = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const { login, loading, isAuthenticated } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(phone, name);
    if (result.success) {
      // Redirect or show success
      console.log('Logged in successfully:', result.user);
    } else {
      // Show error
      alert(result.error);
    }
  };

  if (isAuthenticated) {
    return <div>Already logged in!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Your Name (Optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginComponent;
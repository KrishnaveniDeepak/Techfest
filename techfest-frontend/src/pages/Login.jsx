import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://techfest-6l78.onrender.com";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect directly to Events page
        navigate('/events');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error during login');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Login to Techfest</h2>
      {error && <div style={styles.errorBanner}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.btn}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "400px",
    width: "100%",
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "30px",
    backdropFilter: "blur(16px)",
  },
  title: { fontSize: "22px", fontWeight: "800", color: "#f8fafc", marginBottom: "20px" },
  errorBanner: { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" },
  inputGroup: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", color: "#cbd5e1", marginBottom: "6px" },
  input: { width: "100%", padding: "10px", borderRadius: "8px", background: "#0f172a", border: "1px solid #334155", color: "#fff", boxSizing: "border-box" },
  btn: { width: "100%", padding: "12px", background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }
};
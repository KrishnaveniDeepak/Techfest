import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Events from "./pages/Events";
import RegisterEvent from "./pages/RegisterEvent";

function Navigation() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <span style={styles.logoBadge}>⚡</span>
        <span style={styles.logoText}>TECHFEST <span style={{ color: "#00f2fe" }}>2026</span></span>
      </div>
      <nav style={styles.nav}>
        <Link to="/signup" style={styles.navLink}>Signup</Link>
        <Link to="/login" style={styles.navLink}>Login</Link>
        <Link to="/events" style={styles.navLink}>Events</Link>
        <Link to="/register-event" style={styles.navLinkActive}>Register Event</Link>
        {token && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <Navigation />
        <main style={styles.mainContent}>
          <Routes>
            {/* Opens directly to Signup page */}
            <Route path="/" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<Events />} />
            <Route path="/register-event" element={<RegisterEvent />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#0a0c10",
    color: "#e6edf3",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundImage: "radial-gradient(circle at 50% -20%, #1e1b4b 0%, #0a0c10 80%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 40px",
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  logoBadge: {
    fontSize: "22px",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    borderRadius: "8px",
    padding: "4px 8px",
  },
  logoText: { fontSize: "22px", fontWeight: "800", letterSpacing: "1.5px" },
  nav: { display: "flex", alignItems: "center", gap: "24px" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: "15px", fontWeight: "600" },
  navLinkActive: {
    color: "#38bdf8",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    background: "rgba(56, 189, 248, 0.1)",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  logoutBtn: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
  },
  mainContent: { padding: "40px 20px", display: "flex", justifyContent: "center" }
};
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://techfest-6l78.onrender.com";
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegisterClick = (eventId) => {
    // Redirects directly to Register Event page with event ID attached
    navigate(`/register-event?eventId=${eventId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Explore Techfest Events</h2>
        <p style={styles.subtitle}>Click register to open the event registration form!</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading events...</p>
      ) : (
        <div style={styles.grid}>
          {events.map((ev) => (
            <div key={ev._id} style={styles.card}>
              <div>
                <div style={styles.cardTop}>
                  <span style={styles.categoryBadge}>{ev.category || "TECH"}</span>
                  <span
                    style={{
                      ...styles.seatBadge,
                      background: ev.seats > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: ev.seats > 0 ? "#34d399" : "#f87171",
                    }}
                  >
                    {ev.seats > 0 ? `${ev.seats} Seats Left` : "Sold Out"}
                  </span>
                </div>

                <h3 style={styles.eventName}>{ev.name}</h3>
                <p style={styles.feeText}>
                  Entry Fee: <strong style={{ color: "#38bdf8" }}>₹{ev.fee}</strong>
                </p>
              </div>

              <button
                onClick={() => handleRegisterClick(ev._id)}
                disabled={ev.seats <= 0}
                style={{
                  ...styles.registerBtn,
                  background: ev.seats > 0 ? "linear-gradient(135deg, #0284c7, #2563eb)" : "#334155",
                  cursor: ev.seats > 0 ? "pointer" : "not-allowed",
                }}
              >
                {ev.seats > 0 ? "Register Now" : "Seats Full"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", width: "100%", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px 0" },
  subtitle: { fontSize: "14px", color: "#94a3b8", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
  card: {
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "220px",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  categoryBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.1)",
    padding: "4px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
  },
  seatBadge: { fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "12px" },
  eventName: { fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px 0" },
  feeText: { fontSize: "14px", color: "#cbd5e1", marginBottom: "20px" },
  registerBtn: { width: "100%", padding: "12px", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700" },
};
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// API Base URL configuration using Netlify environment variable with Render fallback
const API_URL = import.meta.env.VITE_API_URL || "https://techfest-6l78.onrender.com";

export default function RegisterEvent() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "Computer Science",
    dob: "",
    mobileNumber: "",
    eventId: ""
  });
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const location = useLocation();

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const fetchData = async () => {
    try {
      const resEvents = await fetch(`${API_URL}/api/events`);
      const eventsData = await resEvents.json();
      setEvents(eventsData);

      // Check URL query string for eventId
      const queryParams = new URLSearchParams(location.search);
      const urlEventId = queryParams.get("eventId");

      if (urlEventId) {
        setFormData((prev) => ({ ...prev, eventId: urlEventId }));
      } else if (eventsData.length > 0 && !formData.eventId) {
        setFormData((prev) => ({ ...prev, eventId: eventsData[0]._id }));
      }

      if (token) {
        const resReg = await fetch(`${API_URL}/api/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const regData = await resReg.json();
        setUserRegistrations(regData);
      }
    } catch (err) {
      setMessage("Error fetching data from server");
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!token) return setMessage("Please log in first!");

    try {
      const res = await fetch(`${API_URL}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! Seats count updated in MongoDB.");
        setFormData({
          fullName: "",
          department: "Computer Science",
          dob: "",
          mobileNumber: "",
          eventId: events[0]?._id || ""
        });
        fetchData();
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Server error during registration");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    try {
      const res = await fetch(`${API_URL}/api/registrations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Registration deleted and seat count restored!");
        fetchData();
      } else {
        setMessage("Failed to delete registration");
      }
    } catch (err) {
      setMessage("Server error during deletion");
    }
  };

  const startEdit = (reg) => {
    setEditingId(reg._id);
    setEditFormData({
      fullName: reg.fullName,
      department: reg.department,
      dob: reg.dob,
      mobileNumber: reg.mobileNumber,
      eventId: reg.event?._id || events[0]?._id
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/registrations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setMessage("Registration updated successfully!");
        setEditingId(null);
        fetchData();
      } else {
        setMessage("Failed to update registration");
      }
    } catch (err) {
      setMessage("Server error during update");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Registration Form */}
      <div style={styles.card}>
        <h2 style={styles.title}>Event Registration</h2>
        <p style={styles.subtitle}>Enter your details below to register for an event</p>

        {message && <div style={styles.statusBadge}>{message}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jordan Lee"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              style={styles.input}
              required
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Event</label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              style={styles.inputSelect}
              required
            >
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.name} — ₹{ev.fee} ({ev.seats} seats remaining)
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Confirm Registration
          </button>
        </form>
      </div>

      {/* Submitted Registrations List */}
      <div style={styles.card}>
        <h3 style={styles.title}>Your Registrations</h3>
        <p style={styles.subtitle}>Manage or update your submitted registrations</p>

        {userRegistrations.length === 0 ? (
          <div style={styles.emptyState}>No registered events found. Fill out the form to register!</div>
        ) : (
          userRegistrations.map((reg) => (
            <div key={reg._id} style={styles.regBox}>
              {editingId === reg._id ? (
                <div>
                  <h4 style={{ color: "#38bdf8", marginTop: 0 }}>Update Entry</h4>
                  
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    style={styles.input}
                  />

                  <label style={styles.label}>Department</label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    style={styles.input}
                  >
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>

                  <label style={styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dob}
                    onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                    style={styles.input}
                  />

                  <label style={styles.label}>Mobile Number</label>
                  <input
                    type="tel"
                    value={editFormData.mobileNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                    style={styles.input}
                  />

                  <label style={styles.label}>Event</label>
                  <select
                    value={editFormData.eventId}
                    onChange={(e) => setEditFormData({ ...editFormData, eventId: e.target.value })}
                    style={styles.input}
                  >
                    {events.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.name} — ₹{ev.fee} ({ev.seats} seats left)
                      </option>
                    ))}
                  </select>

                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button onClick={() => handleUpdate(reg._id)} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={styles.eventHeader}>
                    <span style={styles.eventName}>{reg.event?.name || "Event"}</span>
                    <span style={styles.feeBadge}>₹{reg.event?.fee || "0"}</span>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div><span style={styles.detailKey}>Name:</span> {reg.fullName}</div>
                    <div><span style={styles.detailKey}>Dept:</span> {reg.department}</div>
                    <div><span style={styles.detailKey}>DOB:</span> {reg.dob}</div>
                    <div><span style={styles.detailKey}>Mobile:</span> {reg.mobileNumber}</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                    <button onClick={() => startEdit(reg)} style={styles.editBtn}>Update</button>
                    <button onClick={() => handleDelete(reg._id)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", gap: "30px", maxWidth: "960px", width: "100%", flexWrap: "wrap" },
  card: {
    flex: "1 1 420px",
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(16px)",
  },
  title: { fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px 0" },
  subtitle: { fontSize: "13px", color: "#94a3b8", margin: "0 0 20px 0" },
  inputGroup: { marginBottom: "14px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "5px" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#f8fafc",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  inputSelect: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#0f172a",
    border: "1px solid #0284c7",
    color: "#38bdf8",
    fontWeight: "600",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #0284c7, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
  },
  statusBadge: {
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    color: "#38bdf8",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },
  regBox: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px", marginBottom: "14px" },
  eventHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  eventName: { fontWeight: "700", fontSize: "16px", color: "#f8fafc" },
  feeBadge: {
    background: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  detailsGrid: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" },
  detailKey: { color: "#cbd5e1", fontWeight: "600" },
  editBtn: {
    flex: 1,
    padding: "8px",
    background: "rgba(234, 179, 8, 0.15)",
    color: "#fde047",
    border: "1px solid rgba(234, 179, 8, 0.3)",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px",
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveBtn: { flex: 1, padding: "8px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "8px", background: "#475569", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  emptyState: { textAlign: "center", color: "#64748b", padding: "40px 20px", fontSize: "14px" },
};
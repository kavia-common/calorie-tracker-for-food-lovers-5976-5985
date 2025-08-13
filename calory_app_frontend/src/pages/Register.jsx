import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form allowing new users to create an account. */
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, email, password });
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create your account</h2>
        <p className="subtitle">Join food lovers tracking their nutrition</p>
        {error && <div className="alert">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            Name
            <input
              type="text"
              placeholder="e.g., Jamie Oliver"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
          <button className="btn btn-large" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

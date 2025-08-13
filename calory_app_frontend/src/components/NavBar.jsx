import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation bar for the application with auth-aware links. */
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="brand" to="/">Calorie Tracker</Link>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/meals">Meals</Link>
            <Link to="/search">Search</Link>
            <button className="btn btn-small btn-outline" onClick={logout} aria-label="Logout">
              Logout{user?.name ? ` (${user.name})` : ""}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link className="btn btn-small" to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

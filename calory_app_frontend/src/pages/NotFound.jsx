import React from "react";

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page displayed when no route matches. */
  return (
    <div className="container">
      <h2 className="title">Page Not Found</h2>
      <p className="subtitle">We couldn't find what you're looking for.</p>
    </div>
  );
}

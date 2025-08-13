import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { searchFoods } from "../services/foods";

// PUBLIC_INTERFACE
export default function Search() {
  /** Search page for looking up foods by name. */
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await searchFoods(token, query);
      setResults(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Food Database</h2>
      <p className="subtitle">Search foods to view nutrition</p>

      <div className="card">
        <form className="form form-inline" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g., Apple"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button className="btn" type="submit">Search</button>
        </form>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <p>Searching...</p>}

      <div className="list">
        {results.map((r, idx) => (
          <div key={r.id || r._id || idx} className="list-item">
            <div className="list-item-main">
              <div className="list-item-title">{r.name || r.food_name || "Food"}</div>
              <div className="list-item-subtitle">{r.brand || r.brand_name || ""}</div>
            </div>
            <div className="list-item-meta">
              {typeof r.calories !== "undefined" ? `${r.calories} kcal` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

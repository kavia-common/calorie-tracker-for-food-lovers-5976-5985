import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addMeal, deleteMeal, listMeals } from "../services/meals";

// PUBLIC_INTERFACE
export default function Meals() {
  /** Meals management: add new entries and view/delete existing ones. */
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listMeals(token);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || "Failed to load meals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addMeal(token, {
        name,
        calories: Number(calories),
        occurredAt: new Date(occurredAt).toISOString()
      });
      setName("");
      setCalories("");
      setOccurredAt(new Date().toISOString().slice(0, 16));
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to add meal");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meal?")) return;
    setError("");
    try {
      await deleteMeal(token, id);
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to delete meal");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Meals</h2>
      <p className="subtitle">Log your meals and snacks</p>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        <form className="form form-inline" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Meal name (e.g., Chicken salad)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
            min="0"
          />
          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            required
          />
          <button className="btn" type="submit">Add</button>
        </form>
      </div>

      <div className="list">
        {loading ? <p>Loading...</p> : null}
        {!loading && items.length === 0 ? <p className="muted">No meals yet. Add your first one!</p> : null}
        {items.map((m) => (
          <div key={m.id || m._id || `${m.name}-${m.occurredAt}`} className="list-item">
            <div className="list-item-main">
              <div className="list-item-title">{m.name}</div>
              <div className="list-item-subtitle">{new Date(m.occurredAt).toLocaleString()}</div>
            </div>
            <div className="list-item-meta">{m.calories} kcal</div>
            <button className="btn btn-outline btn-small" onClick={() => handleDelete(m.id || m._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

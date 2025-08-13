import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend } from "chart.js";
import { useAuth } from "../context/AuthContext";
import { listMeals } from "../services/meals";

Chart.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard showing quick stats and a 7-day calories chart. */
  const { token, user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError("");
      try {
        const data = await listMeals(token);
        if (!cancelled) setMeals(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load meals");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  const { labels, totals } = useMemo(() => {
    const map = new Map();
    // last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, 0);
    }
    meals.forEach((m) => {
      const dt = m.occurredAt ? new Date(m.occurredAt) : new Date();
      const key = dt.toISOString().slice(0, 10);
      if (map.has(key)) {
        const current = map.get(key) || 0;
        map.set(key, current + (Number(m.calories) || 0));
      }
    });
    const labelsArr = Array.from(map.keys());
    const totalsArr = Array.from(map.values());
    return { labels: labelsArr, totals: totalsArr };
  }, [meals]);

  const totalToday = totals?.[totals.length - 1] || 0;
  const totalMeals = meals.length;

  const data = {
    labels,
    datasets: [
      {
        label: "Calories",
        data: totals,
        borderColor: "#E87A41",
        backgroundColor: "rgba(232, 122, 65, 0.25)",
        tension: 0.3,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">Hello{user?.name ? `, ${user.name}` : ""} 👋</h2>
      <p className="subtitle">Here's your nutrition snapshot</p>
      {error && <div className="alert">{error}</div>}

      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Today's Calories</div>
          <div className="stat-value">{totalToday}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Meals Logged</div>
          <div className="stat-value">{totalMeals}</div>
        </div>
      </div>

      <div className="card">
        <h3>Last 7 Days</h3>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

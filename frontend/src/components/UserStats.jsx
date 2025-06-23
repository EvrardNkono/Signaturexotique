// src/components/UserStats.jsx
import React, { useState } from 'react';
import './UserStats.css';

const statsData = {
  day: { label: "Aujourd’hui", value: 3 },
  week: { label: "Cette semaine", value: 24 },
  month: { label: "Ce mois-ci", value: 86 },
};

export default function UserStats() {
  const [filter, setFilter] = useState('week');

  return (
    <div className="user-stats-container">
      <div className="user-stats-header">
        <h2 className="user-stats-title">Inscriptions utilisateurs</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="user-stats-filter"
        >
          <option value="day">Aujourd’hui</option>
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
        </select>
      </div>

      <div className="user-stats-number">
        {statsData[filter].value}
        <span className="user-stats-label">{statsData[filter].label}</span>
      </div>
    </div>
  );
}

// src/pages/Dashboard.jsx
import React from 'react';
import './Dashboard.css'; // Tu peux personnaliser l'apparence ici
import SalesChart from '../components/SalesChart';
import UserStats from '../components/UserStats';
import RecentUsers from '../components/RecentUsers';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenue dans l’espace admin 👋</h1>
      <p className="dashboard-subtitle">
        Voici un aperçu de l’activité récente de la boutique.
      </p>

      <div className="dashboard-stats-grid">
        <SalesChart />
        <UserStats />
        <RecentUsers />
      </div>
    </div>
  );
}

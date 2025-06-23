import React from 'react';
import './Dashboard.css';
import SalesChart from '../components/SalesChart';
import UserStats from '../components/UserStats';
import RecentUsers from '../components/RecentUsers';
import UserStatsChart from '../components/UserStatsChart'; // 👈 ajout

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
        <UserStatsChart /> 
        <RecentUsers />
      </div>
    </div>
  );
}

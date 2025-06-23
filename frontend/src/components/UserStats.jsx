import React, { useState, useEffect } from 'react';
import { API_URL } from '../config'; // Assure-toi que API_URL est bien défini
import './UserStats.css';

export default function UserStats() {
  const [filter, setFilter] = useState('week');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction utilitaire pour comparer dates
  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

  // Calcul du nombre d'inscriptions selon le filtre
  const countUsersByFilter = () => {
    const now = new Date();

    if (!users.length) return 0;

    switch (filter) {
      case 'day':
        // Utilisateurs inscrits aujourd'hui
        return users.filter(user => {
          const created = new Date(user.created_at);
          return isSameDay(created, now);
        }).length;

      case 'week':
        // Utilisateurs inscrits cette semaine (du lundi au dimanche)
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay() + 1); // lundi
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // dimanche

        return users.filter(user => {
          const created = new Date(user.created_at);
          return created >= firstDayOfWeek && created <= lastDayOfWeek;
        }).length;

      case 'month':
        // Utilisateurs inscrits ce mois (même mois et année)
        return users.filter(user => {
          const created = new Date(user.created_at);
          return created.getMonth() === now.getMonth() &&
                 created.getFullYear() === now.getFullYear();
        }).length;

      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Chargement des statistiques utilisateur...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur: {error}</p>;

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
        {countUsersByFilter()}
        <span className="user-stats-label">{filter === 'day' ? "Aujourd’hui" : filter === 'week' ? "Cette semaine" : "Ce mois-ci"}</span>
      </div>
    </div>
  );
}

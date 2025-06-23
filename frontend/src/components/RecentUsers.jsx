// src/components/RecentUsers.jsx
import React from 'react';
import './RecentUsers.css'; // styles associés

// ⚠️ Exemple de données statiques (à remplacer par des données dynamiques plus tard)
const recentUsers = [
  { id: 1, name: 'Jean Mbarga', email: 'jean@example.com', date: '22 juin 2025' },
  { id: 2, name: 'Fatou Ndiaye', email: 'fatou@example.com', date: '21 juin 2025' },
  { id: 3, name: 'Moussa Diop', email: 'moussa@example.com', date: '20 juin 2025' },
  { id: 4, name: 'Chantal Ekani', email: 'chantal@example.com', date: '19 juin 2025' },
];

export default function RecentUsers() {
  return (
    <div className="recent-users-container">
      <h2 className="recent-users-title">Derniers utilisateurs inscrits</h2>
      <ul className="recent-users-list">
        {recentUsers.map((user) => (
          <li key={user.id} className="recent-user-item">
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <div className="user-date">{user.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

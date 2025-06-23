import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { Spinner, Alert } from 'react-bootstrap';
import './RecentUsers.css';

export default function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await res.json();

        // Tri par date de création DESC et slice pour ne garder que les 4 derniers
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setUsers(sorted.slice(0, 4));
      } catch (e) {
        setError(e.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  if (loading) return (
    <div className="text-center my-4">
      <Spinner animation="border" variant="warning" />
      <p>Chargement des derniers utilisateurs...</p>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="my-3 text-center">{error}</Alert>
  );

  return (
    <div className="recent-users-container">
      <h2 className="recent-users-title">Derniers utilisateurs inscrits</h2>
      <ul className="recent-users-list">
        {users.map(user => (
          <li key={user.id} className="recent-user-item">
            <div className="user-info">
              <div className="user-name">{user.nom}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <div className="user-date">
              {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

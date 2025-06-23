// src/components/Topbar.jsx
import React from 'react';
import './Topbar.css';

export function Topbar() {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Tableau de bord</h1>
      <div className="topbar-user">
        <span className="topbar-username">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profil admin"
          className="topbar-avatar"
        />
      </div>
    </header>
  );
}

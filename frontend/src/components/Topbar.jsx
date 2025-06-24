import React from 'react';
import './Topbar.css'; // Ou utilise Tailwind

export function Topbar({ onToggleSidebar }) {
  return (
    <header className="topbar flex items-center justify-between px-4 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Menu hamburger (visible uniquement en mobile) */}
      <button
        onClick={onToggleSidebar}
        className="menu"
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      

      <div className="flex items-center gap-2">
        <span>Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profil admin"
          className="rounded-full w-8 h-8"
        />
      </div>
    </header>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Package, Users, Tag, LayoutDashboard, UtensilsCrossed, Image, ShoppingCart,
} from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose }) {
  const routes = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/products", label: "Produits", icon: Package },
    { to: "/dashboard/categories", label: "Catégories", icon: Tag },
    { to: "/dashboard/users", label: "Utilisateurs", icon: Users },
    { to: "/dashboard/recipes", label: "Recettes", icon: UtensilsCrossed },
    { to: "/dashboard/popup-images", label: "Images popup", icon: Image },
    { to: "/dashboard/orders", label: "Commandes", icon: ShoppingCart },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">Meka Admin</h1>
      </div>
      <nav className="sidebar-nav">
        {routes.map(({ to, label, icon: Icon }) => (
          <NavLink
            to={to}
            key={to}
            onClick={onClose} // ferme la sidebar sur mobile au clic
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} className="sidebar-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const AdminLayout = () => {
  // état pour ouvrir/fermer la sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // toggle
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Passe l'état à Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1">
        {/* Passe la fonction toggle à Topbar */}
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

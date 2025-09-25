import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: 'batches', label: 'Batches' },
    { path: 'groups', label: 'Groups' },
    { path: 'noticeboard', label: 'Noticeboard' },
    { path: 'profile', label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        {navItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
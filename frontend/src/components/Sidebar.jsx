import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { path: "batches", label: "Batches", icon: "ri-school-fill" },
    { path: "groups", label: "Groups", icon: "ri-group-fill" },
    { path: "noticeboard", label: "Noticeboard", icon: "ri-clapperboard-line" },
    { path: "profile", label: "Profile", icon: "ri-user-line" },
  ];
  //  { path: '/dashboard', label: 'Dashboard', icon: 'ri-home-line' },
  //   { path: '/peer-reviews', label: 'Peer Reviews', icon: 'ri-star-line' },
  //   { path: '/projects', label: 'Projects', icon: 'ri-grid-line' },
  //   { path: '/blogs', label: 'Blogs', icon: 'ri-edit-line' },
  //   { path: '/evaluations', label: 'Evaluations', icon: 'ri-clipboard-line' },
  //   { path: '/problems', label: 'Problems', icon: 'ri-code-line', badge: 'BETA' },
  //   { path: '/report-card', label: 'Report Card', icon: 'ri-user-line', badge: 'BETA' },
  return (
    <aside className="parkinsans-light chaiteam-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="ri-graduation-cap-fill"></i>
        </div>
        <span className="logo-text">ChaiTeam</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <div className="nav-item-content">
              <div className="nav-item-icon">
                <i className={icon}></i>
              </div>
              <span className="nav-item-label">{label}</span>
              {badge && <span className="nav-item-badge">{badge}</span>}
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

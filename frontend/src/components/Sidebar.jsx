import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "dashboard", label: 'Dashboard', icon: 'ri-home-3-line' },
    { path: "batches", label: "Batches", icon: "ri-school-fill" },
    { path: "groups", label: "Groups", icon: "ri-group-fill" },
    { path: "noticeboard", label: "Noticeboard", icon: "ri-clapperboard-line" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`parkinsans-light chaiteam-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="ri-graduation-cap-fill"></i>
        </div>
        {!isCollapsed && <span className="logo-text">ChaiTeam</span>}
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
              {!isCollapsed && (
                <>
                  <span className="nav-item-label">{label}</span>
                  {badge && <span className="nav-item-badge">{badge}</span>}
                </>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Profile Section at Bottom */}
      <div className="sidebar-bottom">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            `sidebar-nav-item profile-item ${isActive ? "active" : ""}`
          }
        >
          <div className="nav-item-content">
            <div className="nav-item-icon">
              <i className="ri-user-line"></i>
            </div>
            {!isCollapsed && (
              <div className="profile-info">
                <span className="nav-item-label">Profile</span>
                <span className="user-name">Kumar Nirupam</span>
              </div>
            )}
          </div>
        </NavLink>

        {/* Collapse Toggle Button */}
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`ri-arrow-${isCollapsed ? 'right' : 'left'}-line`}></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
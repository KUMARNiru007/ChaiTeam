import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/sidebarSlice.js';

const Sidebar = () => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();

  const navItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'ri-home-3-line' },
    { path: 'batches', label: 'Batches', icon: 'ri-school-fill' },
    { path: 'groups', label: 'Groups', icon: 'ri-group-fill' },
    { path: 'noticeboard', label: 'Noticeboard', icon: 'ri-clapperboard-line' },
  ];

  return (
    <aside
      className={`parkinsans-light chaiteam-sidebar ${
        isCollapsed ? 'collapsed' : ''
      }`}
    >
      {/* Logo Section */}
      <NavLink to='/'>
        <div className='sidebar-logo text-center'>
          <div className='logo-icon'>
            <i className='ri-graduation-cap-fill'></i>
          </div>
          {!isCollapsed && (
            <span className='logo-text'>
              Chai
              <span className='text-[var(--chaiteam-orange)]'>Team</span>
            </span>
          )}
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className='sidebar-nav'>
        {navItems.map(({ path, label, icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isCollapsed ? 'group' : ''} ${
                isActive ? 'active' : ''
              }`
            }
          >
            <div className='nav-item-content'>
              <div className='nav-item-icon'>
                <i className={icon}></i>
              </div>
              {!isCollapsed && (
                <>
                  <span className='nav-item-label'>{label}</span>
                  {badge && <span className='nav-item-badge'>{badge}</span>}
                </>
              )}
            </div>

            {/* Navlink */}
            <div className='absolute top-3 left-[65px] transform opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none'>
              <div className='bg-[var(--chaiteam-bg-secondary)] text-white text-sm py-1 px-2 rounded-lg shadow-xl border border-[var(--chaiteam-border-secondary)] whitespace-nowrap'>
                <div className='text-center text-xs'>
                  <span>{label}</span>
                </div>
                <div
                  className='absolute top-1/2 -left-2 transform -translate-y-1/2 
                w-0 h-0 
                border-t-4 border-b-4 border-r-4 
                border-t-transparent border-b-transparent border-r-[var(--chaiteam-bg-secondary)]'
                ></div>
              </div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Profile Section at Bottom */}
      <div className='sidebar-bottom'>
        <NavLink
          to='profile'
          className={({ isActive }) =>
            `sidebar-nav-item profile-item ${isActive ? 'active' : ''}`
          }
        >
          <div className='nav-item-content'>
            <div className='nav-item-icon'>
              <i className='ri-user-line'></i>
            </div>
            {!isCollapsed && (
              <div className='profile-info'>
                <span className='nav-item-label'>Profile</span>
                <span className='user-name'>Kumar Nirupam</span>
              </div>
            )}
          </div>
        </NavLink>

        {/* Collapse Toggle Button */}
        <button
          className='sidebar-toggle'
          onClick={() => dispatch(toggleSidebar())}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`ri-arrow-${isCollapsed ? 'right' : 'left'}-line`}></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

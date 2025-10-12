import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext.jsx';
import { toggleSidebar } from '../redux/sidebarSlice.js';

const Sidebar = () => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const { darkMode } = useTheme();
  const profileModalRef = useRef(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'ri-home-3-line' },
    { path: '/batches', label: 'Batches', icon: 'ri-school-fill' },
    {
      path: '/noticeboard',
      label: 'Noticeboard',
      icon: 'ri-clapperboard-line',
    },
  ];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target)
      ) {
        setOpenProfileModal(false);
      }
    };

    if (openProfileModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openProfileModal]);

  return (
    <aside
      className={`parkinsans-light chaiteam-sidebar ${
        isCollapsed ? 'collapsed' : ''
      } ${darkMode ? '' : '!bg-white !text-black'} transition-all duration-200`}
    >
      {/* Logo Section */}
      <NavLink to='/'>
        <div className='sidebar-logo text-center'>
          <div className='logo-icon'>
            <i className='ri-graduation-cap-fill'></i>
          </div>
          {!isCollapsed && (
            <span className={`logo-text ${darkMode ? '' : '!text-black'}`}>
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
              <div
                className={` ${
                  darkMode
                    ? 'bg-[var(--chaiteam-bg-secondary)] text-white'
                    : 'text-[var(--chaiteam-bg-primary)] bg-white'
                } text-sm py-1 px-2 rounded-lg shadow-xl border border-[var(--chaiteam-border-secondary)] whitespace-nowrap`}
              >
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
      <div className='sidebar-bottom relative' ref={profileModalRef}>
        <button
          className={`sidebar-nav-item profile-item ${
            openProfileModal ? 'active' : ''
          }`}
          onClick={() => setOpenProfileModal(!openProfileModal)}
        >
          <div className='nav-item-content border border-[var(--chaiteam-border-primary)] rounded-lg'>
            <div className='nav-item-icon'>
              <i className='ri-user-line'></i>
            </div>
            {!isCollapsed && (
              <div className='profile-info'>
                <span className='nav-item-label'>Kumar Nirupam</span>
              </div>
            )}
          </div>
        </button>

        {/* Collapse Toggle Button */}
        <button
          className={`absolute -right-4 top-7 rounded-full border-[1px] px-1.5 py-1 cursor-pointer flex items-center justify-center ${
            darkMode
              ? 'bg-[var(--chaiteam-bg-secondary)] text-white border-[var(--chaiteam-border-primary)]'
              : 'text-[var(--chaiteam-bg-primary)] bg-white'
          }`}
          onClick={() => dispatch(toggleSidebar())}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i
            className={`ri-arrow-${
              isCollapsed ? 'right' : 'left'
            }-line text-xs`}
          ></i>
        </button>

        {/* Profile box open when click on the profile button */}
        {openProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.5, ease: 'easeInOut' }}
            className={`absolute -top-[140px] border-[1px] p-3 text-sm rounded-xl w-[210px] ${
              darkMode
                ? 'bg-[var(--chaiteam-bg-primary)] text-white border-white/30'
                : 'bg-white'
            }`}
          >
            <div className='w-full mb-1'>
              <span>Signed in as </span>
              <span className='font-semibold'>vt118452@gmail.com</span>
            </div>
            <div className='w-full mt-3 flex flex-col gap-2'>
              <NavLink
                to='profile'
                onClick={() => setOpenProfileModal(!openProfileModal)}
                className={`block w-full text-[15px] cursor-pointer px-1.5 py-1 rounded-md transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-[var(--chaiteam-bg-secondary)]/50 text-white hover:text-whit'
                    : 'hover:bg-gray-200'
                } `}
              >
                My profile
              </NavLink>
              <NavLink
                to='profile'
                onClick={() => setOpenProfileModal(!openProfileModal)}
                className='block w-full text-[15px] cursor-pointer px-1.5 py-1 rounded-md transition-all duration-200 hover:text-red-500 hover:bg-red-200'
              >
                Log Out
              </NavLink>
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

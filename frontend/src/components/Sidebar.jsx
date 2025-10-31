import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext.jsx';
import { toggleSidebar } from '../redux/sidebarSlice.js';
import { userService } from '../services/api';

const Sidebar = () => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleTheme } = useTheme();
  const profileModalRef = useRef(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'ri-home-3-line' },
    { path: '/batches', label: 'Batches', icon: 'ri-school-line' },
    {
      path: '/announcement',
      label: 'Announcement',
      icon: 'ri-megaphone-line',
    },
  ];
  const adminNavItems = [
    {
      path: '/create-batch',
      label: 'Manage Batches',
      icon: 'ri-add-box-line',
    },
    {
      path: '/allApplications',
      label: 'All Applications',
      icon: 'ri-mail-unread-line',
    },
    { path: '/allUsers', label: 'All Users', icon: 'ri-team-line' },
    { path: '/allGroups', label: 'All Groups', icon: 'ri-parent-line' },
  ];

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to empty user object to prevent errors
        setCurrentUser({ name: 'User', email: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

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

      {/* General Navigation */}
      <nav className='sidebar-nav h-screen'>
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
          </NavLink>
        ))}

        {/* Admin Navigation Section */}
        {currentUser?.role === 'ADMIN' && (
          <div className='mt-4 border-t border-gray-200 dark:border-gray-700 pt-3'>
            {!isCollapsed && (
              <h4 className='text-xs font-semibold uppercase opacity-70 px-4 mb-2'>
                Admin Panel
              </h4>
            )}
            {adminNavItems.map(({ path, label, icon }) => (
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
                    <span className='nav-item-label'>{label}</span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Profile Section at Bottom */}
      <div className='sidebar-bottom relative' ref={profileModalRef}>
        <button
          className={`sidebar-nav-item profile-item cursor-pointer ${
            openProfileModal ? 'active' : ''
          }`}
          onClick={() => setOpenProfileModal(!openProfileModal)}
        >
          <div className='nav-item-content border border-[var(--chaiteam-border-primary)] rounded-lg'>
            <div className='nav-item-icon'>
              {loading ? (
                <div className='w-6 h-6 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                </div>
              ) : currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className='w-6 h-6 rounded-full object-cover'
                />
              ) : (
                <i className='ri-user-line'></i>
              )}
            </div>
            {!isCollapsed && (
              <div className='profile-info'>
                <span className='nav-item-label'>
                  {loading ? 'Loading...' : currentUser?.name || 'User'}
                </span>
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

        {/* Profile Modal */}
        {openProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.5, ease: 'easeInOut' }}
            className={`absolute bottom-[78px] border-[1px] p-3 text-sm rounded-xl w-[250px] ${
              darkMode
                ? 'bg-[var(--chaiteam-bg-primary)] text-white border-white/30'
                : 'bg-white'
            }`}
          >
            <div className='w-full mb-1'>
              <span>Signed in as </span>
              <span className='font-semibold'>
                {loading ? 'loading...' : currentUser?.email || 'No email'}
              </span>
            </div>

            {/* User Info Section */}
            {currentUser && (
              <div className='flex items-center gap-3 py-2 border-t border-gray-200 dark:border-gray-600 mt-2'>
                <div className='flex-shrink-0'>
                  {currentUser.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
                      <i className='ri-user-line text-gray-600 dark:text-gray-300'></i>
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>
                    {currentUser.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {currentUser.role?.toLowerCase() || 'user'}
                  </p>
                </div>
              </div>
            )}

            <div className='w-full mt-3 flex flex-col gap-2'>
              <NavLink
                to='/profile'
                onClick={() => setOpenProfileModal(!openProfileModal)}
                className={`block w-full text-[15px] cursor-pointer px-1.5 py-1 rounded-md transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-[var(--chaiteam-bg-secondary)]/50 text-white hover:text-white'
                    : 'hover:bg-gray-200'
                } `}
              >
                My profile
              </NavLink>
              <button
                onClick={toggleTheme}
                className={`w-full text-[15px] cursor-pointer px-1.5 py-1 rounded-md transition-all duration-200 flex justify-between ${
                  darkMode
                    ? 'hover:bg-[var(--chaiteam-bg-secondary)]/50 text-white hover:text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                Toggle theme{' '}
                <i
                  className={`ri-${darkMode ? 'sun' : 'moon'}-fill text-lg`}
                ></i>
              </button>
              <NavLink
                to='/logout'
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

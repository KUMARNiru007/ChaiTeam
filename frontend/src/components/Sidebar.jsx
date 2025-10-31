import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext.jsx';
import { toggleSidebar } from '../redux/sidebarSlice.js';
import { userService } from '../services/api';
import profile from '../assets/avatar1.webp'

const Sidebar = () => {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleTheme } = useTheme();
  const profileModalRef = useRef(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'ri-dashboard-line mr-2' },
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

  // Enhanced user data fetching with error handling
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setCurrentUser({ 
          name: 'User', 
          email: 'user@example.com',
          role: 'USER',
          image: null 
        });
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

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    setOpenProfileModal(false);
    navigate('/logout');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

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

      {/* Enhanced Profile Section at Bottom */}
      <div className='sidebar-bottom relative' ref={profileModalRef}>
        {/* Keep the exact button structure as specified */}
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
                  src={currentUser.image || profile}
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

        {/* Enhanced Profile Modal */}
        <AnimatePresence>
          {openProfileModal && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute left-2 bottom-[78px] border-[1px] p-4 text-sm rounded-xl w-[250px] ${
                darkMode
                  ? 'bg-[var(--chaiteam-bg-primary)] text-white border-white/30'
                  : 'bg-white text-black border-gray-300'
              } shadow-xl`}
            >
              {/* User Info Section */}
              <div className='flex items-center gap-3 pb-3 mb-3 border-b border-gray-200 dark:border-gray-600'>
                <div className='flex-shrink-0'>
                  {currentUser?.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className='w-12 h-12 rounded-full object-cover border-2 border-[var(--chaiteam-orange)]'
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-[var(--chaiteam-orange)] ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}>
                      <span className='text-lg font-bold text-white'>
                        {getInitials(currentUser?.name)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-sm truncate'>
                    {currentUser?.name || 'User'}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-1'>
                    {currentUser?.email || 'No email'}
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      currentUser?.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : currentUser?.role === 'LEADER'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-200'
                    }`}>
                      {currentUser?.role?.toLowerCase() || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className='space-y-2'>
                <NavLink
                  to='/profile'
                  onClick={() => setOpenProfileModal(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'hover:bg-[var(--chaiteam-bg-secondary)] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <i className='ri-user-line text-base'></i>
                  <span>My Profile</span>
                </NavLink>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? 'hover:bg-[var(--chaiteam-bg-secondary)] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <i className='ri-contrast-2-line text-base'></i>
                    <span>Toggle Theme</span>
                  </div>
                  <i className={`ri-${darkMode ? 'sun' : 'moon'}-fill text-base`}></i>
                </button>
              </div>

              {/* Footer Section */}
              <div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-600'>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                >
                  <i className='ri-logout-box-r-line text-base'></i>
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext.jsx';
import { userService, authService } from '../services/api';
import profile from '../assets/avatar1.webp';

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileModalRef = useRef(null);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setCurrentUser(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

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

  const handleLogout = async () => {
    try {
      console.log('Logout initiated');
      await authService.logout();
      // console.log('Logout API call successful');
      
      // Clear any client-side storage
      localStorage.removeItem('isLoggedOut');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setOpenProfileModal(false);
      // console.log('Redirecting to home');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout API failed:', error);
      localStorage.removeItem('isLoggedOut');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setOpenProfileModal(false);
      window.location.href = '/';
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 z-20 backdrop-blur-xl w-full h-[75px] bg-transparent flex items-center justify-between px-20 text-2xl text-cente border-b-[1px]  transition-all duration-200 ${
        darkMode ? 'text-white border-[#343434]' : 'text-black border-black'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: 'easeIn' }}
    >
      <div className='cursor-pointer flex'>
        <div className='logo-icon'>
            <i className='ri-graduation-cap-fill'></i>
          </div>
        <Link to='/'>
          <span className='text-2xl text-[#F97316] font-bold'>Chai</span>
          <span className='text-2xl font-medium'>Hub</span>
        </Link>
      </div>

      <div className='flex items-center justify-center gap-5'>
        <button
          onClick={toggleTheme}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <i
            className={`ri-${darkMode ? 'sun' : 'moon'}-fill`}
            style={{
              color: `${darkMode ? '#ffffff' : '#000000'}`,
              fontSize: '18px',
            }}
          ></i>
        </button>

        {/* Conditionally render Login button or User Profile */}
        {loading ? (
          <div className="w-9 h-9 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : currentUser ? (
          // User is logged in - show profile photo
          <div className='relative' ref={profileModalRef}>
            <button
              className={`w-10 h-10 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                openProfileModal 
                  ? 'border-[var(--chaihub-orange)]' 
                  : 'border-transparent hover:border-[var(--chaihub-orange)]'
              }`}
              onClick={() => setOpenProfileModal(!openProfileModal)}
            >
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className='w-8 h-8 rounded-full object-cover'
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}>
                  <i className={`ri-user-line ${darkMode ? 'text-white' : 'text-black'}`}></i>
                </div>
              )}
            </button>

            {/* Profile Dropdown Modal */}
            {openProfileModal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`absolute right-0 top-12 border-[1px] p-4 text-sm rounded-xl w-64 ${
                  darkMode
                    ? 'bg-[var(--chaihub-bg-primary)] text-white border-white/30'
                    : 'bg-white text-black border-gray-300'
                } shadow-lg`}
              >
                {/* User Info Section */}
                <div className='flex items-center gap-3 pb-3 mb-3 border-b border-gray-200 dark:border-gray-600'>
                  <div className='flex-shrink-0'>
                    {currentUser.image ? (
                      <img
                        src={currentUser.image || profile}
                        alt={currentUser.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        <i className={`ri-user-line text-xl ${darkMode ? 'text-white' : 'text-black'}`}></i>
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>
                    Hi,  {currentUser.name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                      {currentUser.email}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
                      {currentUser.role?.toLowerCase() || 'user'}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className='space-y-2'>
                  <Link
                    to='/profile'
                    onClick={() => setOpenProfileModal(false)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      darkMode
                        ? 'hover:bg-[var(--chaihub-bg-secondary)] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className='ri-user-line mr-2'></i>
                    My Profile
                  </Link>
                  
                  <Link
                    to='/dashboard'
                    onClick={() => setOpenProfileModal(false)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      darkMode
                        ? 'hover:bg-[var(--chaihub-bg-secondary)] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className='ri-dashboard-line mr-2'></i>
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      darkMode
                        ? 'hover:bg-[var(--chaihub-bg-secondary)] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>
                      <i className='ri-contrast-2-line mr-2'></i>
                      Toggle Theme
                    </span>
                    <i className={`ri-${darkMode ? 'sun' : 'moon'}-fill`}></i>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  >
                    <i className='ri-logout-box-r-line mr-2'></i>
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <button
            style={{
              backgroundColor: 'var(--chaihub-btn-start)',
              color: `${darkMode ? 'white' : 'black'}`,
              border: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-normal)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                'var(--chaihub-btn-primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = 'var(--chaihub-btn-start)')
            }
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
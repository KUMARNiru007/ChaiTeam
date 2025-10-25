import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext.jsx';
import { toggleSidebar, setSidebar } from '../redux/sidebarSlice.js';

function Layout() {
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? 'bg-[var{--chaiteam-bg-primary)] text-white'
          : 'bg-white text-black'
      }`}
    >
      <div className='hidden md:block w-[280px] fixed top-0 left-0 h-full'>
        <Sidebar />
      </div>

      <div
        className={`flex-1 ${isCollapsed ? 'md:ml-[10px]' : 'md:ml-[260px]'}`}
      >
        <main className='parkinsans-light max-w-7xl mx-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

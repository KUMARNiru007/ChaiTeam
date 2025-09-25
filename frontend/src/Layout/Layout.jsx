import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-[280px] fixed top-0 left-0 h-full border-r border-gray-200">
        <Sidebar/>
      </div>
      
      <div className="flex-1 md:ml-[280px] p-4">
        <main className="max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
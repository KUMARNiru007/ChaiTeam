import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuthStore } from '../store/useAuthStore'

function Profile() {
  const { darkMode } = useTheme()
  const { authUser } = useAuthStore()

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-gray-400">Manage your account and settings.</p>
        </div>

        {/* Profile Card */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                {authUser?.profileImage ? (
                  <img 
                    src={authUser.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#333] to-[#111] text-2xl font-bold text-white">
                    {authUser?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{authUser?.fullName || 'Kumar Nirupam'}</h2>
                <p className="text-sm text-gray-400">@{authUser?.username || 'kumar.nirupam24_ee03bbia'}</p>
                <p className="text-sm text-gray-400">{authUser?.email || 'kumar.nirupam24@gmail.com'}</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Personal Information */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Full Name</p>
              <p className="font-medium">{authUser?.fullName || 'Kumar Nirupam'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Username</p>
              <p className="font-medium">@{authUser?.username || 'kumar.nirupam24_ee03bbia'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="font-medium">{authUser?.email || 'kumar.nirupam24@gmail.com'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="font-medium uppercase">{authUser?.role || 'STUDENT'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
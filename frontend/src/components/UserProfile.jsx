import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';
import profile from '../assets/avatar1.webp'

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        const userData = await userService.getUserById(userId);
        setUserData(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load user profile. User may not exist.');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);


  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!userId) return;
      try {
        setActivityLoading(true);
        setActivityError('');
        const activityData = await userService.getUserActivities(userId);
        
        const sortedActivities = activityData.sort((a, b) => {
          return new Date(b.createdAT) - new Date(a.createdAT);
        });
        
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch user activities:', error);
        setActivityError('Failed to load activities');
      } finally {
        setActivityLoading(false);
      }
    };

    fetchUserActivities();
  }, [userId]);

  if (loading) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--chaiteam-orange)] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-slate-300 dark:bg-slate-700 rounded-md p-2 text-lg cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i>
            </button>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-500"></i>
            </div>
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[var(--chaiteam-orange)] text-white rounded-lg hover:bg-[var(--chaiteam-orange)]/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex flex-col gap-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
            onClick={() => navigate(-1)}
            className={`rounded-md p-1 text-xl pl-2 pr-2 cursor-pointer transition-all duration-200 ${
                  darkMode
                    ? 'bg-[#313338] hover:bg-[#3b3d44] text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-black'
                }`}
          >
              <i className="ri-arrow-left-line"></i>
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-sm text-gray-400">Viewing {userData?.name}'s profile</p>
            </div>
          </div>

        </div>

        {/* Profile Card */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                {userData?.image ? (
                  <img 
                    src={userData.image || profile} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#333] to-[#111] text-2xl font-bold text-white">
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {userData?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-400">
                  {userData?.username ? `@${userData.username}` : ''}
                </p>
                <div className='flex items-center gap-2 mt-1'>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      userData?.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : userData?.role === 'LEADER'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {userData?.role?.toLowerCase() || 'user'}
                    </span>
                  </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    userData?.isVerified 
                      ? 'bg-green-100 text-green-900 dark:bg-green-200 dark:text-green-600' 
                      : ''
                  }`}>
                    {userData?.isVerified ? 'Verified' : ''}
                  </span>
                </div>
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
              <p className="font-medium">
                {userData?.name || 'No name available'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Username</p>
              <p className="font-medium">
                {userData?.username ? `@${userData.username}` : 'No username'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="font-medium uppercase">
                {userData?.role || 'USER'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="font-medium">
                {userData?.createdAT ? new Date(userData.createdAT).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* User Activity Section */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">User Activity</h2>
            <span className="text-sm text-gray-400">
              {activities.length} activities
            </span>
          </div>
          
          {activityLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            </div>
          ) : activityError ? (
            <p className="text-gray-400 text-center py-4">{activityError}</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No activities found for this user.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {activities.map((activity, index) => {
                // Map user activity types to UI properties
                const actionMap = {
                  ACCOUNT_CREATED: {
                    color: 'bg-green-500',
                    title: 'Account Created',
                    desc: activity.description || 'Account was successfully created.',
                  },
                  ACCOUNT_DELTED: {
                    color: 'bg-red-500',
                    title: 'Account Deleted',
                    desc: activity.description || 'Account was deleted.',
                  },
                  APPLIED_TO_JOIN_GROUP: {
                    color: 'bg-blue-500',
                    title: 'Applied to Join Group',
                    desc: activity.description || 'Applied to join a group.',
                  },
                  APLICATION_WITHDRAWN: {
                    color: 'bg-yellow-500',
                    title: 'Application Withdrawn',
                    desc: activity.description || 'Withdrew an application to join a group.',
                  },
                  JOINED_GROUP: {
                    color: 'bg-emerald-500',
                    title: 'Joined Group',
                    desc: activity.description || 'Joined a group.',
                  },
                  LEAVED_GROUP: {
                    color: 'bg-orange-500',
                    title: 'Left Group',
                    desc: activity.description || 'Left a group.',
                  },
                  KICKED_FROM_GROUP: {
                    color: 'bg-red-600',
                    title: 'Removed from Group',
                    desc: activity.description || 'Was removed from a group.',
                  },
                  CREATED_GROUP: {
                    color: 'bg-purple-500',
                    title: 'Group Created',
                    desc: activity.description || 'Created a new group.',
                  },
                  DISBANNED_GROUP: {
                    color: 'bg-pink-500',
                    title: 'Group Disbanded',
                    desc: activity.description || 'Disbanded a group.',
                  },
                  PROFILE_UPDATED: {
                    color: 'bg-cyan-500',
                    title: 'Profile Updated',
                    desc: activity.description || 'Updated profile information.',
                  },
                };

                const { color, title, desc } = actionMap[activity.action] || {
                  color: 'bg-gray-400',
                  title: 'Unknown Activity',
                  desc: activity.description || 'An action was performed.',
                };

                return (
                  <div
                    key={activity.id || index}
                    className={`flex items-start gap-3 rounded-xl p-4 border transition-all duration-200 shadow-sm ${
                      darkMode
                        ? 'bg-[#1f1f1f] border-[#2b2b2b] hover:bg-[#2a2a2a]'
                        : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${color}`}
                    ></div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3
                          className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-100' : 'text-gray-800'
                          }`}
                        >
                          {title}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {activity.createdAT
                            ? new Date(activity.createdAT).toLocaleString(
                                'en-IN',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                }
                              )
                            : 'Date not available'}
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
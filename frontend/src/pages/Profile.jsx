import {React,useEffect,useState} from 'react'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/api'; 

function Profile() {
  const { darkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setCurrentUser({ name: 'User', email: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch user activities
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!currentUser?.id) return;
      try {
        setActivityLoading(true);
        setActivityError('');
        const activityData = await userService.getUserActivity(currentUser.id);
        
        // Sort activities by createdAT in descending order (newest first)
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
  }, [currentUser?.id]);

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-gray-400">Manage your account and settings.</p>
          <button
            className='fixed z-10 right-12'
            onClick={toggleTheme}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: darkMode ? '1px solid #555' : '1px solid #ddd',
              backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
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
        </div>

        {/* Profile Card */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : currentUser?.image ? (
                  <img 
                    src={currentUser.image} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#333] to-[#111] text-2xl font-bold text-white">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {loading ? 'Loading...' : currentUser?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-400">
                  {currentUser?.username ? `@${currentUser.username}` : ''}
                </p>
                <p className="text-sm text-gray-400">
                  {loading ? 'Loading...' : currentUser?.email || 'No email available'}
                </p>
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
                {loading ? 'Loading...' : currentUser?.name || 'No name available'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Username</p>
              <p className="font-medium">
                {currentUser?.username ? `@${currentUser.username}` : 'No username'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="font-medium">
                {loading ? 'Loading...' : currentUser?.email || 'No email available'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="font-medium uppercase">
                {currentUser?.role || 'USER'}
              </p>
            </div>
          </div>
        </div>

        {/* User Activity Section */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#18181b] border border-[#333]' : 'bg-white border border-gray-200'}`}>
          <h2 className="text-lg font-semibold mb-4">User Activity</h2>
          
          {activityLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            </div>
          ) : activityError ? (
            <p className="text-gray-400 text-center py-4">{activityError}</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No activities found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {activities.map((activity, index) => {
                // Map user activity types to UI properties
                const actionMap = {
                  ACCOUNT_CREATED: {
                    color: 'bg-green-500',
                    title: 'Account Created',
                    desc: activity.description || 'Your account was successfully created.',
                  },
                  ACCOUNT_DELTED: {
                    color: 'bg-red-500',
                    title: 'Account Deleted',
                    desc: activity.description || 'Your account was deleted.',
                  },
                  APPLIED_TO_JOIN_GROUP: {
                    color: 'bg-blue-500',
                    title: 'Applied to Join Group',
                    desc: activity.description || 'You applied to join a group.',
                  },
                  APLICATION_WITHDRAWN: {
                    color: 'bg-yellow-500',
                    title: 'Application Withdrawn',
                    desc: activity.description || 'You withdrew an application to join a group.',
                  },
                  JOINED_GROUP: {
                    color: 'bg-emerald-500',
                    title: 'Joined Group',
                    desc: activity.description || 'You joined a group.',
                  },
                  LEAVED_GROUP: {
                    color: 'bg-orange-500',
                    title: 'Left Group',
                    desc: activity.description || 'You left a group.',
                  },
                  KICKED_FROM_GROUP: {
                    color: 'bg-red-600',
                    title: 'Removed from Group',
                    desc: activity.description || 'You were removed from a group.',
                  },
                  CREATED_GROUP: {
                    color: 'bg-purple-500',
                    title: 'Group Created',
                    desc: activity.description || 'You created a new group.',
                  },
                  DISBANNED_GROUP: {
                    color: 'bg-pink-500',
                    title: 'Group Disbanded',
                    desc: activity.description || 'You disbanded a group.',
                  },
                  PROFILE_UPDATED: {
                    color: 'bg-cyan-500',
                    title: 'Profile Updated',
                    desc: activity.description || 'You updated your profile information.',
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
  )
}

export default Profile
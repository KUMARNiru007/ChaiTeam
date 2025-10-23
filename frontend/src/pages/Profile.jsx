import {React,useEffect,useState} from 'react'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/api'; 

function Profile() {
  const { darkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Fetch current user data - same logic as Sidebar.jsx
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

  // Fetch user activities
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!currentUser?.id) return;
      try {
        setActivityLoading(true);
        const activityData = await userService.getUserActivity(currentUser.id);
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to fetch user activities:', error);
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
          <h2 className="text-lg font-semibold mb-4">Activity History</h2>
          
          {activityLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            </div>
          ) : activities.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No activities found.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-[#222] hover:bg-[#2a2a2a]' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      activity.type === 'JOIN_BATCH' ? 'bg-green-500' :
                      activity.type === 'LEAVE_BATCH' ? 'bg-red-500' :
                      activity.type === 'JOIN_GROUP' ? 'bg-blue-500' :
                      activity.type === 'LEAVE_GROUP' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.type === 'JOIN_BATCH' && 'Joined batch'}
                        {activity.type === 'LEAVE_BATCH' && 'Left batch'}
                        {activity.type === 'JOIN_GROUP' && 'Joined group'}
                        {activity.type === 'LEAVE_GROUP' && 'Left group'}
                        {activity.type === 'OTHER' && activity.description}
                        {' '}
                        <span className="font-medium">{activity.description}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.createdAt ? new Date(activity.createdAt).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : 'Date not available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
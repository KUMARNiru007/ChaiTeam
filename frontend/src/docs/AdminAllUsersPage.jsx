import React, { useState, useEffect } from 'react';
import { userService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminAllUsersPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [actionType, setActionType] = useState(''); 


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error('Error while fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePromoteClick = (user) => {
    setSelectedUser(user);
    setActionType('promote');
    setShowModal(true);
  };

  const handleDemoteClick = (user) => {
    setSelectedUser(user);
    setActionType('demote');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setActionType('');
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      await userService.updateRole(selectedUser.id);
      
      const newRole = selectedUser.role === 'USER' ? 'ADMIN' : 'USER';
      
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      setSelectedUser((prev) => ({ ...prev, role: newRole }));
      setSuccessModal(true);
    } catch (err) {
      console.error('Error updating role:', err);
      setErrorModal(true);
    } finally {
      setUpdating(false);
      setShowModal(false);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div className='p-6 max-w-6xl relative flex flex-col items-center'>
      
      {/* ===== Heading ===== */}
      <h2
        className={`text-3xl font-semibold mb-2 text-center ${
          darkMode ? 'text-white' : 'text-gray-600'
        }`}
      >
        All Students
      </h2>

      <p
        className={`text-sm font-semibold text-center mb-6 ${
          darkMode ? 'text-white/70' : 'text-gray-500'
        }`}
      >
        You can view all students here and also change their roles.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div
            className='spinner'
            style={{
              border: '4px solid rgba(255, 161, 22, 0.8)',
              borderLeft: '4px solid #ffffff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '1rem auto',
            }}
          ></div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>

          <p style={{ marginTop: '1rem', color: '#b3b3b3' }}>Loading...</p>
        </div>
      ) : error ? (

        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4f' }}>
          <i className='ri-error-warning-line' style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '1rem' }}>{error}</p>

          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/*user cards */}
          {users.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md transition-all duration-300 ${
                    darkMode
                      ? 'bg-[#18181B] text-white hover:bg-[#2b2b2b]'
                      : 'bg-white text-black hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  <img
                    src={user.image || '/default-avatar.png'}
                    alt={user.name}
                    className='w-20 h-20 rounded-full mb-4 object-cover border-2 border-gray-300'
                  />
                  <h3 className='text-lg font-semibold'>{user.name}</h3>
                  <p className='text-sm text-gray-500 mb-2'>{user.email}</p>

                  <span
                    className={`px-3 py-1 rounded-full text-sm mb-4 ${
                      user.role === 'ADMIN'
                        ? 'bg-green-200 text-green-700'
                        : 'bg-blue-200 text-blue-700'
                    }`}
                  >
                    {user.role}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleViewProfile(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } transition-colors cursor-pointer`}
                    >
                      <i className='ri-user-line text-xs'></i>
                      View Profile
                    </button>
                    
                    <button
                      onClick={() => 
                        user.role === 'USER' 
                          ? handlePromoteClick(user) 
                          : handleDemoteClick(user)
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        user.role === 'USER'
                          ? (darkMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white')
                          : (darkMode
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white')
                      } transition-colors cursor-pointer`}
                    >
                      <i className={`text-xs ${
                        user.role === 'USER' 
                          ? 'ri-user-star-line' 
                          : 'ri-user-unfollow-line'
                      }`}></i>
                      {user.role === 'USER' ? 'Promote' : 'Demote'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-slate-300 text-red-500 flex items-center justify-center text-center min-w-2xl mt-5 min-h-20 text-xl'>
              No Users are currently registered on the Platform.
            </div>
          )}
        </>
      )}

      {showModal && selectedUser && (
        <div className='fixed inset-0 bg-black/30 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h3 className='text-xl font-semibold text-center'>
              Manage User Role
            </h3>

            <div className='flex flex-col items-center mb-4 mt-4'>
              <img
                src={selectedUser.image || '/default-avatar.png'}
                alt={selectedUser.name}
                className='w-20 h-20 rounded-full mb-3 object-cover border-2 border-gray-300'
              />
              <p className='text-lg font-medium'>{selectedUser.name}</p>
              <p className='text-sm text-gray-500 mb-3'>{selectedUser.email}</p>
              <p
                className={`text-sm font-semibold mb-2 ${
                  selectedUser.role === 'ADMIN'
                    ? 'text-green-500'
                    : 'text-blue-500'
                }`}
              >
                Current Role: {selectedUser.role}
              </p>
            </div>

            <div className='text-center mb-4'>
              <p className='text-lg font-medium'>
                {actionType === 'promote' 
                  ? 'Promote to Admin?' 
                  : 'Demote to User?'}
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                {actionType === 'promote'
                  ? 'This user will gain admin privileges.'
                  : 'This user will lose admin privileges.'}
              </p>
            </div>

            <button
              onClick={handleRoleChange}
              disabled={updating}
              className={`w-full text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer ${
                actionType === 'promote' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {updating ? 'Updating...' : actionType === 'promote' ? 'Promote to Admin' : 'Demote to User'}
            </button>

            <button
              onClick={handleCloseModal}
              className={`w-full mt-3 border py-2 rounded-lg transition cursor-pointer ${
                darkMode
                  ? 'border-white/30 hover:bg-[#27272A]'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {successModal && (
        <div className='fixed inset-0 bg-black/30 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-lg font-semibold mb-3 text-center'>
              User Role Updated Successfully
            </h2>
            <button
              onClick={() => setSuccessModal(false)}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {errorModal && (
        <div className='fixed inset-0 bg-black/30 flex justify-center items-center z-50'>
          <div
            className={`rounded-xl p-6 w-96 ${
              darkMode ? 'bg-[#18181B] text-white' : 'bg-white text-black'
            }`}
          >
            <h2 className='text-lg font-semibold mb-3 text-center text-red-500'>
              Failed to Update User Role
            </h2>
            <button
              onClick={() => setErrorModal(false)}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllUsersPage;
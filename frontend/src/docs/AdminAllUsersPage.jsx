import React, { useState, useEffect } from 'react';
import { userService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown.jsx';

const AdminAllUsersPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [actionType, setActionType] = useState(''); 
  const [selectedRole, setSelectedRole] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Role filter options
  const roleOptions = [
    { id: 1, label: 'All Roles', value: 'all' },
    { id: 2, label: 'Admin', value: 'ADMIN' },
    { id: 3, label: 'User', value: 'USER' }
  ];

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

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      selectedRole === 'all' || 
      user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

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
   <div className='realtive parkinsans-light text-center p-6'>
      {/* Heading */}
      <h2
          className={`text-3xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          } mb-2`}
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

      {/* Search and Filter Section =*/}
      <div className='flex flex-col gap-4 md:flex-row md:items-center mt-8'>
        {/* Search Input */}
        <div className='flex-1 w-full md:w-2/4'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <i
                className={`ri-search-line ${
                  darkMode ? 'text-gray-50' : 'text-black'
                }`}
              ></i>
            </span>
            <input
              type='text'
              placeholder='Search users by name or email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border ${
                darkMode
                  ? 'bg-[#27272A] text-white placeholder-gray-50 border-white/30'
                  : 'border-gray-300 bg-gray-50 text-gray-600 placeholder-gray-400 focus:bg-gray-100'
              } py-2 pl-9 pr-2 focus:outline-none`}
            />
          </div>
        </div>

        {/* Role Filter Dropdown */}
        <div className='relative w-full md:w-1/4'>
          <CustomDropdown
            options={roleOptions}
            placeholder='All Roles'
            onSelect={(option) => {
              setSelectedRole(option.value);
            }}
          />
        </div>
      </div>

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
          {/* User cards */}
          {filteredUsers.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-6'>
              {filteredUsers.map((user) => (
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
                    className={`px-3 py-1 rounded text-sm mb-4 ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-300'
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
              {users.length === 0 
                ? "No Users are currently registered on the Platform."
                : "No users match your search criteria."
              }
            </div>
          )}
        </>
      )}

      {/* Rest of the modals remain the same */}
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
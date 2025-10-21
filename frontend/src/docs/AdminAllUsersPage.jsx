import React, { useState, useEffect } from 'react';
import { userService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';

const AdminAllUsersPage = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Error while fetching the Users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const response = await userService.updateRole(selectedUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: 'ADMIN' } : u,
        ),
      );
      setSelectedUser((prev) => ({ ...prev, role: 'ADMIN' }));
      // alert('User role updated successfully!');
      setSuccessModal(true);
    } catch (err) {
      console.error('Error updating role:', err);
      // alert('Failed to update role!');
      setErrorModal(true);
    } finally {
      setUpdating(false);
      setShowModal(false);
    }
  };

  return (
    <div className='p-6 max-w-6xl relative flex flex-col items-center'>
      <h2 className='text-3xl font-semibold mb-6 text-center text-gray-800'>
        All Students
      </h2>
      <p className='text-sm font-semibold text-center mb-4 text-gray-500'>
        You can view all students on the platform here and also change their
        roles.
      </p>

      {users.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleCardClick(user)}
              className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl shadow-md transition-all duration-300 ${
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
                className={`px-3 py-1 rounded-full text-sm ${
                  user.role === 'ADMIN'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-blue-200 text-blue-700'
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-slate-300 text-red-500 flex items-center justify-center text-center min-w-2xl mt-5 min-h-20 text-xl'>
          No Users are currently registered on the Platform.
        </div>
      )}

      {/* ===== Modal for Role Change ===== */}
      {showModal && selectedUser && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
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

            {selectedUser.role === 'ADMIN' ? (
              <p className='text-center text-red-400'>
                This user is already an admin. Role cannot be changed.
              </p>
            ) : (
              <button
                onClick={handleRoleChange}
                disabled={updating}
                className='w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer'
              >
                {updating ? 'Updating...' : 'Promote to Admin'}
              </button>
            )}

            <button
              onClick={handleCloseModal}
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {successModal && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
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
              className='w-full mt-3 border border-gray-400 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
            >
              Close
            </button>
          </div>
        </div>
      )}

      {errorModal && (
        <div className='fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50'>
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

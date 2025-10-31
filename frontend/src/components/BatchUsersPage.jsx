import React, { useState, useEffect } from 'react';
import { batchService, userService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown.jsx';
import profile from '../assets/avatar1.webp';

const BatchUsersPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userBatches, setUserBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Batch filter options - now as state to trigger re-renders
  const [batchOptions, setBatchOptions] = useState([
    { id: 1, label: 'All Batches', value: 'all' },
  ]);

  useEffect(() => {
    const fetchUserBatchesAndUsers = async () => {
      try {
        setLoading(true);
        
        // Get user's batches
        const batches = await batchService.getUserBatches();
        setUserBatches(batches || []);
        
        // Update batch options with state setter
        if (batches && batches.length > 0) {
          const batchDropdownOptions = batches.map((batch, index) => ({
            id: index + 2,
            label: batch.name,
            value: batch.id
          }));
          
          setBatchOptions([
            { id: 1, label: 'All Batches', value: 'all' },
            ...batchDropdownOptions
          ]);
        }

        // Get all users from user's batches
        const allBatchUsers = [];
        
        // Fetch users for each batch
        if (batches && batches.length > 0) {
          for (const batch of batches) {
            try {
              const batchDetails = await batchService.getBatchById(batch.id);
              if (batchDetails && batchDetails.batchMembers) {
                // Add batch info to each user for filtering
                const usersWithBatchInfo = batchDetails.batchMembers.map(user => ({
                  ...user,
                  batchId: batch.id,
                  batchName: batch.name
                }));
                allBatchUsers.push(...usersWithBatchInfo);
              }
            } catch (batchError) {
              console.error(`Error fetching users for batch ${batch.id}:`, batchError);
            }
          }

          // Remove duplicate users (users might be in multiple batches)
          const uniqueUsers = allBatchUsers.reduce((acc, current) => {
            const existingUser = acc.find(item => item.id === current.id);
            if (!existingUser) {
              // If user doesn't exist, add them with batchNames array
              return [...acc, {
                ...current,
                batchNames: [current.batchName]
              }];
            } else {
              // If user exists, add the new batch name to their batchNames array
              if (!existingUser.batchNames.includes(current.batchName)) {
                existingUser.batchNames.push(current.batchName);
              }
              return acc;
            }
          }, []);

          setUsers(uniqueUsers);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error while fetching batch users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBatchesAndUsers();
  }, []);

  // Filter users based on search term and selected batch
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = 
      selectedBatch === 'all' || 
      user.batchId === selectedBatch ||
      (user.batchNames && user.batchNames.some(batchName => 
        userBatches.some(batch => 
          batch.id === selectedBatch && batch.name === batchName
        )
      ));

    return matchesSearch && matchesBatch;
  });

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  // If user has no batches
  if (userBatches.length === 0 && !loading) {
    return (
      <div className='parkinsans-light text-center p-6'>
        <h2 className={`text-3xl font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        } mb-2`}>
          Batch Users
        </h2>
        <p className={`text-sm font-semibold text-center mb-6 ${
          darkMode ? 'text-white/70' : 'text-gray-500'
        }`}>
          You need to be enrolled in at least one batch to view users.
        </p>
        <div className='bg-slate-300 text-gray-600 flex items-center justify-center text-center min-w-2xl mt-5 min-h-20 text-xl rounded-lg'>
          You are not enrolled in any batches yet.
        </div>
      </div>
    );
  }

  return (
    <div className='relative parkinsans-light text-center p-6'>
      {/* Heading */}
      <h2 className={`text-3xl font-semibold ${
        darkMode ? 'text-white' : 'text-gray-800'
      } mb-2`}>
        Batch Users
      </h2>

      <p className={`text-sm font-semibold text-center mb-6 ${
        darkMode ? 'text-white/70' : 'text-gray-500'
      }`}>
        View users from your batches and connect with them.
      </p>

      {/* Search and Filter Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center mt-8'>
        {/* Search Input */}
        <div className='flex-1 w-full md:w-2/4'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <i className={`ri-search-line ${
                darkMode ? 'text-gray-50' : 'text-black'
              }`}></i>
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

        {/* Batch Filter Dropdown - Show if user has at least one batch */}
        {userBatches.length > 0 && (
          <div className='relative w-full md:w-1/4'>
            <CustomDropdown
              options={batchOptions}
              placeholder='All Batches'
              onSelect={(option) => {
                setSelectedBatch(option.value);
              }}
            />
          </div>
        )}
      </div>

      {/* Batch filter info */}
      {selectedBatch !== 'all' && (
        <div className='mt-4 text-center'>
          <span className={`px-3 py-1 rounded-full text-sm ${
            darkMode 
              ? 'bg-blue-900 text-blue-200' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            Showing users from: {
              batchOptions.find(opt => opt.value === selectedBatch)?.label || 'Selected Batch'
            }
          </span>
        </div>
      )}

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
                    src={user.image || profile}
                    alt={user.name}
                    className='w-20 h-20 rounded-full mb-4 object-cover border-2 border-gray-300'
                  />
                  <h3 className='text-lg font-semibold'>{user.name}</h3>
                  <p className='text-sm text-gray-500 mb-2'>{user.email}</p>

                  {/* Batch Info */}
                  <div className='mb-4'>
                    <span className={`px-3 py-1 rounded text-sm ${
                      darkMode 
                        ? 'bg-blue-900 text-blue-200' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.batchNames ? user.batchNames.join(', ') : user.batchName}
                    </span>
                  </div>

                  {/* Action Button */}
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
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-slate-300 text-gray-600 flex items-center justify-center text-center min-w-2xl mt-5 min-h-20 text-xl rounded-lg'>
              {users.length === 0 
                ? "No users found in your batches."
                : selectedBatch !== 'all'
                ? `No users found in the selected batch. Try selecting "All Batches".`
                : "No users match your search criteria."
              }
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BatchUsersPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { batchService, groupService } from '../services/api';
import Groups from './Groups';

function BatchPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGroups, setShowGroups] = useState(true);

  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true);
        const [batch, group] = await Promise.all([
          batchService.getBatchById(batchId),
          groupService.getUserGroup(batchId).catch(() => null),
        ]);
        setBatchData(batch);
        setUserGroup(group);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch batch details:', err);
        setError('Failed to load batch details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId]);

  return (
    <div
      className='parkinsans-light min-h-screen transition-all duration-200'
      style={{ padding: '1.5rem' }}
    >
      {loading ? (
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <div
              className='spinner mx-auto'
              style={{
                border: '4px solid rgba(255, 161, 22, 0.2)',
                borderLeft: '4px solid rgba(255, 161, 22, 0.8)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
            <p
              className={`mt-4 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Loading batch details...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div
            className={`text-center p-8 rounded-2xl ${
              darkMode ? 'bg-red-900/20' : 'bg-red-50'
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-red-900/40' : 'bg-red-100'
              }`}
            >
              <i className='ri-error-warning-line text-3xl text-red-500'></i>
            </div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Oops! Something went wrong
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors duration-200'
            >
              Try Again
            </button>
          </div>
        </div>
      ) : batchData ? (
        <div className='max-w-7xl mx-auto'>
          {/* Header Section with Banner */}
          <div
            className={`relative rounded-2xl overflow-hidden mb-6 ${
              darkMode ? 'bg-[#2b2d31]' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Banner Image */}
            <div className='h-48 w-full overflow-hidden relative'>
              <img
                src={
                  batchData.bannerImageUrl ||
                  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80'
                }
                alt={batchData.name}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
            </div>

            {/* Batch Info Overlay */}
            <div className='absolute bottom-0 left-0 right-0 p-6'>
              <div className='flex items-end gap-6'>
                {/* Batch Logo */}
                <div
                  className={`w-24 h-24 rounded-2xl border-4 overflow-hidden shadow-xl ${
                    darkMode ? 'border-[#2b2d31]' : 'border-white'
                  }`}
                >
                  <img
                    src={
                      batchData.logoImageUrl ||
                      'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(batchData.name) +
                        '&size=96&background=5865f2&color=fff&bold=true'
                    }
                    alt={batchData.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Batch Name and Description */}
                <div className='flex-1 pb-2'>
                  <div className='flex justify-start gap-3'>
                    <h1 className='text-3xl font-bold text-white drop-shadow-lg !mb-2'>
                      {batchData.name}
                    </h1>
                    <i className='ri-verified-badge-fill text-green-400 text-3xl drop-shadow-lg'></i>
                  </div>
                  <p className='text-white/90 text-sm drop-shadow-md max-w-2xl mb-2'>
                    {batchData.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                darkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              <i className={`ri-${darkMode ? 'sun' : 'moon'}-fill text-lg`}></i>
            </button>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div
              className={`p-5 rounded-xl transition-all duration-200 ${
                darkMode
                  ? 'bg-[var(--chaiteam-card-bg)] hover:bg-[#313338]/50'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-green-500/20' : 'bg-green-100'
                  }`}
                >
                  <i className='ri-signal-tower-line text-green-500 text-xl'></i>
                </div>
                <div className='flex flex-col'>
                  <p
                    className={`text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Status
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {batchData.status}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-xl transition-all duration-200 ${
                darkMode
                  ? 'bg-[var(--chaiteam-card-bg)] hover:bg-[#313338]/50'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}
                >
                  <i className='ri-group-line text-blue-500 text-xl'></i>
                </div>
                <div>
                  <p
                    className={`text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Total Members
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {batchData.batchMembers?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-xl transition-all duration-200 ${
                darkMode
                  ? 'bg-[var(--chaiteam-card-bg)] hover:bg-[#313338]/50'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}
                >
                  <i className='ri-team-line text-purple-500 text-xl'></i>
                </div>
                <div>
                  <p
                    className={`text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Your Status
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {userGroup ? 'Enrolled' : 'Not Enrolled'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User's Group Card */}
          {/* {userGroup && (
            <Link
              className={`p-6 rounded-2xl mb-6 transition-all duration-200 ${
                darkMode
                  ? 'bg-gradient-to-br from-orange-600 to-blue-400 hover:from-orange-700 hover:to-blue-800'
                  : 'bg-gradient-to-br from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700'
              } cursor-pointer shadow-lg hover:shadow-xl`}
              to='groups'
            >
              <div className='flex items-start justify-between mb-1'>
                <div className='flex items-start gap-3'>
                  <div className='w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                    <i className='ri-star-fill text-white text-lg'></i>
                  </div>
                  <div>
                    <p className='text-white/80 text-xs font-medium mb-0.5'>
                      Your Group
                    </p>
                    <h3 className='text-white font-bold text-xl'>
                      {userGroup.name}
                    </h3>
                  </div>
                </div>
                <i className='ri-arrow-right-line text-white text-xl'></i>
              </div>
              <p className='text-white/90 text-sm leading-relaxed'>
                {userGroup.description || 'No description available'}
              </p>
            </Link>
          )} */}

          {/* Toggle Button */}
          <div className='flex justify-between items-center mb-1'>
            <h2
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              All Groups
            </h2>
          </div>

          {/* Content Area */}
          {showGroups ? (
            <Groups batchId={batchId} userGroupId={userGroup?.id} />
          ) : (
            // <div
            //   className={`rounded-2xl p-6 ${
            //     darkMode ? 'bg-[#2b2d31]' : 'bg-white border border-gray-200'
            //   }`}
            // >
            //   <h3
            //     className={`text-lg font-bold mb-4 ${
            //       darkMode ? 'text-white' : 'text-gray-900'
            //     }`}
            //   >
            //     Batch Information
            //   </h3>
            //   <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            //     <div
            //       className={`p-5 rounded-xl ${
            //         darkMode ? 'bg-[#1e1f22]' : 'bg-gray-50'
            //       }`}
            //     >
            //       <div className='flex items-center gap-3 mb-3'>
            //         <i
            //           className={`ri-information-line text-xl ${
            //             darkMode ? 'text-blue-400' : 'text-blue-500'
            //           }`}
            //         ></i>
            //         <h4
            //           className={`font-semibold ${
            //             darkMode ? 'text-white' : 'text-gray-900'
            //           }`}
            //         >
            //           Batch Status
            //         </h4>
            //       </div>
            //       <p
            //         className={`text-sm ${
            //           darkMode ? 'text-gray-300' : 'text-gray-600'
            //         }`}
            //       >
            //         Current status:{' '}
            //         <span className='font-semibold'>{batchData.status}</span>
            //       </p>
            //     </div>

            //     <div
            //       className={`p-5 rounded-xl ${
            //         darkMode ? 'bg-[#1e1f22]' : 'bg-gray-50'
            //       }`}
            //     >
            //       <div className='flex items-center gap-3 mb-3'>
            //         <i
            //           className={`ri-user-line text-xl ${
            //             darkMode ? 'text-green-400' : 'text-green-500'
            //           }`}
            //         ></i>
            //         <h4
            //           className={`font-semibold ${
            //             darkMode ? 'text-white' : 'text-gray-900'
            //           }`}
            //         >
            //           Members Count
            //         </h4>
            //       </div>
            //       <p
            //         className={`text-sm ${
            //           darkMode ? 'text-gray-300' : 'text-gray-600'
            //         }`}
            //       >
            //         Total enrolled:{' '}
            //         <span className='font-semibold'>
            //           {batchData.batchMembers?.length || 0} students
            //         </span>
            //       </p>
            //     </div>

            //     <div
            //       className={`p-5 rounded-xl md:col-span-2 ${
            //         darkMode ? 'bg-[#1e1f22]' : 'bg-gray-50'
            //       }`}
            //     >
            //       <div className='flex items-center gap-3 mb-3'>
            //         <i
            //           className={`ri-file-text-line text-xl ${
            //             darkMode ? 'text-purple-400' : 'text-purple-500'
            //           }`}
            //         ></i>
            //         <h4
            //           className={`font-semibold ${
            //             darkMode ? 'text-white' : 'text-gray-900'
            //           }`}
            //         >
            //           Description
            //         </h4>
            //       </div>
            //       <p
            //         className={`text-sm leading-relaxed ${
            //           darkMode ? 'text-gray-300' : 'text-gray-600'
            //         }`}
            //       >
            //         {batchData.description ||
            //           'No description available for this batch.'}
            //       </p>
            //     </div>
            //   </div>
            // </div>
            <div>Snket</div>
          )}
        </div>
      ) : (
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div
            className={`text-center p-8 rounded-2xl ${
              darkMode ? 'bg-[#2b2d31]' : 'bg-gray-50'
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <i
                className={`ri-folder-open-line text-3xl ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              ></i>
            </div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              No Batch Found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The batch you're looking for doesn't exist.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { batchService, groupService, noticeService } from '../services/api';
import Groups from './Groups';

function BatchPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGroups, setShowGroups] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState(null);

  const { darkMode, toggleTheme } = useTheme();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'groups', label: 'Groups' },
    { id: 'noticeboard', label: 'Noticeboard' },
  ];

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
      // Fetch notices when batch ID is available
      const fetchBatchNotices = async () => {
        try {
          setNoticesLoading(true);
          const batchNotices = await noticeService.getBatchNotices(batchId);
          setNotices(batchNotices);
          setNoticesError(null);
        } catch (err) {
          console.error('Failed to fetch batch notices:', err);
          setNoticesError('Failed to load notices. Please try again.');
        } finally {
          setNoticesLoading(false);
        }
      };
      fetchBatchNotices();
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

          {/* Tabs */}
          <div className='flex gap-4 mb-4 mt-4 border-b border-gray-200'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold transition rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[var(--chaiteam-orange)] text-[var(--chaiteam-orange)]'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-[#2b2d31]' : 'bg-white'
            } border border-gray-200`}
          >
            {activeTab === 'overview' && (
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-1'>
                  <span className='text-xl font-semibold'>About</span>
                  <span className='text-sm'>{batchData.description}</span>
                </div>

                <div className='flex flex-col gap-1'>
                  <span className='text-xl font-semibold'>Details</span>
                  <div className='mt-1'>
                    <div className='flex justify-between border border-b-0 rounded-t-lg border-black p-2 px-2'>
                      <span>Batch Admin</span>
                      <span>{batchData.admin?.name || 'Not assigned'}</span>
                    </div>
                    <div className='flex justify-between border border-b-0 border-black p-2 px-2'>
                      <span>Total Members</span>
                      <span>{batchData.batchMembers?.length || 0} Members</span>
                    </div>
                    <div className='flex justify-between border border-b-0 border-black p-2 px-2'>
                      <span>Status</span>
                      <span>{batchData.status}</span>
                    </div>
                    <div className='flex justify-between border rounded-b-lg border-black p-2 px-2'>
                      <span>Batch ID</span>
                      <span>{batchData.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            

            {activeTab === 'groups' && (
              <div>
                {showGroups && <Groups batchId={batchId} userGroupId={userGroup?.id} />}
              </div>
            )}

            {activeTab === 'noticeboard' && (
              <div>
                {noticesLoading ? (
                  <div className="text-center p-8">
                    <div className={`spinner mx-auto`} style={{
                      border: '4px solid rgba(255, 161, 22, 0.2)',
                      borderLeft: '4px solid rgba(255, 161, 22, 0.8)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Loading notices...
                    </p>
                  </div>
                ) : noticesError ? (
                  <div className={`text-center p-8 rounded-xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-red-900/40' : 'bg-red-100'
                    }`}>
                      <i className='ri-error-warning-line text-2xl text-red-500'></i>
                    </div>
                    <p className={`mt-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{noticesError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className='mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200'
                    >
                      Try Again
                    </button>
                  </div>
                ) : notices.length === 0 ? (
                  <div className='text-center py-8'>
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <i className='ri-chat-unread-line text-3xl text-gray-400'></i>
                    </div>
                    <p className='mt-4 text-gray-500'>No notices yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className={`p-4 rounded-xl transition-all duration-200 ${
                          darkMode
                            ? 'bg-[#313338] hover:bg-[#2b2d31] border border-[#404249]'
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notice.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notice.type === 'PINNED' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notice.type.toLowerCase()}
                          </span>
                        </div>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-user-line"></i>
                            <span>{notice.createdBy?.name || 'Unknown'}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <i className="ri-time-line"></i>
                            <span>
                              {new Date(notice.createdAt).toLocaleString()}
                              {notice.isEdited && ' (edited)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

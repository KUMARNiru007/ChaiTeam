import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  batchService,
  groupService,
  noticeService,
  userService,
} from '../services/api.js';
import Groups from './Groups';
import EditNoticeModal from '../components/EditNoticeModal.jsx';
import CreateNoticeModal from '../components/CreateNoticeModel.jsx';
import CreateGroupModal from '../components/CreateGroupModal.jsx';

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
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { darkMode, toggleTheme } = useTheme();

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleUpdateNotice = (updatedNotice) => {
    setNotices(
      notices.map((notice) =>
        notice.id === updatedNotice.id ? updatedNotice : notice,
      ),
    );
  };

  const handleDeleteNotice = (noticeId) => {
    setNotices(notices.filter((notice) => notice.id !== noticeId));
  };

  const handleCreateNotice = (newNotice) => {
    setNotices([newNotice, ...notices]);
  };

  const handleCreateGroup = () => {
    // Refresh user group data after creating a group
    refreshUserGroup();
    setShowCreateGroupModal(false);
  };

  const refreshUserGroup = async () => {
    try {
      const group = await groupService.getUserGroup(batchId).catch(() => null);
      setUserGroup(group);
    } catch (err) {
      console.error('Failed to refresh user group:', err);
    }
  };

  const refreshNotices = async () => {
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'groups', label: 'Groups' },
    { id: 'noticeboard', label: 'Noticeboard' },
  ];

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true);
        const [batch, group, user] = await Promise.all([
          batchService.getBatchById(batchId),
          groupService.getUserGroup(batchId).catch(() => null),
          userService.getCurrentUser().catch(() => null),
        ]);
        setBatchData(batch);
        setUserGroup(group);
        setCurrentUser(user);
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
      refreshNotices();
    }
  }, [batchId]);

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div
      style={{ padding: '0rem 1.5rem 1.5rem 1.5rem' }}
      className='parkinsans-light'
    >
      {/* Navigation*/}
      <div className='sticky top-0 w-full bg-white text-black p-2 flex items-center justify-between shadow-sm z-50 '>
        <div className='flex gap-1'>
          <button
            onClick={() => navigate(-1)}
            className='bg-slate-300 rounded-md p-1 text-xl pl-2 pr-2 cursor-pointer'
          >
            <i className='ri-arrow-left-line'></i>
          </button>
          <button
            onClick={() => navigate(1)}
            className='bg-slate-300 rounded-md p-1 text-xl pl-2 pr-2 cursor-pointer'
          >
            <i className='ri-arrow-right-line'></i>
          </button>
        </div>
        <div className='w-full h-full text-center flex flex-col items-center font-semibold text-xl'>
          <span>{batchData?.name || 'Loading...'}</span>
        </div>
      </div>

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
              <div className='absolute'></div>
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

          {/* Tabs Section with Action Buttons */}
          <div className='relative mb-4 mt-4'>
            <div className='flex gap-4 border-b border-gray-200'>
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

            {/* Action Buttons */}
            <div className='absolute right-0 top-0 flex gap-2'>
              {/* Create Group button - only show if user doesn't have a group */}
              {!userGroup && (
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className='px-4 py-2 bg-[var(--chaiteam-info)] text-white rounded-xl hover:bg-[var(--chaiteam-info)]/90 
                  cursor-pointer transition-all duration-200 flex items-center gap-2'
                >
                  <i className='ri-add-line'></i>
                  Create Group
                </button>
              )}

              {/* Create Notice Button for Admin */}
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className='px-4 py-2 bg-[var(--chaiteam-orange)] text-white rounded-xl hover:bg-[var(--chaiteam-orange)]/90 
                  cursor-pointer transition-all duration-200 flex items-center gap-2'
                >
                  <i className='ri-add-line'></i>
                  Create Notice
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? 'bg-[#111111] text-white border-white/60'
                : 'bg-white text-black border-gray-400'
            }`}
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
                    <div
                      className={`flex justify-between border border-b-0 rounded-t-lg p-2 px-2 ${
                        darkMode
                          ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                          : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                      }`}
                    >
                      <span>Batch Admin</span>
                      <span>{batchData.admin?.name || 'Not assigned'}</span>
                    </div>
                    <div
                      className={`flex justify-between border border-b-0 rounded-t-lg p-2 px-2 ${
                        darkMode
                          ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                          : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                      }`}
                    >
                      <span>Total Members</span>
                      <span>{batchData.batchMembers?.length || 0} Members</span>
                    </div>
                    <div
                      className={`flex justify-between border border-b-0 rounded-t-lg p-2 px-2 ${
                        darkMode
                          ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                          : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                      }`}
                    >
                      <span>Status</span>
                      <span>{batchData.status}</span>
                    </div>
                    <div
                      className={`flex justify-between border border-b-0 rounded-t-lg p-2 px-2 ${
                        darkMode
                          ? 'bg-[#18181B] border-[#545454] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                          : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                      }`}
                    >
                      <span>Batch ID</span>
                      <span>{batchData.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div>
                {showGroups && (
                  <Groups batchId={batchId} userGroupId={userGroup?.id} />
                )}
              </div>
            )}

            {activeTab === 'noticeboard' && (
              <div
                className={`p-2 ${
                  darkMode ? 'bg-[#111111] text-white' : 'bg-white text-black'
                }`}
              >
                {noticesLoading ? (
                  <div className='flex justify-center py-8'>
                    <div className='text-center'>
                      <div className='spinner mx-auto'></div>
                      <p className='mt-2 text-sm text-gray-500'>
                        Loading notices...
                      </p>
                    </div>
                  </div>
                ) : noticesError ? (
                  <div className='text-center py-8 text-red-500'>
                    {noticesError}
                  </div>
                ) : notices.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    No notices found. {isAdmin && 'Create the first notice!'}
                  </div>
                ) : (
                  notices
                    .sort((a, b) =>
                      a.type === 'PINNED' && b.type !== 'PINNED' ? -1 : 1,
                    )
                    .map((notice, index) => (
                      <div
                        key={notice.id || index}
                        className={`relative border rounded-xl p-4 flex flex-col gap-2 mb-3 group ${
                          darkMode
                            ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                            : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
                        } transition-all duration-200`}
                      >
                        <span className='text-lg font-semibold'>
                          {notice.title}
                        </span>
                        <span className='text-sm'>{notice.content}</span>
                        <span className='text-sm font-semibold flex items-center gap-1'>
                          <i className='ri-user-line'></i>
                          <span className='font-normal text-xs flex items-center gap-1'>
                            {notice.createdBy?.name || 'Unknown User'}
                            <span>,</span>
                            <i className='ri-time-line'></i>
                            {notice.updateAt
                              ? new Date(notice.updateAt).toLocaleDateString(
                                  'en-IN',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  },
                                )
                              : 'Date not available'}
                          </span>
                        </span>
                        {/* Type Badge */}
                        <div
                          className={`absolute top-2 right-6 rounded-md px-2 py-1 text-xs font-semibold flex items-center gap-1 ${
                            notice.type === 'PINNED'
                              ? 'bg-green-200 text-green-700'
                              : ''
                          }`}
                        >
                          {notice.type === 'PINNED' && (
                            <>
                              <i className='ri-pushpin-fill'></i>
                              <span>PINNED</span>
                            </>
                          )}
                        </div>

                        {/* Edit Button*/}
                        {isAdmin && (
                          <button
                            onClick={() => handleEditNotice(notice)}
                            className={`absolute bottom-2 right-4 p-2 rounded-xl transition-opacity duration-200 ${
                              darkMode
                                ? 'hover:bg-white/10 text-white'
                                : 'hover:bg-black/10 text-black'
                            }`}
                          >
                            <i className='ri-edit-line'></i>
                          </button>
                        )}
                      </div>
                    ))
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

      {/* Edit Notice Modal */}
      {showEditModal && selectedNotice && (
        <EditNoticeModal
          notice={selectedNotice}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateNotice}
          onDelete={handleDeleteNotice}
        />
      )}

      {/* Create Notice Modal */}
      {showCreateModal && (
        <CreateNoticeModal
          batchId={batchId}
          userGroup={userGroup}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNotice}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          batchId={batchId}
          batchName={batchData?.name}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}

export default BatchPage;

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { groupService } from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';

const AllApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allApplications, setAllApplications] = useState([]);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [markAsReadLoading, setMarkAsReadLoading] = useState(false);

  const { darkMode } = useTheme();
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchUserApplications = async () => {
      setLoading(true);
      try {
        const response = await groupService.getAllUserJoinApplications(
          authUser.id,
        );
        setAllApplications(response || []);
      } catch (error) {
        console.error('Error while loading user applications: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserApplications();
  }, [authUser.id]);

  // ✅ Withdraw application
  const handleWithdrawApplication = async (applicationId) => {
    if (!applicationId) return;
    setWithdrawLoading(true);

    try {
      await groupService.withdrawApplication(applicationId);

      // Remove the withdrawn application from state instantly
      setAllApplications((prev) =>
        prev.filter((app) => app.id !== applicationId),
      );

      alert('Application withdrawn successfully');
    } catch (error) {
      console.error('Error while withdrawing the application: ', error);
      alert(error.message || 'Error withdrawing application');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleMarkreadApplication = async (applicationId) => {
    if (!applicationId) return;
    setMarkAsReadLoading(true);

    try {
      const updatedApp = await groupService.markReadApplication(applicationId);

      setAllApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, isRead: true } : app,
        ),
      );

      alert('Application marked as read successfully');
    } catch (error) {
      console.error('Error while marking as read: ', error);
      alert(error.message || 'Error marking as read');
    } finally {
      setMarkAsReadLoading(false);
    }
  };

  return (
     <div className='realtive parkinsans-light text-center p-6'>
      <h2
          className={`text-3xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          } mb-2`}
        >
        All Applications
      </h2>
      <p
        className={`text font-semibold text-center mb-4 ${
          darkMode ? 'text-white/70' : 'text-gray-500'
        }`}
      >
        Here, you can see all your applications submitted to different groups.
      </p>

      <div className='flex flex-col gap-4 w-full p-4'>
        {error ? (
          <p className='text-red-500 text-sm'>
            {error.message || 'Failed to load applications'}
          </p>
        ) : allApplications.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center p-12 rounded-xl ${
              darkMode ? 'bg-[#2b2d31]' : 'bg-gray-50'
            } border ${
              darkMode ? 'border-[#3a3b40]' : 'border-gray-200'
            } text-gray-500`}
          >
            <i className='ri-mail-close-line text-5xl mb-3'></i>
            No join applications yet.
          </div>
        ) : (
          allApplications.map((app, index) => (
            <div
              key={app.id || index}
              className={`border rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20'
                  : 'bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20'
              }`}
            >
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-white'>
                    {app.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className='font-semibold text-sm'>
                      {app.name || 'Unknown User'}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {app.email || 'No email provided'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-2 rounded-md font-semibold ${
                    app.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : app.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className='mt-1 text-sm'>
                <p>
                  <span className='font-semibold'>Reason:</span>{' '}
                  {app.reason || 'No reason provided'}
                </p>
              </div>

              <div className='mt-1 text-xs text-gray-500'>
                Applied on:{' '}
                {app.createdAT
                  ? new Date(app.createdAT).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : 'Date not available'}
              </div>

              {/* ✅ Action Buttons */}
              <div className='mt-3 flex gap-3'>
                {app.status === 'PENDING' && (
                  <button
                    disabled={withdrawLoading}
                    onClick={() => handleWithdrawApplication(app.id)}
                    className='px-3 py-1 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                  >
                    {withdrawLoading ? 'Loading...' : 'Withdraw Application'}
                  </button>
                )}
                {(app.status === 'APPROVED' || app.status === 'REJECTED') && (
                  <button
                    onClick={() => handleMarkreadApplication(app.id)}
                    disabled={markAsReadLoading}
                    className='px-3 py-1 rounded-md text-sm bg-green-500 hover:bg-green-400 text-white cursor-pointer'
                  >
                    {markAsReadLoading ? 'Marking...' : 'Mark As Read'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllApplications;

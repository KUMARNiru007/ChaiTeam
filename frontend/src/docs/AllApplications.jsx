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
        const response = await groupService.getAllUserJoinApplications(authUser.id);
        setAllApplications(response || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserApplications();
  }, [authUser.id]);

  const handleWithdrawApplication = async (applicationId) => {
    if (!applicationId) return;
    setWithdrawLoading(true);

    try {
      await groupService.withdrawApplication(applicationId);
      setAllApplications(prev => prev.filter(app => app.id !== applicationId));
      alert('Application withdrawn successfully');
    } catch (error) {
      alert(error.message || 'Error withdrawing application');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleMarkreadApplication = async (applicationId) => {
    if (!applicationId) return;
    setMarkAsReadLoading(true);

    try {
      await groupService.markReadApplication(applicationId);
      setAllApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, isRead: true } : app)
      );
      alert('Application marked as read successfully');
    } catch (error) {
      alert(error.message || 'Error marking as read');
    } finally {
      setMarkAsReadLoading(false);
    }
  };

  return (
    <div className="relative p-6 parkinsans-light max-w-6xl mx-auto">
      
      {/* Heading */}
      <h2 className={`text-3xl font-semibold text-center mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Applications
      </h2>

      <p className={`text-center mb-6 ${darkMode ? "text-white/70" : "text-gray-500"}`}>
        View all your submitted group join applications.
      </p>

      {/* Loading State */}
      {loading && (
        <div className={`flex flex-col items-center justify-center p-10 rounded-xl border ${
          darkMode
            ? "bg-[#2b2d31] border-[#3a3b40] text-gray-400"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }`}>
          <i className="ri-loader-4-line animate-spin text-5xl mb-3"></i>
          Loading applications...
        </div>
      )}

      {/* Applications List */}
      <div className="flex flex-col gap-5">
        {error ? (
          <p className="text-red-500 text-sm">{error.message || "Failed to load applications"}</p>
        ) : !loading && allApplications.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-10 rounded-xl border ${
            darkMode
              ? "bg-[#2b2d31] border-[#3a3b40] text-gray-400"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}>
            <i className="ri-mail-close-line text-5xl mb-3"></i>
            No join applications yet.
          </div>
        ) : (
          !loading && allApplications.map((app, index) => (
            <div
              key={app.id || index}
              className={`rounded-xl p-5 border transition-all duration-200 shadow-sm ${
                darkMode
                  ? "bg-[#18181B] border-[#343434] hover:bg-[#2a2a2e] hover:border-[#4a4a4f]"
                  : "bg-white border-gray-300 hover:bg-orange-50 hover:border-orange-300"
              }`}
            >
              <div className="flex justify-between items-center">
                
                {/* Left: User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-lg font-bold text-white">
                    {app.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {app.email}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold ${
                    app.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Group and Batch Information */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <i className={`ri-group-line ${darkMode ? "text-blue-400" : "text-blue-600"}`}></i>
                  <span className="text-sm">
                    <span className="font-semibold">Group:</span> {app.groupName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className={`ri-calendar-event-line ${darkMode ? "text-green-400" : "text-green-600"}`}></i>
                  <span className="text-sm">
                    <span className="font-semibold">Batch:</span> {app.batchName || "N/A"}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <p className="mt-3 text-sm">
                <span className="font-semibold">Reason:</span> {app.reason || "N/A"}
              </p>

              {/* Date */}
              <p className={`mt-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Applied on:{" "}
                {new Date(app.createdAT).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                {app.status === "PENDING" && (
                  <button
                    disabled={withdrawLoading}
                    onClick={() => handleWithdrawApplication(app.id)}
                    className="px-3 py-1.5 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                  >
                    {withdrawLoading ? "Loading..." : "Withdraw"}
                  </button>
                )}

                {(app.status === "APPROVED" || app.status === "REJECTED") && (
                  <button
                    disabled={markAsReadLoading}
                    onClick={() => handleMarkreadApplication(app.id)}
                    className="px-3 py-1.5 text-sm rounded-md bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                  >
                    {markAsReadLoading ? "Marking..." : "Mark as Read"}
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
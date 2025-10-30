import React, { useState, useEffect } from "react";
import { noticeService, userService } from "../services/api.js";
import { useTheme } from "../context/ThemeContext.jsx";
import CustomDropdown from "../components/CustomDropdown.jsx";
import EditNoticeModal from "../components/EditNoticeModal.jsx";
import CreateNoticeModal from "../components/CreateNoticeModel.jsx";

const Announcement = () => {
  const { darkMode} = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [noticesData, setNoticesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [noticesData, userData] = await Promise.all([
          noticeService.getGlobalNotices(),
          userService.getCurrentUser().catch(() => null)
        ]);
        
        // Filter for global scope notices only
        const globalNotices = Array.isArray(noticesData) 
          ? noticesData.filter(notice => notice.scope === 'GLOBAL')
          : [];
        setNoticesData(globalNotices);
        setCurrentUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'ADMIN';

  const typeOptions = [
    { id: 1, label: 'All Types', value: 'all' },
    { id: 2, label: 'Pinned', value: 'PINNED' },
    { id: 3, label: 'Normal', value: 'NORMAL' }
  ];

  const filteredNotices = noticesData.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || notice.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort notices with pinned ones first
  const sortedNotices = filteredNotices.sort((a, b) => 
    a.type === 'PINNED' && b.type !== 'PINNED' ? -1 : 1
  );

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleUpdateNotice = (updatedNotice) => {
    setNoticesData(
      noticesData.map((notice) =>
        notice.id === updatedNotice.id ? updatedNotice : notice,
      ),
    );
  };

  const handleDeleteNotice = (noticeId) => {
    setNoticesData(noticesData.filter((notice) => notice.id !== noticeId));
  };

  const handleCreateNotice = (newNotice) => {
    setNoticesData([newNotice, ...noticesData]);
  };

  return (
    <div
      className="parkinsans-light transition-all duration-200"
      style={{ padding: "1rem" }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            className={`${darkMode ? "text-white" : "text-black"}`}
            style={{
              fontSize: "22px",
              fontWeight: "var(--font-weight-bold, 700)",
              margin: "0 0 0.5rem 0",
            }}
          >
            Announcements
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--chaiteam-text-secondary, #a0a0a0)",
              margin: 0,
            }}
          >
            Full view of all announcements and important notices.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Add Notice Button for Admin */}
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[var(--chaiteam-orange)] text-white rounded-xl hover:bg-[var(--chaiteam-orange)]/90 
              cursor-pointer transition-all duration-200 flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Notice
            </button>
          )}
        </div>
      </div>

      {/* Search Filters */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="flex-1 w-full md:w-2/4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i
                className={`ri-search-line ${
                  darkMode ? "text-gray-50" : "text-black"
                }`}
              ></i>
            </span>
            <input
              type="text"
              placeholder="Search Announcements"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border ${
                darkMode
                  ? "bg-[#27272A] text-white placeholder-gray-50 border-white/30"
                  : "border-gray-300 bg-gray-50 text-gray-600 placeholder-gray-400 focus:bg-gray-100"
              } py-2 pl-9 pr-2 focus:outline-none md:w-4/4`}
            />
          </div>
        </div>

        {/* Type Dropdown */}
        <div className="relative w-full md:w-1/4">
          <CustomDropdown
            options={typeOptions}
            placeholder="All Types"
            onSelect={(option) => {
              setSelectedType(option.value);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            className="spinner"
            style={{
              border: "4px solid rgba(255, 161, 22, 0.8)",
              borderLeft: "4px solid #ffffff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "1rem auto",
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
          <p style={{ marginTop: "1rem", color: "#b3b3b3" }}>
            Loading announcements...
          </p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ff4d4f" }}>
          <i className="ri-error-warning-line" style={{ fontSize: "2rem" }}></i>
          <p style={{ marginTop: "1rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div
            className={`p-2 mt-4 ${
              darkMode ? 'bg-[#111111] text-white' : 'bg-white text-black'
            }`}
        >
          {sortedNotices.length > 0 ? (
            sortedNotices.map((notice, index) => (
              <div
                key={notice.id || index}
                className={`relative border rounded-xl p-4 flex flex-col gap-2 group ${
                  darkMode
                    ? "bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20 hover:border-[#9e9e9e]/20"
                    : "bg-white border-slate-300 hover:bg-[#ff9335]/10 hover:border-[#ff9335]/20"
                } transition-all duration-200`}
              >
                <span className="text-lg font-semibold">
                  {notice.title}
                </span>
                <span className="text-sm">
                  {notice.content}
                </span>
                <span className="text-sm font-semibold flex items-center gap-1">
                  <i className="ri-user-line"></i>
                  <span className="font-normal text-xs flex items-center gap-1">
                    {notice.createdBy?.name || "Unknown User"}
                    <span>,</span>
                    <i className="ri-time-line"></i>
                    {notice.updateAt
                      ? new Date(notice.updateAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Date not available"}
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

                {/* Edit Button for Admin */}
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
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
                color: "#b3b3b3",
              }}
            >
              <i className="ri-notification-off-line" style={{ fontSize: "3rem", marginBottom: "1rem" }}></i>
              <p>No announcements found matching your criteria.</p>
            </div>
          )}
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
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNotice}
        />
      )}
    </div>
  );
};

export default Announcement;
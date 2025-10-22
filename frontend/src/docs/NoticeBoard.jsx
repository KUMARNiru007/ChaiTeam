import React, { useState, useEffect } from "react";
import { noticeService } from "../services/api";
import { useTheme } from "../context/ThemeContext.jsx";

const NoticeBoard = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScope, setSelectedScope] = useState("All Scopes");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticesData, setNoticesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await noticeService.getGlobalNotices();
        setNoticesData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
        setError("Failed to load notices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const filteredNotices = noticesData.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope =
      selectedScope === "All Scopes" || notice.scope === selectedScope;
    const matchesType =
      selectedType === "All Types" || notice.type === selectedType;
    return matchesSearch && matchesScope && matchesType;
  });

  // Rest of the component remains the same, but we'll update the notice rendering
  // to use the data from the API

  // Add loading and error states to the render
  return (
    <div className="notice-board">
      {/* Add loading and error states */}
      {loading ? (
        <div className="text-center p-8">
          <div className={`notice-spinner mx-auto ${
            darkMode 
              ? 'border-4 border-chaiteam-border-primary border-l-chaiteam-orange' 
              : 'border-4 border-gray-200 border-l-chaiteam-orange'
          }`}></div>
          <p className={`mt-4 text-sm ${darkMode ? 'text-chaiteam-text-secondary' : 'text-gray-600'}`}>
            Loading notices...
          </p>
        </div>
      ) : error ? (
        <div className={`empty-state ${darkMode ? 'bg-chaiteam-bg-secondary' : 'bg-gray-50'}`}>
          <i className="ri-error-warning-line empty-state-icon text-chaiteam-error"></i>
          <p className={`empty-state-message ${darkMode ? 'text-chaiteam-text-secondary' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="create-button mt-4"
          >
            Try Again
          </button>
        </div>
      ) : (
        // Notices list with filtered notices
        <div style={{ marginTop: "1.5rem" }}>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-card ${
                  darkMode 
                    ? 'bg-chaiteam-bg-secondary border-chaiteam-border-primary hover:bg-chaiteam-bg-elevated' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div className="notice-header">
                  <h3 className="notice-title">
                    {notice.title}
                  </h3>

                  <span className={`notice-type ${notice.type.toLowerCase()}`}>
                  >
                    {notice.type.toLowerCase()}
                  </span>
                </div>

                <p className="notice-content">
                  {notice.content}
                </p>

                <div className="notice-metadata">
                  <div className="info-item">
                    <i className="ri-user-line info-icon"></i>
                    <span className={`info-value ${darkMode ? 'text-chaiteam-text-secondary' : 'text-gray-700'}`}>
                      {notice.createdBy?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="info-item">
                    <i className="ri-time-line info-icon"></i>
                    <span className={`info-value ${darkMode ? 'text-chaiteam-text-secondary' : 'text-gray-700'}`}>
                      {new Date(notice.createdAt).toLocaleString()}
                      {notice.isEdited && " (edited)"}
                    </span>
                  </div>

                  <span className={`tag ${notice.scope.toLowerCase()}`}>
                    {notice.scope.toLowerCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="ri-notification-off-line empty-state-icon"></i>
              <p className="empty-state-message">No notices found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Selected notice modal remains the same */}
    </div>
  );
};

export default NoticeBoard;

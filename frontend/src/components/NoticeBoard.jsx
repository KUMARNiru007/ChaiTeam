import React, { useState, useEffect } from "react";
import { noticeService } from "../services/api.js";
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

  // Close modal when clicking outside or pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedNotice(null);
      }
    };

    if (selectedNotice) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedNotice]);

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

  return (
    <div className="notice-board">
      {/* Add loading and error states */}
      {loading ? (
        <div className="text-center p-8">
          <div className={`notice-spinner mx-auto ${
            darkMode 
              ? 'border-4 border-chaihub-border-primary border-l-chaihub-orange' 
              : 'border-4 border-gray-200 border-l-chaihub-orange'
          }`}></div>
          <p className={`mt-4 text-sm ${darkMode ? 'text-chaihub-text-secondary' : 'text-gray-600'}`}>
            Loading...
          </p>
        </div>
      ) : error ? (
        <div className={`empty-state ${darkMode ? 'bg-chaihub-bg-secondary' : 'bg-gray-50'}`}>
          <i className="ri-error-warning-line empty-state-icon text-chaihub-error"></i>
          <p className={`empty-state-message ${darkMode ? 'text-chaihub-text-secondary' : 'text-gray-600'}`}>{error}</p>
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
                    ? 'bg-chaihub-bg-secondary border-chaihub-border-primary hover:bg-chaihub-bg-elevated' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div className="notice-header">
                  <h3 className="notice-title">
                    {notice.title}
                  </h3>
                </div>

                <p className="notice-content">
                  {notice.content}
                </p>

                <div className="notice-metadata">
                  <div className="info-item">
                    <i className="ri-user-line info-icon"></i>
                    <span className={`info-value ${darkMode ? 'text-chaihub-text-secondary' : 'text-gray-700'}`}>
                      {notice.createdBy?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="info-item">
                    <i className="ri-time-line info-icon"></i>
                    <span className={`info-value ${darkMode ? 'text-chaihub-text-secondary' : 'text-gray-700'}`}>
                      {new Date(notice.createdAt).toLocaleString()}
                      {notice.isEdited && " (edited)"}
                    </span>
                  </div>
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

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div 
          className={`modal-overlay ${darkMode ? 'dark' : 'light'}`}
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className={`modal-content ${darkMode ? 'bg-chaihub-bg-secondary' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className={`modal-title ${darkMode ? 'text-chaihub-text-primary' : 'text-gray-900'}`}>
                {selectedNotice.title}
              </h2>
              <button 
                className={`close-button ${darkMode ? 'text-chaihub-text-secondary hover:text-chaihub-text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setSelectedNotice(null)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p className={`notice-full-content ${darkMode ? 'text-chaihub-text-secondary' : 'text-gray-700'}`}>
                {selectedNotice.content}
              </p>
              
              <div className={`modal-metadata ${darkMode ? 'text-chaihub-text-tertiary' : 'text-gray-500'}`}>
                <div className="metadata-item">
                  <i className="ri-user-line"></i>
                  <span>Created by: {selectedNotice.createdBy?.name || "Unknown"}</span>
                </div>
                <div className="metadata-item">
                  <i className="ri-time-line"></i>
                  <span>Created: {new Date(selectedNotice.createdAt).toLocaleString()}</span>
                  {selectedNotice.isEdited && " (edited)"}
                </div>
                {selectedNotice.updatedAt && selectedNotice.updatedAt !== selectedNotice.createdAt && (
                  <div className="metadata-item">
                    <i className="ri-history-line"></i>
                    <span>Last updated: {new Date(selectedNotice.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
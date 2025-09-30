import React, { useState, useEffect } from "react";
import { noticeService } from "../services/api";

const NoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScope, setSelectedScope] = useState("All Scopes");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticesData, setNoticesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        // For simplicity, we'll fetch global notices. In a real app, you might want to
        // fetch different types based on user context or selection
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
    <div className="parkinsans-light" style={{ padding: "1.5rem" }}>
      {/* Header and filters remain the same */}

      {/* Add loading and error states */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            className="spinner"
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "4px solid #ffffff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
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
            Loading notices...
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
        // Notices list with filtered notices
        <div style={{ marginTop: "1.5rem" }}>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                style={{
                  backgroundColor: "#2d2d2d",
                  border: "1px solid #404040",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedNotice(notice)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      color: "#ffffff",
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {notice.title}
                  </h3>

                  <span
                    style={{
                      backgroundColor:
                        notice.type === "URGENT"
                          ? "#ff4d4f33"
                          : notice.type === "ANNOUNCEMENT"
                          ? "#1890ff33"
                          : "#52c41a33",
                      color:
                        notice.type === "URGENT"
                          ? "#ff4d4f"
                          : notice.type === "ANNOUNCEMENT"
                          ? "#1890ff"
                          : "#52c41a",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {notice.type.toLowerCase()}
                  </span>
                </div>

                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notice.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="ri-user-line"
                      style={{ color: "#b3b3b3", marginRight: "0.5rem" }}
                    ></i>
                    <span style={{ color: "#b3b3b3", fontSize: "0.75rem" }}>
                      {notice.createdBy?.name || "Unknown"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="ri-time-line"
                      style={{ color: "#b3b3b3", marginRight: "0.5rem" }}
                    ></i>
                    <span style={{ color: "#b3b3b3", fontSize: "0.75rem" }}>
                      {new Date(notice.createdAt).toLocaleString()}
                      {notice.isEdited && " (edited)"}
                    </span>
                  </div>

                  <span
                    style={{
                      backgroundColor:
                        notice.scope === "GROUP"
                          ? "#52c41a33"
                          : notice.scope === "BATCH"
                          ? "#1890ff33"
                          : "#faad1433",
                      color:
                        notice.scope === "GROUP"
                          ? "#52c41a"
                          : notice.scope === "BATCH"
                          ? "#1890ff"
                          : "#faad14",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {notice.scope.toLowerCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#b3b3b3",
                backgroundColor: "#2d2d2d",
                borderRadius: "0.5rem",
              }}
            >
              No notices found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Selected notice modal remains the same */}
    </div>
  );
};

export default NoticeBoard;

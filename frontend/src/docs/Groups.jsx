import React, { useState, useEffect } from "react";
import { groupService } from "../services/api";

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeTab, setActiveTab] = useState("active");
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await groupService.getAllGroups();
        setGroupsData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setError("Failed to load groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const tabCounts = {
    active: groupsData.filter((group) => group.status === "ACTIVE").length,
    inactive: groupsData.filter((group) => group.status === "INACTIVE").length,
    disbanded: groupsData.filter((group) => group.status === "DISBANNED")
      .length,
  };

  const filteredGroups = groupsData.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab =
      activeTab === "active"
        ? group.status === "ACTIVE"
        : activeTab === "inactive"
        ? group.status === "INACTIVE"
        : activeTab === "disbanded"
        ? group.status === "DISBANNED"
        : false;
    return matchesSearch && matchesTab;
  });

  // Rest of the component remains the same, but we'll update the GroupCard component
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
            Loading groups...
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
        // Existing grid layout with filtered groups
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                style={{
                  backgroundColor: "#2d2d2d",
                  border: "1px solid #404040",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                  }}
                >
                  {group.name}
                </h3>

                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {group.description || "No description"}
                </p>

                {/* <div style={{ marginBottom: '1rem' }}>
                  {group.tags && Array.isArray(JSON.parse(group.tags)) && JSON.parse(group.tags).map((tag, index) => (
                    <span key={index} style={{
                      backgroundColor: '#404040',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      marginRight: '0.5rem',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>{tag}</span>
                  ))}
                </div> */}

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <i
                      className="ri-user-line"
                      style={{ color: "#b3b3b3", marginRight: "0.5rem" }}
                    ></i>
                    <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
                      Leader: {group.leader?.name || "Unknown"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <i
                      className="ri-group-line"
                      style={{ color: "#b3b3b3", marginRight: "0.5rem" }}
                    ></i>
                    <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
                      Members: {group.member?.length || 0}/{group.capacity || 4}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="ri-calendar-line"
                      style={{ color: "#b3b3b3", marginRight: "0.5rem" }}
                    ></i>
                    <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
                      Created: {new Date(group.createdAT).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        group.status === "ACTIVE"
                          ? "#52c41a33"
                          : group.status === "INACTIVE"
                          ? "#faad1433"
                          : group.status === "DISBANNED"
                          ? "#ff4d4f33"
                          : "#1890ff33",
                      color:
                        group.status === "ACTIVE"
                          ? "#52c41a"
                          : group.status === "INACTIVE"
                          ? "#faad14"
                          : group.status === "DISBANNED"
                          ? "#ff4d4f"
                          : "#1890ff",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {group.status.toLowerCase()}
                  </span>

                  <span
                    style={{
                      backgroundColor: "#1890ff33",
                      color: "#1890ff",
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    {group.batchName}
                  </span>
                </div>
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
              No groups found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { groupService } from "../services/api";

const Groups = ({ batchId, userGroupId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);
  const handleTabChange = (tab) => setActiveTab(tab);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // Updated to get groups for a specific batch
        const data = await groupService.getBatchGroups(batchId);
        setGroupsData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setError("Failed to load groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchGroups();
    }
  }, [batchId]);

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
    const matchesStatus =
      selectedStatus === "All Status" ? true : group.status === selectedStatus;
    const matchesTab =
      activeTab === "active"
        ? group.status === "ACTIVE"
        : activeTab === "inactive"
        ? group.status === "INACTIVE"
        : activeTab === "disbanded"
        ? group.status === "DISBANNED"
        : false;
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Add loading and error states to the render
  return (
    <div className="parkinsans-light" style={{ padding: "1.5rem" }}>
      {/* Search and filter controls */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search groups..."
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #404040",
              backgroundColor: "#2d2d2d",
              color: "white",
              flex: 1
            }}
          />
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #404040",
              backgroundColor: "#2d2d2d",
              color: "white"
            }}
          >
            <option value="All Status">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DISBANNED">Disbanded</option>
          </select>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #404040" }}>
          {Object.entries(tabCounts).map(([tab, count]) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #1890ff" : "none",
                color: activeTab === tab ? "#1890ff" : "#b3b3b3",
                cursor: "pointer"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Loading and error states */}
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

                <div style={{ marginBottom: '1rem' }}>
  {group.tags && Array.isArray(group.tags) && group.tags.map((tag, index) => (
    <span
      key={index}
      style={{
        backgroundColor: '#404040',
        color: '#ffffff',
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
        display: 'inline-block'
      }}
    >
      {tag}
    </span>
  ))}
</div>


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
                {/* View Group button */}
                <button
                  onClick={() => navigate(`/batches/${batchId}/groups/${group.id}`)}
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                    padding: "0.5rem",
                    backgroundColor: userGroupId === group.id ? "#52c41a" : "#1890ff",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  {userGroupId === group.id ? "View Your Group" : "View Group"}
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
                color: "#ffa116",
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

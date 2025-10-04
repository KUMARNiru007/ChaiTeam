import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group, batchId }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/batches/${batchId}/groups/${group.id}`)}
      style={{
        backgroundColor: "#2d2d2d",
        border: "1px solid #404040",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        height: "fit-content",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#525252";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#404040";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ color: "#ffffff", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          {group.name}
        </h3>
        <p style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
          {group.description || "No description available"}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <span
          style={{
            backgroundColor: group.status === "ACTIVE" ? "#10B981" : "#EF4444",
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
          }}
        >
          {group.status}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <i className="ri-team-line" style={{ color: "#b3b3b3" }}></i>
        <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
          {group.groupMembers?.length || 0} members
        </span>
      </div>
    </div>
  );
};

export default GroupCard;
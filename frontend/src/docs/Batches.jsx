import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { batchService } from "../services/api";

const Batches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("live");
  const [batchesData, setBatchesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await batchService.getAllBatches();
        console.log("DATA: ", data);
        setBatchesData(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        setError("Failed to load batches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const tabCounts = {
    live: Array.isArray(batchesData)
      ? batchesData.filter((b) => b.status === "ACTIVE").length
      : 0,
    upcoming: 0,
    past: Array.isArray(batchesData)
      ? batchesData.filter((b) => b.status === "COMPLETED").length
      : 0,
  };

  const filteredBatches = batchesData.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.description &&
        batch.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab =
      activeTab === "live"
        ? batch.status === "ACTIVE"
        : activeTab === "past"
        ? batch.status === "COMPLETED"
        : false;
    return matchesSearch && matchesTab;
  });

  // Rest of the component remains the same, but we'll update the BatchCard component
  const navigate = useNavigate();

  const BatchCard = ({ batch }) => (
    <div
      onClick={() => navigate(`/batches/${batch.id}`)}
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
      {/* Batch Name */}
      <h3
        style={{
          color: "#ffffff",
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "1rem",
          lineHeight: "1.4",
        }}
      >
        {batch.name}
      </h3>

      {/* Tags */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <i
            className="ri-group-line"
            style={{
              color: "#b3b3b3",
              marginRight: "0.5rem",
              fontSize: "16px",
            }}
          ></i>
          <span
            style={{
              color: "#b3b3b3",
              fontSize: "0.875rem",
            }}
          >
            {batch.description || "No description"}
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
            className="ri-code-line"
            style={{
              color: "#b3b3b3",
              marginRight: "0.5rem",
              fontSize: "16px",
            }}
          ></i>
          <span
            style={{
              color: "#b3b3b3",
              fontSize: "0.875rem",
            }}
          >
            {batch.status}
          </span>
        </div>
      </div>

      {/* Start and Due Dates */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.25rem" }}>
          <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
            Created:{" "}
          </span>
          <span style={{ color: "#ffffff", fontSize: "0.875rem" }}>
            {new Date(batch.createdAT).toLocaleString()}
          </span>
        </div>
        <div>
          <span style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
            Updated:{" "}
          </span>
          <span style={{ color: "#ff4d4f", fontSize: "0.875rem" }}>
            {new Date(batch.updatedAT).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Enrollments - We'll use batchMembers count if available */}
      <div
        style={{
          backgroundColor: "#404040",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.25rem",
          display: "inline-block",
        }}
      >
        <span style={{ color: "#ffffff", fontSize: "0.875rem" }}>
          <i className="ri-user-line" style={{ marginRight: "0.5rem" }}></i>
          {batch.batchMembers?.length || 0} students
        </span>
      </div>
    </div>
  );

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
            Loading batches...
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
        // Existing grid layout with filtered batches
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
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
              No batches found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Batches;

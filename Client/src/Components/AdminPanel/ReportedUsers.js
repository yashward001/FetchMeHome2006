import React, { useState, useEffect } from "react";
import "../../Styles/ReportedUser.css";

const ReportedUsers = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/reported-users");
      if (!response.ok) {
        throw new Error("Failed to fetch reported users.");
      }
      const data = await response.json();
      console.log("Fetched Reported Users:", data);
      setReportedUsers(data);
    } catch (error) {
      console.error("Error fetching reported users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user from database (not just report)
  // const handleDeleteUser = async (finderId) => {
  //   if (!window.confirm("Are you sure you want to ban this user?")) return;
  
  //   try {
  //     const response = await fetch(`http://localhost:4000/admin/deleteUser/${finderId}`, {
  //       method: "DELETE",
  //     });
  
  //     if (!response.ok) throw new Error("Failed to ban user");
  
  //     setReportedUsers((prev) =>
  //       prev.filter((report) => report.finderId !== finderId)
  //     );
  //   } catch (error) {
  //     console.error(" Error banning user:", error);
  //     alert("Failed to ban user.");
  //   }
  // };

  const handleBanUser = async (finderId) => {
    if (!window.confirm("Are you sure you want to ban this user?")) return;
  
    try {
      const res = await fetch(`http://localhost:4000/admin/banUser/${finderId}`, {
        method: "PATCH",
      });
  
      if (!res.ok) throw new Error("Failed to ban user");
  
      // Optional: Refresh the UI
      setReportedUsers((prev) =>
        prev.filter((report) => report.finderId !== finderId)
      );
  
      alert("User banned successfully and report removed.");
    } catch (err) {
      console.error("Error banning user:", err);
      alert("Failed to ban user.");
    }
  };

  // Dismiss a user report (only remove from reported-users table)
  const handleDismissReport = async (finderId) => {
    if (!window.confirm("Are you sure you want to dismiss this report?")) return;
  
    try {
      const response = await fetch(`http://localhost:4000/admin/dismissUserReport/${finderId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to dismiss user report");
  
      setReportedUsers((prev) =>
        prev.filter((report) => report.finderId !== finderId)
      );
    } catch (error) {
      console.error(" Error dismissing user report:", error);
      alert("Failed to dismiss the report.");
    }
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2 style={{ marginBottom: "1rem" }}>Reported Users</h2>
      {loading ? (
        <p>Loading reported users...</p>
      ) : reportedUsers.length > 0 ? (
        <div className="listing-grid">
          {reportedUsers.map((report) => (
            <div key={report._id} className="report-card">
              {report.image ? (
                <img
                  src={`http://localhost:4000/Assets/${report.image}`}
                  alt="Reported User"
                  className="report-image"
                  onError={(e) => {
                    e.target.src = "http://localhost:4000/Assets/default.png";
                  }}
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}

              <h3>User ID: {report.finderId}</h3>
              <p><b>Reported By:</b> {report.reportedBy}</p>
              <p><b>Justification:</b> {report.justification || "No justification provided."}</p>
              <p><b>Status:</b> {report.status}</p>
              <p><b>Reported At:</b> {new Date(report.createdAt).toLocaleString()}</p>

              <div className="button-group">
                <button className="delete-btn" onClick={() => handleBanUser(report.finderId)}>
                  Ban User
                </button>
                <button className="dismiss-btn" onClick={() => handleDismissReport(report.finderId)}>
                  Dismiss Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reported users found.</p>
      )}
    </div>
  );
};

export default ReportedUsers;

import React, { useState, useEffect } from "react";

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
      console.log("✅ Fetched Reported Users:", data); // Debugging log
      setReportedUsers(data);
    } catch (error) {
      console.error("Error fetching reported users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2>Reported Users</h2>
      {loading ? (
        <p>Loading reported users...</p>
      ) : reportedUsers.length > 0 ? (
        reportedUsers.map((report) => (
          <div key={report._id} className="report-card">
            {/* Ensure images are displayed correctly */}
            {report.image ? (
              <img
                src={`http://localhost:4000/Assets/${report.image}`}
                alt="Reported Listing"
                className="reported-user-image"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                onError={(e) => { e.target.src = "http://localhost:4000/uploads/default.png"; }} 
              />
            ) : (
              <p>No Image Available</p> // Show message if no image is uploaded
            )}

            <h3>User ID: {report.finderId}</h3>
            <p><b>Reported By:</b> {report.reportedBy}</p>
            <p><b>Justification:</b> {report.justification ? report.justification : "No justification provided."}</p> {/* ✅ Handle missing justification */}
            <p><b>Status:</b> {report.status}</p>
            <p><b>Reported At:</b> {new Date(report.createdAt).toLocaleString()}</p>
            <button className="delete-btn">Delete User</button>
          </div>
        ))
      ) : (
        <p>No reported users found.</p>
      )}
    </div>
  );
};

export default ReportedUsers;


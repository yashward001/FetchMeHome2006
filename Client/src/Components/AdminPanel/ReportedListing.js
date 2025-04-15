import React, { useState, useEffect } from "react";

const ReportedListing = () => {
  const [reportedListings, setReportedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedListings = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/reported-listings");
      if (!response.ok) {
        throw new Error("Failed to fetch reported listings.");
      }
      const data = await response.json();
      setReportedListings(data);
    } catch (error) {
      console.error("🚨 Error fetching reported listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedListings();
  }, []);

  return (
    <div className="admin-container">
      <h2>Reported Listings</h2>
      {loading ? (
        <p>Loading reported listings...</p>
      ) : reportedListings.length > 0 ? (
        reportedListings.map((report) => (
          <div key={report._id} className="report-card">
            {/* ✅ Display Reported Listing Image */}
            <img
              src={`http://localhost:4000/Assets/${report.filename}`} 
              alt="Reported Pet"
              className="reported-listing-image"
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
            />
            <h3>{report.name}</h3>
            <p><b>Type:</b> {report.type}</p>
            <p><b>Age:</b> {report.age}</p>
            <p><b>Location:</b> {report.area}</p>
            <p><b>Justification:</b> {report.justification}</p>
            <p><b>Reason for Report:</b> {report.reason}</p>
            <p><b>Reported At:</b> {new Date(report.createdAt).toLocaleString()}</p>
            <button className="delete-btn">Delete Listing</button>
          </div>
        ))
      ) : (
        <p>No reported listings found.</p>
      )}
    </div>
  );
};

export default ReportedListing;

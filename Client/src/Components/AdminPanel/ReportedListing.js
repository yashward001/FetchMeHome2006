import React, { useState, useEffect } from "react";
import "../../Styles/ReportedListing.css";

const ReportedListing = () => {
  const [reportedListings, setReportedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedListings = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/reported-listings");
      if (!response.ok) throw new Error("Failed to fetch reported listings.");
      const data = await response.json();
      setReportedListings(data);
    } catch (error) {
      console.error(" Error fetching reported listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteListing = async (petId) => {
  //   if (!window.confirm("Are you sure you want to delete this listing?")) return;
  
  //   try {
  //     const response = await fetch(`http://localhost:4000/admin/deleteListing/${petId}`, {
  //       method: "DELETE",
  //     });
  
  //     if (!response.ok) throw new Error("Failed to delete listing");
  
  //     setReportedListings((prev) =>
  //       prev.filter((report) => report._id !== petId)
  //     );
  //   } catch (error) {
  //     console.error(" Error deleting listing:", error);
  //     alert("Failed to delete the listing.");
  // }};
  const handleDeleteListing = async (petId, reportType) => {
    const confirmMsg = `Are you sure you want to delete this ${reportType === "LostPet" ? "LostPet" : "Adoption"} listing?`;
    if (!window.confirm(confirmMsg)) return;
  
    const endpoint = reportType === "LostPet"
      ? `http://localhost:4000/admin/deleteLostPetListing/${petId}`
      : `http://localhost:4000/admin/deleteListing/${petId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete listing");
  
      //Refresh the list
      await fetchReportedListings();
  
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete the listing.");
    }
  };
  


  // const handleDismissReport = async (petId) => {
  //   if (!window.confirm("Are you sure you want to dismiss this report?")) return;
  
  //   try {
  //     const response = await fetch(`http://localhost:4000/admin/dismissListingReport/${petId}`, {
  //       method: "DELETE",
  //     });
  
  //     if (!response.ok) throw new Error("Failed to dismiss listing report");
  
  //     setReportedListings((prev) =>
  //       prev.filter((report) => report.petId !== petId)
  //     );
  //   } catch (error) {
  //     console.error(" Error dismissing listing report:", error);
  //     alert("Failed to dismiss the report.");
  //   }
  // };

  const handleDismissReport = async (petId, reportType) => {
    if (!window.confirm("Are you sure you want to dismiss this report?")) return;
  
    const endpoint = reportType === "LostPet"
      ? `http://localhost:4000/admin/dismissLostPetReport/${petId}`
      : `http://localhost:4000/admin/dismissListingReport/${petId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to dismiss listing report");
  
      setReportedListings((prev) =>
        prev.filter((report) => report.petId !== petId)
      );

    } catch (error) {
      console.error("Error dismissing listing report:", error);
      alert("Failed to dismiss the report.");
    }
  };
  
  

  useEffect(() => {
    fetchReportedListings();
  }, []);

  return (
    <div className="admin-container">
    <h2 style={{ marginBottom: "1rem" }}>Reported Listings</h2>
      {loading ? (
        <p>Loading reported listings...</p>
      ) : reportedListings.length > 0 ? (
        <div className="listing-grid">
          {reportedListings.map((report) => (
            <div key={report._id} className="report-card">
              <img
                src={`http://localhost:4000/Assets/${report.filename}`}
                alt="Reported Pet"
                className="report-image"
              />
              <h3>{report.name}</h3>
              <p><b>Type:</b> {report.type}</p>
              <p><b>Age:</b> {report.age}</p>
              <p><b>Location:</b> {report.area}</p>
              <p><b>Justification:</b> {report.justification}</p>
              <p><b>Reason for Report:</b> {report.reason}</p>
              <p><b>Reported At:</b> {new Date(report.createdAt).toLocaleString()}</p>
              <div className="button-group">
                <button className="delete-btn" onClick={() => handleDeleteListing(report.petId, report.reportType)}>
                  Delete Listing
                </button>
                <button className="dismiss-btn" onClick={() => handleDismissReport(report.petId, report.reportType)}>
                  Dismiss Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reported listings found.</p>
      )}
    </div>
  );
};

export default ReportedListing;

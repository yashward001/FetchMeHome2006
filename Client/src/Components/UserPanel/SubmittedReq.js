import React, { useState, useEffect } from "react";
import "../../Styles/SubmittedReq.css"; 

const SubmittedReq = () => {
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const currentUserId = localStorage.getItem("userId"); // Finder's ID

  useEffect(() => {
    const fetchSubmittedRequests = async () => {
      try {
        const response = await fetch(`http://localhost:4000/mySubmittedRequests/${currentUserId}`);
        if (!response.ok) throw new Error("Failed to fetch submitted requests");

        const data = await response.json();
        console.log("Fetched Submitted Requests:", data);
        setSubmittedRequests(data);
      } catch (error) {
        console.error("Error fetching submitted requests:", error);
      }
    };

    fetchSubmittedRequests();
  }, [currentUserId]);

  return (
    <div className="req-container">
      <h2 className="section-title">My Submitted Requests</h2>
      
      {/* Show requests if any exist */}
      <div className="requests-grid">
        {submittedRequests.length > 0 ? (
          submittedRequests.map((req) => (
            <div key={req._id} className="pet-view-card request-card">
              <div className="pet-card-pic">
                <img 
                  src={`http://localhost:4000/Assets/${req.image}`} 
                  alt="Submitted Pet"
                  className="pet-image"
                />
              </div>
              <div className="pet-card-details">
                <p><b>Pet Name:</b> {req.petId?.name || "Unknown"}</p>
                <p><b>Pet Owner Email:</b> {req.finderEmail}</p>
                <p><b>Contact Owner:</b> {req.finderPhone}</p>
                <p><b>Status:</b> <span className={req.status === "accepted" ? "accepted-status" : "pending-status"}>{req.status}</span></p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-requests">No submitted requests.</p>
        )}
      </div>
    </div>
  );
};

export default SubmittedReq;

import React, { useState, useEffect } from "react";
import "../../Styles/UserLostRequests.css";

const LostPetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [reportingFinderId, setReportingFinderId] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:4000/myLostPetRequests/${currentUserId}`);
        if (!response.ok) throw new Error("Failed to fetch reports");

        const data = await response.json();
        console.log("Rendered Requests:", data);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching lost pet requests:", error);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  // Handle Accept Request
  const handleAcceptRequest = async (requestId, petId) => {
    try {
      const response = await fetch(`http://localhost:4000/acceptLostPetRequest/${requestId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept request.");
      }
      alert("Request accepted successfully!");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "Accepted" } : req
        )
      );

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.petId === petId ? { ...req, petStatus: "Found" } : req
        )
      );

    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    }
  };

  // Handle Delete Request
  const handleDelete = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:4000/deleteLostPetRequest/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete request.");
      }

      alert("Request deleted successfully!");
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); 
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  };

  // Handle Select Image for Report
  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log("Selected Image:", file);

      // Prompt user for justification after selecting an image
      setTimeout(() => {
        const justification = prompt("Why are you reporting this user? (Required)");
        if (!justification || !justification.trim()) {
          alert("Please provide a justification.");
          setSelectedImage(null); 
          return;
        }
        handleSubmitReport(justification);
      }, 500);
    }
  };

  // Handle Submit Report
  const handleSubmitReport = async () => {
    if (!reportingFinderId || !selectedImage) {
        alert("Error: Finder ID or Image is missing.");
        return;
    }

    const justification = prompt("Why are you reporting this user? (Required)");
    if (!justification || !justification.trim()) {
        alert("Please provide a justification.");
        return;
    }

    console.log("Reporting user:", reportingFinderId, "by", currentUserId);
    console.log("Selected Image:", selectedImage);

    const formData = new FormData();
    formData.append("finderId", reportingFinderId);
    formData.append("reportedBy", currentUserId);
    formData.append("justification", justification);
    formData.append("image", selectedImage);

    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    try {
        const response = await fetch("http://localhost:4000/reportUser", {
            method: "POST",
            body: formData, // Send as FormData
        });

        if (!response.ok) {
            throw new Error("Failed to report user.");
        }

        alert("User reported successfully! The admin will review the case.");
        setSelectedImage(null);
        setReportingFinderId(null);
    } catch (error) {
        console.error("Error reporting user:", error);
        alert("Failed to report user.");
    }
};



  return (
    <div className="req-container">
      {/* PENDING REQUESTS */}
      <h2>Pending Requests</h2>
      <div className="requests-grid">
        {requests.filter((req) => req.status === "Pending").length > 0 ? (
          requests.filter((req) => req.status === "Pending").map((req) => (
            <div key={req._id} className="pet-view-card request-card">
              <div className="pet-card-pic">
                <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" className="pet-image" />
              </div>
              <div className="pet-card-details">
                <p><b>PetFinder Email:</b> {req.finderEmail}</p>
                <p><b>Contact PetFinder At:</b> {req.finderPhone}</p>
                <p><b>Status:</b> {req.status}</p>
              </div>
              <div className="app-rej-btn">
                <button className="accept-request-btn" onClick={() => handleAcceptRequest(req._id)}>Accept Request</button>
                <button className="delete-request-btn" onClick={() => handleDelete(req._id)}>Delete Request</button>
                <button className="report-user-btn" onClick={() => setReportingFinderId(req.finderId)}>Report User</button>
              </div>

              {/* Show file input ONLY if this pet is being reported */}
              {reportingFinderId === req.finderId && (
                <div className="image-upload-section">
                  <label><b>Upload an Image:</b></label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleSelectImage}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-requests">No pending requests.</p>
        )}
      </div>

      {/* ACCEPTED REQUESTS */}
      <h2>Accepted Requests</h2>
      <div className="requests-grid">
        {requests.filter((req) => req.status === "Accepted").length > 0 ? (
          requests.filter((req) => req.status === "Accepted").map((req) => (
            <div key={req._id} className="pet-view-card request-card">
              <div className="pet-card-pic">
                <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" className="pet-image" />
              </div>
              <div className="pet-card-details">
                <p><b>PetFinder Email:</b> {req.finderEmail}</p>
                <p><b>Contact PetFinder At:</b> {req.finderPhone}</p>
                <p><b>Status:</b> {req.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-requests">No accepted requests.</p>
        )}
      </div>
    </div>
  );
};

export default LostPetRequests;

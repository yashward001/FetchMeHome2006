// import React, { useState, useEffect } from "react";
// import "../../Styles/UserLostRequests.css";

// const LostPetRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [reportingFinderId, setReportingFinderId] = useState(null); 
//   const [selectedImage, setSelectedImage] = useState(null); 
//   const currentUserId = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch(`http://localhost:4000/myLostPetRequests/${currentUserId}`);
//         if (!response.ok) throw new Error("Failed to fetch reports");

//         const data = await response.json();
//         console.log("Rendered Requests:", data);
//         setRequests(data);
//       } catch (error) {
//         console.error("Error fetching lost pet requests:", error);
//       }
//     };

//     fetchRequests();
//   }, [currentUserId]);

//   // Handle Accept Request
//   const handleAcceptRequest = async (requestId, petId) => {
//     try {
//       const response = await fetch(`http://localhost:4000/acceptLostPetRequest/${requestId}`, {
//         method: "PUT",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to accept request.");
//       }
//       alert("Request accepted successfully!");
//       setRequests((prevRequests) =>
//         prevRequests.map((req) =>
//           req._id === requestId ? { ...req, status: "Accepted" } : req
//         )
//       );

//       setRequests((prevRequests) =>
//         prevRequests.map((req) =>
//           req.petId === petId ? { ...req, petStatus: "Found" } : req
//         )
//       );

//     } catch (error) {
//       console.error("Error accepting request:", error);
//       alert("Failed to accept request.");
//     }
//   };

//   // Handle Delete Request
//   const handleDelete = async (requestId) => {
//     try {
//       const response = await fetch(`http://localhost:4000/deleteLostPetRequest/${requestId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete request.");
//       }

//       alert("Request deleted successfully!");
//       setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId)); 
//     } catch (error) {
//       console.error("Error deleting request:", error);
//       alert("Failed to delete request.");
//     }
//   };

//   // Handle Select Image for Report
//   const handleSelectImage = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
  
//     if (!reportingFinderId) {
//       alert("No user selected to report. Please click 'Report User' first.");
//       return;
//     }
  
//     console.log("Image selected:", file);
  
//     const justification = prompt("Why are you reporting this user?");
//     if (!justification || !justification.trim()) {
//       alert("Justification is required.");
//       return;
//     }
  
//     //  PASS file directly (don't use state)
//     handleSubmitReport(justification, file);
//   };
  
  

//   // Handle Submit Report
//   const handleSubmitReport = async (justification, imageFile) => {
//     console.log("Reporting with data:", {
//       finderId: reportingFinderId,
//       reporter: currentUserId,
//       image: imageFile,
//       justification,
//     });
  
//     if (!reportingFinderId || !imageFile) {
//       alert("Error: Finder ID or Image is missing.");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("finderId", reportingFinderId);
//     formData.append("reportedBy", currentUserId);
//     formData.append("justification", justification);
//     formData.append("image", imageFile);
  
//     try {
//       const response = await fetch("http://localhost:4000/reportUser", {
//         method: "POST",
//         body: formData,
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server responded with error:", errorData);
//         throw new Error("Failed to report user.");
//       }
  
//       alert("User reported successfully!");
//       setSelectedImage(null);
//       setReportingFinderId(null);
//     } catch (error) {
//       console.error("Error reporting user:", error);
//       alert("Failed to report user.");
//     }
//   };
  
  



//   return (
//     <div className="req-container">
//       {/* PENDING REQUESTS */}
//       <h2>Pending Requests</h2>
//       <div className="requests-grid">
//         {requests.filter((req) => req.status === "Pending").length > 0 ? (
//           requests.filter((req) => req.status === "Pending").map((req) => (
//             <div key={req._id} className="pet-view-card request-card">
//               <div className="pet-card-pic">
//                 <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" className="pet-image" />
//               </div>
//               <div className="pet-card-details">
//                 <p><b>PetFinder Email:</b> {req.finderEmail}</p>
//                 <p><b>Contact PetFinder At:</b> {req.finderPhone}</p>
//                 <p><b>Status:</b> {req.status}</p>
//               </div>
//               <div className="app-rej-btn">
//                 <button className="accept-request-btn" onClick={() => handleAcceptRequest(req._id)}>Accept</button>
//                 <button className="delete-request-btn" onClick={() => handleDelete(req._id)}>Delete</button>
//                 <button
//                     className="report-user-btn"
//                     onClick={() => {
//                       setReportingFinderId(req.finderId._id);
//                       setSelectedImage(null); // clear stale image from previous user
//                       console.log("Preparing to report:", req.finderId._id);
//                     }}
//                   >
//                     Report User
//                   </button>

//               </div>

//               {/* Show file input ONLY if this pet is being reported */}
//               {reportingFinderId === req.finderId._id && (
//                 <div className="image-upload-section">
//                   <label><b>Upload an Image:</b></label>
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleSelectImage}
//                   />
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="no-requests">No pending requests.</p>
//         )}
//       </div>

//       {/* ACCEPTED REQUESTS */}
//       <h2>Accepted Requests</h2>
//       <div className="requests-grid">
//         {requests.filter((req) => req.status === "Accepted").length > 0 ? (
//           requests.filter((req) => req.status === "Accepted").map((req) => (
//             <div key={req._id} className="pet-view-card request-card">
//               <div className="pet-card-pic">
//                 <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" className="pet-image" />
//               </div>
//               <div className="pet-card-details">
//                 <p><b>PetFinder Email:</b> {req.finderEmail}</p>
//                 <p><b>Contact PetFinder At:</b> {req.finderPhone}</p>
//                 <p><b>Status:</b> {req.status}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-requests">No accepted requests.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LostPetRequests;

import React, { useState, useEffect } from "react";
import "../../Styles/UserLostRequests.css";

const LostPetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [reportingFinderId, setReportingFinderId] = useState(null); 
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:4000/myLostPetRequests/${currentUserId}`);
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching lost pet requests:", error);
      }
    };
    fetchRequests();
  }, [currentUserId]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:4000/acceptLostPetRequest/${requestId}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to accept request.");

      alert("Request accepted!");
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "Accepted" } : req
        )
      );
    } catch (error) {
      alert("Failed to accept request.");
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:4000/deleteLostPetRequest/${requestId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete request.");
      alert("Deleted successfully!");
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const justification = prompt("Why are you reporting this user?");
    if (!justification) return alert("Justification required.");

    handleSubmitReport(justification, file);
  };

  const handleSubmitReport = async (justification, imageFile) => {
    const formData = new FormData();
    formData.append("finderId", reportingFinderId);
    formData.append("reportedBy", currentUserId);
    formData.append("justification", justification);
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:4000/reportUser", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to report user");
      alert("User reported.");
    } catch (err) {
      alert("Report failed.");
    }
  };

  return (
    <div className="req-container">
      <div className="requests-section-wrapper">
        {/* Pending Requests */}
        <div className="submitted-column">
          <h3 className="sub-heading">Pending Requests</h3>
          <div className="requests-grid">
            {requests.filter((req) => req.status === "Pending").length > 0 ? (
              requests
                .filter((req) => req.status === "Pending")
                .map((req) => (
                  <div key={req._id} className="pet-view-card request-card">
                    <div className="pet-card-pic">
                      <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" />
                    </div>
                    <div className="pet-card-details">
                      <p><b>PetFinder Email:</b> {req.finderEmail}</p>
                      <p><b>Contact PetFinder:</b> {req.finderPhone}</p>
                      <p><b>Status:</b> {req.status}</p>
                    </div>
                    <div className="app-rej-btn">
                      <button className="accept-request-btn" onClick={() => handleAcceptRequest(req._id)}>Accept</button>
                      <button className="delete-request-btn" onClick={() => handleDelete(req._id)}>Delete</button>
                      <button className="report-user-btn" onClick={() => setReportingFinderId(req.finderId._id)}>Report User</button>
                    </div>

                    {reportingFinderId === req.finderId._id && (
                      <div className="image-upload-section">
                        <label>Upload an Image:</label>
                        <input type="file" accept="image/*" onChange={handleSelectImage} />
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="no-requests">No pending requests.</p>
            )}
          </div>
        </div>

        {/* Accepted Requests */}
        <div className="submitted-column">
          <h3 className="sub-heading">Accepted Requests</h3>
          <div className="requests-grid">
            {requests.filter((req) => req.status === "Accepted").length > 0 ? (
              requests
                .filter((req) => req.status === "Accepted")
                .map((req) => (
                  <div key={req._id} className="pet-view-card request-card">
                    <div className="pet-card-pic">
                      <img src={`http://localhost:4000/Assets/${req.image}`} alt="Found Pet" />
                    </div>
                    <div className="pet-card-details">
                      <p><b>PetFinder Email:</b> {req.finderEmail}</p>
                      <p><b>Contact PetFinder:</b> {req.finderPhone}</p>
                      <p><b>Status:</b> {req.status}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-requests">No accepted requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostPetRequests;


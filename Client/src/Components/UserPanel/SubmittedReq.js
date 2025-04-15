// import React, { useState, useEffect } from "react";
// import "../../Styles/SubmittedReq.css"; 

// const SubmittedReq = () => {
//   const [submittedRequests, setSubmittedRequests] = useState([]);
//   const currentUserId = localStorage.getItem("userId"); // Finder's ID

//   useEffect(() => {
//     const fetchSubmittedRequests = async () => {
//       try {
//         const response = await fetch(`http://localhost:4000/mySubmittedRequests/${currentUserId}`);
//         if (!response.ok) throw new Error("Failed to fetch submitted requests");

//         const data = await response.json();
//         console.log("Fetched Submitted Requests:", data);
//         setSubmittedRequests(data);
//       } catch (error) {
//         console.error("Error fetching submitted requests:", error);
//       }
//     };

//     fetchSubmittedRequests();
//   }, [currentUserId]);

//   return (
//     <div className="req-container">
//       <h2 className="section-title">My Submitted Requests</h2>
      
//       {/* Show requests if any exist */}
//       <div className="requests-grid">
//         {submittedRequests.length > 0 ? (
//           submittedRequests.map((req) => (
//             <div key={req._id} className="pet-view-card request-card">
//               <div className="pet-card-pic">
//                 <img 
//                   src={`http://localhost:4000/Assets/${req.image}`} 
//                   alt="Submitted Pet"
//                   className="pet-image"
//                 />
//               </div>
//               <div className="pet-card-details">
//                 <p><b>Pet Name:</b> {req.petId?.name || "Unknown"}</p>
//                 <p><b>Pet Owner Email:</b> {req.finderEmail}</p>
//                 <p><b>Contact Owner:</b> {req.finderPhone}</p>
//                 <p><b>Status:</b> <span className={req.status === "accepted" ? "accepted-status" : "pending-status"}>{req.status}</span></p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-requests">No submitted requests.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubmittedReq;

import React, { useState, useEffect } from "react";
import "../../Styles/SubmittedReq.css";

const SubmittedReq = () => {
  const [lostRequests, setLostRequests] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const lostRes = await fetch(`http://localhost:4000/mySubmittedRequests/${currentUserId}`);
        const adoptRes = await fetch(`http://localhost:4000/form/mySubmittedAdoptionRequests/${currentUserId}`);

        const lostData = await lostRes.json();
        const adoptionData = await adoptRes.json();

        setLostRequests(lostData || []);
        setAdoptionRequests(adoptionData || []);
      } catch (error) {
        console.error("Error fetching submitted requests:", error);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  return (
    <div className="req-container">
      <div className="requests-section-wrapper">
        {/* Lost Pet Requests */}
        <div className="submitted-column">
          <h3 className="sub-heading">Lost Pet Requests</h3>
          <div className="requests-grid">
            {lostRequests.length > 0 ? (
              lostRequests.map((req) => (
                <div key={req._id} className="pet-view-card request-card">
                  <div className="pet-card-pic">
                    <img src={`http://localhost:4000/Assets/${req.image}`} alt="Submitted Pet" />
                  </div>
                  <div className="pet-card-details">
                    <p><b>Pet Name:</b> {req.petId?.name || "Unknown"}</p>
                    <p><b>Pet Owner Email:</b> {req.finderEmail}</p>
                    <p><b>Contact Owner:</b> {req.finderPhone}</p>
                    <p><b>Status:</b> 
                      <span className={req.status === "accepted" ? "accepted-status" : "pending-status"}>
                        {req.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-requests">No lost pet requests submitted.</p>
            )}
          </div>
        </div>

        {/* Adoption Requests */}
        <div className="submitted-column">
          <h3 className="sub-heading">Adoption Requests</h3>
          <div className="requests-grid">
            {adoptionRequests.length > 0 ? (
              adoptionRequests.map((req) => (
                <div key={req._id} className="pet-view-card request-card">
                  <div className="pet-card-pic">
                    <img
                      src={`http://localhost:4000/Assets/${req.petId?.filename || "default.jpg"}`}
                      alt={req.petId?.name || "Submitted Pet"}
                    />
                  </div>
                  <div className="pet-card-details">
                    <p><b>Pet Name:</b> {req.petId?.name || "Unknown"}</p>
                    <p><b>Pet Owner Email:</b> {req.ownerId?.email || "N/A"}</p>
                    <p><b>Status:</b> 
                      <span className={req.status === "Approved" ? "accepted-status" : "pending-status"}>
                        {req.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-requests">No adoption requests submitted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedReq;



// import React from 'react';

// const Form = ({ form,pet, updateCards, deleteBtnText, approveBtn, currentUserId }) => {


//   const handleAction = async (action) => {
//     try {

//       console.log("Sending API request:", {
//         action,
//         petId: pet._id, 
//         requestId: form._id 
//     });

    
//       const response = await fetch(`http://localhost:4000/handle-adoption`, {
//         method: "PATCH",  // Use PATCH for updating status
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           action,
//           petId: pet._id,  
//           requestId: form._id
//          })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         alert(data.error || "Failed to process request.");
//         return;
//       }

//       alert(`Adoption request ${action.toLowerCase()}d successfully.`);
//       updateCards(); // Refresh adoption requests list
//     } catch (error) {
//       console.error("Error handling adoption request:", error);
//     }
//   };

//   return (
//     <div className='form-card'>
//       <p><b>Adopter:</b> {form.email}</p>
//       <p><b>Phone No:</b> {form.phoneNo}</p>
//       {/* <p><b>Message:</b> {form.message || "No message provided."}</p> */}
//        <p><b>Living Situation:</b> {form.livingSituation || "Not provided"}</p>
//       <p><b>Pet History:</b> {form.previousExperience || "Not provided"}</p>
//       <p><b>Other Pets:</b> {form.familyComposition || "Not provided"}</p>
//       <p><b>Status:</b> {form.status}</p>

//       {approveBtn && (
//         <div className="app-rej-btn">
//           <button onClick={() => handleAction("Approve")} style={{ backgroundColor: "green", color: "white" }}>
//             Approve
//           </button>
//           <button onClick={() => handleAction("Reject")} style={{ backgroundColor: "red", color: "white" }}>
//             {deleteBtnText}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Form;

import React, { useState } from 'react';

const Form = ({ form, pet, updateCards, deleteBtnText, approveBtn, currentUserId }) => {
  const [reportingUserId, setReportingUserId] = useState(null);

  const handleAction = async (action) => {
    try {
      const response = await fetch(`http://localhost:4000/handle-adoption`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          petId: pet._id,
          requestId: form._id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to process request.");
        return;
      }

      alert(`Adoption request ${action.toLowerCase()}d successfully.`);
      updateCards();
    } catch (error) {
      console.error("Error handling adoption request:", error);
    }
  };

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !reportingUserId) return;

    const justification = prompt("Why are you reporting this user?");
    if (!justification || !justification.trim()) {
      alert("Justification is required.");
      return;
    }

    const formData = new FormData();
    formData.append("finderId", reportingUserId);
    formData.append("reportedBy", currentUserId);
    formData.append("justification", justification);
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:4000/reportUser", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        throw new Error("Failed to report user.");
      }

      alert("User reported successfully!");
      setReportingUserId(null);
    } catch (error) {
      console.error("Error reporting user:", error);
      alert("Failed to report user.");
    }
  };

  return (
    <div className="request-card">
      <div className="pet-card-details">
        <p><b>Adopter:</b> {form.email}</p>
        <p><b>Phone No:</b> {form.phoneNo}</p>
        <p><b>Living Situation:</b> {form.livingSituation || "Not provided"}</p>
        <p><b>Pet History:</b> {form.previousExperience || "Not provided"}</p>
        <p><b>Other Pets:</b> {form.familyComposition || "Not provided"}</p>
        <p><b>Status:</b> {form.status}</p>
      </div>

      {approveBtn && (
        <div className="app-rej-btn">
          <button className="accept-request-btn" onClick={() => handleAction("Approve")}>Approve</button>
          <button className="delete-request-btn" onClick={() => handleAction("Reject")}>{deleteBtnText}</button>
          <button className="report-user-btn" onClick={() => setReportingUserId(form.adopterId._id)}>Report User</button>
        </div>
      )}

      {reportingUserId === form.adopterId._id && (
        <div className="image-upload-section">
          <label><b>Upload an Image:</b></label>
          <input type="file" accept="image/*" onChange={handleSelectImage} />
        </div>
      )}
    </div>
  );
};

export default Form;




import React from 'react';

const Form = ({ form,pet, updateCards, deleteBtnText, approveBtn, currentUserId }) => {


  const handleAction = async (action) => {
    try {

      console.log("📡 Sending API request:", {
        action,
        petId: pet._id, 
        requestId: form._id 
    });

    
      const response = await fetch(`http://localhost:4000/handle-adoption`, {
        method: "PATCH",  // Use PATCH for updating status
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
      updateCards(); // Refresh adoption requests list
    } catch (error) {
      console.error("Error handling adoption request:", error);
    }
  };

  return (
    <div className='form-card'>
      <p><b>Adopter:</b> {form.email}</p>
      <p><b>Phone No:</b> {form.phoneNo}</p>
      {/* <p><b>Message:</b> {form.message || "No message provided."}</p> */}
       <p><b>Living Situation:</b> {form.livingSituation || "Not provided"}</p>
      <p><b>Pet History:</b> {form.previousExperience || "Not provided"}</p>
      <p><b>Other Pets:</b> {form.familyComposition || "Not provided"}</p>
      <p><b>Status:</b> {form.status}</p>

      {approveBtn && (
        <div className="app-rej-btn">
          <button onClick={() => handleAction("Approve")} style={{ backgroundColor: "green", color: "white" }}>
            Approve
          </button>
          <button onClick={() => handleAction("Reject")} style={{ backgroundColor: "red", color: "white" }}>
            {deleteBtnText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;


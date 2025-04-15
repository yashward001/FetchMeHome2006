import React, { useState, useEffect, useCallback } from 'react';
import FormCard from './Form';
import "../../Styles/AdoptionReq.css";

const AdoptionReq = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get the current logged-in user ID from localStorage or authentication state
  const currentUserId = localStorage.getItem("userId"); 

  const fetchForms = useCallback(async () => {
    console.log(`Fetching adoption requests for Owner ID: ${currentUserId}`);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/adoption-requests/${currentUserId}`);
      if (!response.ok) throw new Error('Error fetching forms');
      const data = await response.json();
      console.log("Retrieved adoption requests:", data);
      setForms(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchForms();
    }
  }, [currentUserId, fetchForms]);

  // Extract unique pet data from forms
  const uniquePets = Array.from(
    new Map(forms.map((form) => [form.petId._id, form.petId])).values()
  );

  return (
    <div className="req-container">
      
      {loading ? (
        <p>Loading...</p>
      ) : forms.length > 0 ? (
        <div className="form-container">
          {uniquePets.map((pet) => {
            const petForms = forms.filter((form) => form.petId._id === pet._id);
            return (
              <div key={pet._id} className='form-child-container'>
                <h2 className='clickable-pet-name'>{pet.name}</h2>
                {/* <p className={`adoption-status ${petForms[0].status === "Approved" ? "Approved" : "Pending"}`}>
                  Status: {petForms[0].status}
                </p> */}
                <div className='form-child-container'>
                  {petForms.map((form) => (
                    <FormCard
                      key={form._id}
                      form={form}
                      pet={pet}
                      updateCards={fetchForms}
                      deleteBtnText={form.status === "Approved" ? null : "Reject"}
                      approveBtn={form.status !== "Approved"}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No adoption requests available for your pets.</p>
      )}
    </div>
  );
};

export default AdoptionReq;

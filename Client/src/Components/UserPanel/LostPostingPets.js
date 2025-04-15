import React, { useState, useEffect, useCallback } from 'react';
import LostPetCards from './LostPetCards'; 

const LostPostingPets = () => {
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  const fetchLostPets = useCallback(async () => {
    try {
      if (!currentUserId) {
        console.error("User not logged in.");
        return;
      }

      // Fetch only the lost pets reported by the logged-in user
      const response = await fetch(`http://localhost:4000/myLostPets/${currentUserId}`);
      if (!response.ok) {
        throw new Error('An error occurred while fetching your lost pets.');
      }
      const data = await response.json();
      setLostPets(data);
    } catch (error) {
      console.log("Error fetching lost pets:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]); // Only re-fetch if currentUserId changes

  useEffect(() => {
    fetchLostPets();
  }, [fetchLostPets]);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : lostPets.length > 0 ? (
        lostPets.map((pet) => (
          <LostPetCards
            key={pet._id}
            pet={pet}
            updateCards={fetchLostPets}
            deleteBtnText="Delete"
            showEditButton={true} // Allow users to edit their lost pet reports
          />
        ))
      ) : (
        <p>No lost pets reported yet.</p>
      )}
    </div>
  );
};

export default LostPostingPets;

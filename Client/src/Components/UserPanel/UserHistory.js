import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './UserPetCards';

const UserHistory = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  const fetchAdoptedPets = useCallback(async () => {
    try {
      if (!currentUserId) {
        console.error("User not logged in.");
        return;
      }

      // Fetch pets that this user has successfully adopted
      const response = await fetch(`http://localhost:4000/adoptedHistory/${currentUserId}`);
      if (!response.ok) {
        throw new Error('An error occurred while fetching adopted pets');
      }
      const data = await response.json();
      setAdoptedPets(data);
    } catch (error) {
      console.error('Error fetching adopted pets:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]); // Depend only on currentUserId

  useEffect(() => {
    fetchAdoptedPets();
  }, [fetchAdoptedPets]); 

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : adoptedPets.length > 0 ? (
        adoptedPets.map((request) => (
          <PetCards
            key={request._id}
            pet={request.petId} 
            updateCards={fetchAdoptedPets}
            deleteBtnText={null}
            approveBtn={false}
          />
        ))
      ) : (
        <p>No Adopted History available</p>
      )}
    </div>
  );
};

export default UserHistory;



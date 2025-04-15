import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './UserPetCards';

const UserPostPets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  const fetchRequests = useCallback(async () => {
    try {
      if (!currentUserId) {
        console.error("User not logged in.");
        return;
      }

      // Fetch only the pets posted by the logged-in user
      const response = await fetch(`http://localhost:4000/myPets/${currentUserId}`);
      if (!response.ok) {
        throw new Error('An error occurred while fetching your pets.');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.log("Error fetching user pets:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]); 

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <PetCards
            key={request._id}
            pet={request}
            updateCards={fetchRequests}
            deleteBtnText="Delete"
            approveBtn={false}
            showEditButton={true} 
          />
        ))
      ) : (
        <p>No pets posted yet.</p>
      )}
    </div>
  );
};

export default UserPostPets;


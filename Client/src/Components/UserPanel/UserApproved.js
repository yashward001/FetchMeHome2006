import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './UserPetCards';

const UserApproved = () => {
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
  
      const response = await fetch(`http://localhost:4000/approvedPets/${currentUserId}`);
      if (!response.ok) {
        throw new Error('An error occurred while fetching approved pets');
      }
  
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching approved pets:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]); // Add dependencies here
  
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]); // Add fetchRequests to dependency array

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
            deleteBtnText={null}
            approveBtn={false}
            showEditButton={false}
          />
        ))
      ) : (
        <p>No Approved Pets available</p>
      )}
    </div>
  );
};

export default UserApproved;

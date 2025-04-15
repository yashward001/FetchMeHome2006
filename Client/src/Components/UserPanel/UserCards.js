import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const UserCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get logged-in user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  // Check if logged-in user is the pet's original owner
  const isOwner = props.pet.postedBy === currentUserId;

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:4000/delete/${props.pet._id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }) // Ensure only the owner can delete
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to delete pet');
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error deleting pet:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='req-container'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`http://localhost:4000/Assets/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Type:</b> {props.pet.type}</p>
          <p><b>New Owner Email:</b> {props.pet.email}</p>
          <p><b>New Owner Phone:</b> {props.pet.phone}</p>
          <p><b>Adopted:</b> {formatTimeAgo(props.pet.updatedAt)}</p>
        </div>

        {/* Show Delete Button Only If Logged-in User is the Owner */}
        {isOwner && (
          <div className='app-rej-btn'>
            <button onClick={handleReject} disabled={isDeleting}>
              {isDeleting ? <p>Deleting...</p> : (props.deleteBtnText)}
            </button>
          </div>
        )}

        {/* Popups */}
        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Oops!... Connection Error</p>
            </div>
            <button onClick={() => setShowErrorPopup(!showErrorPopup)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Deleted Successfully from Database...</p>
            </div>
            <button onClick={() => {
              setShowDeletedSuccess(!showDeletedSuccess);
              props.updateCards();
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCards;

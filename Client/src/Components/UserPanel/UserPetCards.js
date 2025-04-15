import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import "../../Styles/UserPetCards.css"

const UserPetCards = (props) => {
  const [showJustificationPopup, setShowJustificationPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
//   const [isApproving, setIsApproving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState({ ...props.pet });

  // Get logged-in user ID
  const currentUserId = localStorage.getItem("userId");

  // Check if the logged-in user is the pet's original owner
  const isOwner = props.pet.postedBy === currentUserId;

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleInputChange = (e) => {
    setEditedPet({ ...editedPet, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {

      console.log("Sending update request for pet ID:", props.pet._id);
      console.log("Data being sent:", JSON.stringify(editedPet));

      const response = await fetch(`http://localhost:4000/updatePet/${props.pet._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPet),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to update pet details.');
      }
    
      setIsEditing(false);
      props.updateCards(); 
    } catch (err) {
      console.error('Error updating pet:', err);
      setShowErrorPopup(true);
    }
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
        const petId = props.pet._id;
        const url = `http://localhost:4000/deleteP/${petId}?userId=${currentUserId}`; 

        console.log("Sending DELETE request to:", url);

        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            setShowErrorPopup(true);
            throw new Error("Failed to delete pet");
        } else {
            console.log("Pet deleted successfully!");
            setShowDeletedSuccess(true);
        }
    } catch (err) {
        console.error("Error deleting pet:", err);
        setShowErrorPopup(true);
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

        {isEditing ? (
          <div className='pets-card-details'>
            <label>Name:</label>
            <input type="text" name="name" value={editedPet.name} onChange={handleInputChange} />
            <label>Type:</label>
            <input type="text" name="type" value={editedPet.type} onChange={handleInputChange} />
            <label>Age:</label>
            <input type="text" name="age" value={editedPet.age} onChange={handleInputChange} />
            <label>Location:</label>
            <input type="text" name="area" value={editedPet.area} onChange={handleInputChange} />
            <label>Email:</label>
            <input type="text" name="email" value={editedPet.email} onChange={handleInputChange} />
            <label>Phone:</label>
            <input type="text" name="phone" value={editedPet.phone} onChange={handleInputChange} />
            <label>Justification:</label>
            <textarea name="justification" value={editedPet.justification} onChange={handleInputChange}></textarea>
            <div className="edit-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
            <div className='pet-card-details'>
            <h2>{props.pet.name}</h2>
            <p><b>Type:</b> {props.pet.type}</p>
            <p><b>Age:</b> {props.pet.age}</p>
            <p><b>Location:</b> {props.pet.area}</p>
            <p><b>Owner Email:</b> {props.pet.email}</p>
            <p><b>Owner Phone:</b> {props.pet.phone}</p>
            <p>
                <b>Justification:</b>
                <span>
                {truncateText(props.pet.justification, maxLength)}
                {props.pet.justification.length > maxLength && (
                    <span onClick={() => setShowJustificationPopup(!showJustificationPopup)} className='read-more-btn'>
                    Read More
                    </span>
                )}
                </span>
            </p>
            <p>{formatTimeAgo(props.pet.updatedAt)}</p>
            </div>
        )}  

        {/*  Buttons for Owner (Always Visible) */}
        {isOwner && (
          <div className='app-rej-btn' style={{ display: 'flex', gap: '10px' }}>
            {/* Edit Button (Only show if showEditButton is true) */}
            {props.showEditButton && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}

            {/* Delete Button */}
            
            {props.deleteBtnText && (
              <button onClick={handleReject} disabled={isDeleting}>
                {isDeleting ? (<p>Deleting</p>) : props.deleteBtnText}
              </button>
            )}
          </div>



        )}

        {showJustificationPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <h4>Justification:</h4>
              <p>{props.pet.justification}</p>
            </div>
            <button onClick={() => setShowJustificationPopup(!showJustificationPopup)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
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
        {showApproved && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Approval Successful...</p>
              <p>
                Please contact the customer at{' '}
                <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a>{' '}
                or{' '}
                <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>{' '}
                to arrange the transfer of the pet from the owner's home to our adoption center.
              </p>
            </div>
            <button onClick={() => {
              setShowApproved(!showApproved);
              props.updateCards();
            }} className='close-btn'>
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

export default UserPetCards;

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../Styles/UserLostPetCards.css"; 

const LostPetCards = (props) => {
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState({ ...props.pet });

  // Get logged-in user ID
  const currentUserId = localStorage.getItem("userId");

  // Check if the logged-in user is the one who reported the pet
  const isOwner = props.pet?.reportedBy === currentUserId;

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) => {
    if (!updatedAt) return "Unknown";
    const date = new Date(updatedAt);
    return isNaN(date) ? "Invalid Date" : formatDistanceToNow(date, { addSuffix: true });
  };

  const handleInputChange = (e) => {
    setEditedPet({ ...editedPet, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      console.log("Updating lost pet report:", props.pet._id);

      console.log("Data:", JSON.stringify(editedPet));

      const updatedPetData = {
        ...editedPet,
        userId: currentUserId, // Ensure userId is included
      };


      const response = await fetch(`http://localhost:4000/updateLostPet/${props.pet._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPetData),
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to update lost pet details.");
      }

      setIsEditing(false);
      props.updateCards(); // ✅ Refresh UI
    } catch (err) {
      console.error("Error updating lost pet:", err);
      setShowErrorPopup(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:4000/deleteLostPet/${props.pet._id}`, {
        method: "DELETE",
        body: JSON.stringify({ userId: currentUserId }), // Ensure only the owner can delete
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete lost pet report.");
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error("Error deleting lost pet:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="req-container">
      <div className="pet-view-card">
        <div className="pet-card-pic">
          {props.pet?.filename ? (
            <img src={`http://localhost:4000/Assets/${props.pet.filename}`} alt={props.pet.name} />
          ) : (
            <p>No image available</p>
          )}
        </div>

        {isEditing ? (
          <div className="pets-card-details">
            <label>Name:</label>
            <input type="text" name="name" value={editedPet.name} onChange={handleInputChange} />
            <label>Type:</label>
            <input type="text" name="type" value={editedPet.type} onChange={handleInputChange} />
            <label>Age:</label>
            <input type="text" name="petAge" value={editedPet.petAge} onChange={handleInputChange} />
            <label>Last Seen Location:</label>
            <input type="text" name="lastSeenLocation" value={editedPet.lastSeenLocation} onChange={handleInputChange} />
            <label>Email:</label>
            <input type="text" name="email" value={editedPet.email} onChange={handleInputChange} />
            <label>Phone:</label>
            <input type="text" name="phone" value={editedPet.phone} onChange={handleInputChange} />
            <label>Description:</label>
            <textarea name="description" value={editedPet.description} onChange={handleInputChange}></textarea>
            <div className="edit-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="pet-card-details">
            <h2>{props.pet.name}</h2>
            <p><b>Type:</b> {props.pet.type}</p>
            <p><b>Age:</b> {props.pet.petAge}</p>
            <p><b>Last Seen Location:</b> {props.pet.lastSeenLocation}</p>
            <p><b>Owner Email:</b> {props.pet.email}</p>
            <p><b>Owner Phone:</b> {props.pet.phone}</p>
            <p>
              <b>Description:</b>
              <span>
                {truncateText(props.pet.description, maxLength)}
                {props.pet.description.length > maxLength && (
                  <span onClick={() => setShowDescriptionPopup(!showDescriptionPopup)} className="read-more-btn">
                    Read More
                  </span>
                )}
              </span>
            </p>
            <p>{formatTimeAgo(props.pet.updatedAt)}</p>
          </div>
        )}

        {/* Buttons for Owner (Always Visible) */}
        {isOwner && (
          <div className="app-rej-btn" style={{ display: "flex", gap: "10px" }}>
            {/* Edit Button */}
            {props.showEditButton && <button onClick={() => setIsEditing(true)}>Edit</button>}
            {/* Delete Button */}
            <button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <p>Deleting...</p> : props.deleteBtnText}
            </button>
          </div>
        )}

        {showDescriptionPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Description:</h4>
              <p>{props.pet.description}</p>
            </div>
            <button onClick={() => setShowDescriptionPopup(!showDescriptionPopup)} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showErrorPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Oops!... Connection Error</p>
            </div>
            <button onClick={() => setShowErrorPopup(!showErrorPopup)} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className="popup">
            <div className="popup-content">
              <p>Deleted Successfully from Database...</p>
            </div>
            <button onClick={() => {
              setShowDeletedSuccess(!showDeletedSuccess);
              props.updateCards();
            }} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostPetCards;

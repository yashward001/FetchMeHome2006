import React from "react";
import { formatDistanceToNow } from "date-fns";
import "../../Styles/LostPetsViewer.css";  

const AdminLostPetsViewer = ({ pet }) => {
  // Function to handle deletion of the lost pet listing
  const handleDeleteLostListing = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this lost pet listing?")) return;
  
    try {
      const response = await fetch(`http://localhost:4000/admin/deleteLost/${petId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete lost pet listing");
      }
  
      alert("Lost pet listing deleted successfully.");
      window.location.reload();

    } catch (err) {
      console.error("Error deleting lost pet listing:", err);
      alert("Failed to delete listing");
    }
  };
  
  
  // Function to handle banning the user who reported the lost pet
  const handleBanUser = async (userId) => {
    if (!window.confirm("Are you sure you want to ban this user?")) return;

    try {
      const response = await fetch(`http://localhost:4000/admin/banUser/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error("Failed to ban user");
      }
      alert("User banned successfully");
    } catch (err) {
      console.error("Error banning user:", err);
      alert("Failed to ban user");
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return isNaN(date) ? "Invalid Date" : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="pet-view-card">
      <div className="pet-card-pic">
        <img 
          src={pet.filename ? `http://localhost:4000/Assets/${pet.filename}` : "/default-image.jpg"} 
          alt={pet.name} 
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>
      <div className="pet-card-details">
        <h2>{pet.name}</h2>
        <p><b>Type:</b> {pet.type}</p>
        <p><b>Age:</b> {pet.petAge}</p>
        <p><b>Last Seen Location:</b> {pet.lastSeenLocation}</p>
        <p><b>Status:</b> {pet.status}</p>
        <p><b>Description:</b> {pet.description}</p>
        <p>{formatTimeAgo(pet.createdAt)}</p>
      </div>
      {pet.status !== "Found" && (
        <div className="admin-actions">
          <div className="button-group">
            <button className="delete-btn" onClick={() => handleDeleteLostListing(pet._id)}>
              Delete Listing
            </button>
            <button className="delete-btn" onClick={() => handleBanUser(pet.reportedBy)}>
              Ban User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLostPetsViewer;

import React from "react";
import { formatDistanceToNow } from "date-fns";

const AdminPetsViewer = (props) => {
  // Function to handle deletion of the pet listing
  const handleDeleteListing = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet listing?")) return;
    
    try {
      const url = `http://localhost:4000/admindeleteP/${petId}`;
      
      const response = await fetch(url, {
        method: "DELETE",
      });   
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete pet listing");
      }
      
      alert("Pet listing deleted successfully.");
      window.location.reload();
      
      if (props.onDeleteSuccess) {
        props.onDeleteSuccess();
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert(`Failed to delete listing: ${err.message}`);
    }
  };
  
  // Function to handle banning the user who posted the pet
  const handleBanUser = async (userId) => {
    if (!window.confirm("Are you sure you want to ban this user?")) return;
    
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await fetch(`http://localhost:4000/admin/banUser/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
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

  // Helper function to format the update time
  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Check if current user is the owner of this pet or an admin
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = currentUser.isAdmin === true;
  const isOwner = currentUser._id === props.pet.postedBy;
  const canDelete = isAdmin || isOwner;
  
  return (
    <div className='pet-view-card'>
      <div className='pet-card-pic'>
        <img 
          src={`http://localhost:4000/Assets/${props.pet.filename}`} 
          alt={props.pet.name} 
        />
      </div>
      <div className='pet-card-details'>
        <h2>{props.pet.name}</h2>
        <p><b>Type:</b> {props.pet.type}</p>
        <p><b>Age:</b> {props.pet.age}</p>
        <p><b>Location:</b> {props.pet.area}</p>
        <p><b>Status:</b> {props.pet.status}</p>
        <p>{formatTimeAgo(props.pet.updatedAt)}</p>
      </div>
      
      {/* Show delete option if user can delete and pet is not Adopted */}
      {canDelete && props.pet.status !== "Adopted" && (
        <div className='admin-actions'>
          <div className="button-group">
            <button className="delete-btn" onClick={() => handleDeleteListing(props.pet._id)}>
              Delete Listing
            </button>
            
            {/* Only show Ban User button for admins */}
            {isAdmin && (
              <button className="delete-btn" onClick={() => handleBanUser(props.pet.postedBy)}>
                Ban User
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPetsViewer;

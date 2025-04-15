import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../Styles/LostPetsViewer.css";

const LostPetsViewer = ({ pet }) => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [finderEmail, setFinderEmail] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const formatTimeAgo = (updatedAt) => {
    if (!updatedAt) return "Unknown";
    const date = new Date(updatedAt);
    return isNaN(date) ? "Invalid Date" : formatDistanceToNow(date, { addSuffix: true });
  };

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to upload an image.");
      return;
    }
    setShowUploadPopup(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    
    // Create a preview URL for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    const finderId = localStorage.getItem("userId");

    if (!uploadFile || !finderEmail || !finderPhone) {
      alert("Please fill all fields and select an image.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("petId", pet._id);
    formData.append("finderId", finderId);
    formData.append("finderEmail", finderEmail);
    formData.append("finderPhone", finderPhone);
    formData.append("image", uploadFile);

    try {
      const response = await fetch("http://localhost:4000/reportFoundPet", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setShowSuccess(true);
      
      // Reset the form after successful submission
      setTimeout(() => {
        setShowSuccess(false);
        setShowUploadPopup(false);
        setUploadFile(null);
        setImagePreview(null);
        setFinderEmail("");
        setFinderPhone("");
      }, 3000);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => {
    let badgeClass = "status-badge";
    
    switch(status) {
      case "Found":
        badgeClass += " found";
        break;
      case "Missing":
        badgeClass += " missing";
        break;
      default:
        badgeClass += " default";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <div className="lost-pet-card">
      {/* Status Badge */}
      <div className="pet-card-header">
        {renderStatusBadge(pet.status)}
        <div className="time-ago">
          <i className="fa fa-clock-o"></i> {formatTimeAgo(pet.createdAt)}
        </div>
      </div>
      
      {/* Pet Image */}
      <div className="pet-image-container">
        <img
          src={pet.filename ? `http://localhost:4000/Assets/${pet.filename}` : "/default-image.jpg"}
          alt={pet.name}
          className="pet-image"
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>
      
      {/* Pet Details */}
      <div className="pet-card-content">
        <h3 className="pet-name">{pet.name}</h3>
        
        <div className="pet-details">
          <div className="pet-detail">
            <span className="pet-detail-icon type-icon"></span>
            <span className="pet-detail-label">{pet.type}</span>
          </div>
          
          <div className="pet-detail">
            <span className="pet-detail-icon age-icon"></span>
            <span className="pet-detail-label">{pet.petAge}</span>
          </div>
        </div>
        
        <div className="pet-detail location-detail">
          <span className="pet-detail-icon location-icon"></span>
          <span className="pet-detail-label">{pet.lastSeenLocation}</span>
        </div>
        
        {/* Actions */}
        <div className="pet-actions">
          {pet.status !== "Found" && (
            <button className="found-button" onClick={handleUploadClick}>
              <i className="fa fa-camera"></i> I Found This Pet
            </button>
          )}
          
          <button className="details-button" onClick={() => setShowDetails(true)}>
            View Details
          </button>
        </div>
      </div>
      
      {/* Upload Image Popup */}
      {showUploadPopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Report Found Pet</h3>
              <button className="modal-close" onClick={() => {
                setShowUploadPopup(false);
                setImagePreview(null);
              }}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              {showSuccess ? (
                <div className="success-message">
                  <i className="fa fa-check-circle"></i>
                  <p>Report sent to pet owner!</p>
                  <p className="success-subtitle">Thank you for helping reunite a pet with their family.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="upload-form">
                  <div className="form-group">
                    <label htmlFor="finderEmail">Your Email</label>
                    <input
                      type="email"
                      id="finderEmail"
                      value={finderEmail}
                      onChange={(e) => setFinderEmail(e.target.value)}
                      required
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="finderPhone">Your Phone</label>
                    <input
                      type="tel"
                      id="finderPhone"
                      value={finderPhone}
                      onChange={(e) => setFinderPhone(e.target.value)}
                      required
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Upload a Photo</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="file-upload-label">
                        <i className="fa fa-upload"></i> Choose Image
                      </label>
                      <span className="selected-file-name">
                        {uploadFile ? uploadFile.name : "No file selected"}
                      </span>
                    </div>
                    
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowUploadPopup(false);
                        setImagePreview(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button" 
                      disabled={isSubmitting || !uploadFile || !finderEmail || !finderPhone}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Pet Details Popup */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal-container details-modal">
            <div className="modal-header">
              <h3>{pet.name}</h3>
              <button className="modal-close" onClick={() => setShowDetails(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="details-content">
                <div className="details-image">
                  <img
                    src={pet.filename ? `http://localhost:4000/Assets/${pet.filename}` : "/default-image.jpg"}
                    alt={pet.name}
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                  <div className="details-status">
                    {renderStatusBadge(pet.status)}
                  </div>
                </div>
                
                <div className="details-info">
                  <div className="details-section">
                    <h4>Pet Information</h4>
                    <div className="details-grid">
                      <div className="details-item">
                        <span className="details-label">Type:</span>
                        <span className="details-value">{pet.type}</span>
                      </div>
                      <div className="details-item">
                        <span className="details-label">Age:</span>
                        <span className="details-value">{pet.petAge}</span>
                      </div>
                      <div className="details-item">
                        <span className="details-label">Last Seen:</span>
                        <span className="details-value">{pet.lastSeenLocation}</span>
                      </div>
                      <div className="details-item">
                        <span className="details-label">Posted:</span>
                        <span className="details-value">{formatTimeAgo(pet.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="details-section">
                    <h4>Description</h4>
                    <p className="details-description">{pet.description}</p>
                  </div>
                  
                  <div className="details-section">
                    <h4>Contact Information</h4>
                    <div className="details-contact">
                      <a href={`mailto:${pet.email}`} className="contact-button email-button">
                        <i className="fa fa-envelope"></i> Email Owner
                      </a>
                      <a href={`tel:${pet.phone}`} className="contact-button phone-button">
                        <i className="fa fa-phone"></i> Call Owner
                      </a>
                    </div>
                  </div>
                  
                  {pet.status !== "Found" && (
                    <div className="details-actions">
                      <button className="found-button full-width" onClick={() => {
                        setShowDetails(false);
                        setTimeout(() => handleUploadClick(), 300);
                      }}>
                        <i className="fa fa-camera"></i> I Found This Pet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostPetsViewer;
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../Styles/LostPetsViewer.css";

const LostPetsViewer = ({ pet }) => {
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [finderEmail, setFinderEmail] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleUploadClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to upload an image.");
      return;
    }
    setShowUploadPopup(true);
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUploadSubmit = async () => {
    const finderId = localStorage.getItem("userId");

    if (!uploadFile || !finderEmail || !finderPhone) {
      alert("Please fill all fields and select an image.");
      return;
    }

    if (!finderEmail.endsWith("@gmail.com")) {
      alert("Please enter a valid email address (must end with @gmail.com).");
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

      alert("Report sent to pet owner!");
      setShowUploadPopup(false);
      setUploadFile(null);
      setFinderEmail("");
      setFinderPhone("");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    const reason = prompt("Why are you reporting this lost pet listing?");
    if (reason === null) return; // user canceled

    if (!reason.trim()) {
      alert("Please provide a short reason.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/reportLostPet/${pet._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error("Failed to report listing.");

      alert("Lost pet listing reported. The admin will review it.");
    } catch (error) {
      console.error("Error reporting lost listing:", error);
      alert("Failed to report listing.");
    }
  };

  const handleDetailsClick = () => {
    setShowDetailsPopup(true);
  };

  return (
    <>
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
          <p>{formatTimeAgo(pet.createdAt)}</p>
        </div>
        
        <div className="card-actions">
          <button className="view-details-btn" onClick={handleDetailsClick}>View Details</button>
          
          {/* Report or Upload Buttons */}
          {pet.status !== "Found" && (
            <div className="show-interest-btn">
              {isLoggedIn ? (
                <>
                  <button className="verify-pet-btn" onClick={handleUploadClick}>
                    Verify Pet <i className="fa fa-upload"></i>
                  </button>
                  <button className="report-btn" onClick={handleReport}>
                    Report
                  </button>
                </>
              ) : (
                <p className="login-message">🚫 Login to do more actions</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Pop-up */}
      {showUploadPopup && (
        <div className="modal-overlay" onClick={() => setShowUploadPopup(false)}>
          <div className="report-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Found Pet</h3>
              <button className="modal-close" onClick={() => setShowUploadPopup(false)}>×</button>
            </div>
            
            <div className="report-form-content">
              <div className="form-field">
                <label htmlFor="finder-email">Your Email</label>
                <input 
                  id="finder-email"
                  type="email" 
                  placeholder="Your email address" 
                  value={finderEmail}
                  onChange={(e) => setFinderEmail(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="finder-phone">Your Phone</label>
                <input 
                  id="finder-phone"
                  type="tel" 
                  placeholder="Your phone number" 
                  value={finderPhone}
                  onChange={(e) => setFinderPhone(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label className="file-upload-label">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <span className="upload-btn">
                    <i className="fa fa-upload"></i> Choose Image
                  </span>
                  <span className="file-name">
                    {uploadFile ? uploadFile.name : "No file selected"}
                  </span>
                </label>
              </div>
              
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowUploadPopup(false)}>Cancel</button>
                <button 
                  className="submit-btn" 
                  onClick={handleUploadSubmit}
                  disabled={isSubmitting || !finderEmail || !finderPhone || !uploadFile}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsPopup && (
        <div className="modal-overlay" onClick={() => setShowDetailsPopup(false)}>
          <div className="pet-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close-btn" onClick={() => setShowDetailsPopup(false)}>×</div>
            
            <h2>{pet.name}</h2>
            
            <div className="details-content">
              <div className="details-image">
                <img 
                  src={pet.filename ? `http://localhost:4000/Assets/${pet.filename}` : "/default-image.jpg"} 
                  alt={pet.name}
                  onError={(e) => {e.target.src = "/default-image.jpg"}}
                />
                <div className="pet-status">{pet.status}</div>
              </div>
              
              <div className="details-info">
                <div className="info-section">
                  <h3>Pet Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Type:</span>
                      <span className="info-value">{pet.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{pet.petAge}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Seen:</span>
                      <span className="info-value">{pet.lastSeenLocation}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Posted:</span>
                      <span className="info-value">{formatTimeAgo(pet.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="info-section">
                  <h3>Description</h3>
                  <p className="pet-description">{pet.description || "No description available."}</p>
                </div>
                
                <div className="info-section">
                  <h3>Contact</h3>
                  <div className="contact-buttons">
                    <a href={`mailto:${pet.email}`} className="contact-btn email-btn">
                      <i className="fa fa-envelope"></i> Email Owner
                    </a>
                    <a href={`tel:${pet.phone}`} className="contact-btn phone-btn">
                      <i className="fa fa-phone"></i> Call Owner
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {pet.status !== "Found" && isLoggedIn && (
              <div className="details-actions">
                <button 
                  className="verify-button" 
                  onClick={() => {
                    setShowDetailsPopup(false);
                    setTimeout(() => setShowUploadPopup(true), 300);
                  }}
                >
                  <i className="fa fa-camera"></i> I Found This Pet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LostPetsViewer;
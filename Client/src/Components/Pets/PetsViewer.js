import React, { useState, useEffect } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';
import '../../Styles/PetViewer.css';

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Form state
  const [reportEmail, setReportEmail] = useState("");
  const [reportPhone, setReportPhone] = useState("");
  const [reportImage, setReportImage] = useState(null);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);
  
  const openPopup = (pet) => {
    setSelectedPet(pet);
    setShowPopup(true);
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setSelectedPet(null);
  };
  
  const openDetails = () => {
    setShowDetails(true);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
  };
  
  const openReportForm = () => {
    setShowReportForm(true);
  };
  
  const closeReportForm = () => {
    setShowReportForm(false);
    setReportEmail("");
    setReportPhone("");
    setReportImage(null);
  };
  
  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleReport = async (petId) => {
    try {
      const reason = prompt("Why are you reporting this listing?");
      if (reason === null) return;
      if (!reason.trim()) {
        alert("Please provide a short description.");
        return;
      }
      const response = await fetch(`http://localhost:4000/report/${petId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error("Failed to report listing.");
      alert("Listing reported successfully. The admin will review it.");
    } catch (err) {
      console.error("Error reporting listing:", err);
      alert("Listing already reported! Please wait for the admin to review.");
    }
  };
  
  const handleVerifyPet = (e) => {
    e.preventDefault();
    openReportForm();
  };
  
  const handleFileChange = (e) => {
    setReportImage(e.target.files[0]);
  };
  
  const handleSubmitReport = async () => {
    if (!reportEmail || !reportPhone || !reportImage) {
      alert("Please fill all fields and select an image");
      return;
    }
    
    // Add your submit logic here
    alert("Report submitted successfully!");
    closeReportForm();
  };
  
  return (
    <>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`http://localhost:4000/Assets/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Type:</b> {props.pet.type}</p>
          <p><b>Age:</b> {props.pet.age}</p>
          <p><b>Location:</b> {props.pet.area}</p>
          <p><b>Status:</b> {props.pet.status}</p>
          <p>{formatTimeAgo(props.pet.updatedAt)}</p>
        </div>
        
        <div className="card-actions">
          <button className="view-details-btn" onClick={openDetails}>View Details</button>
          
          {props.pet.status !== "Adopted" && (
            <div className='show-interest-btn'>
              {isLoggedIn ? (
                <>
                  <button className="verify-pet-btn" onClick={handleVerifyPet}>
                    Verify Pet <i className="fa fa-paw"></i>
                  </button>
                  <button className="report-btn" onClick={() => handleReport(props.pet._id)}>
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
      
      {/* Adoption Form Popup */}
      {showPopup && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adoption Application</h3>
              <button className="modal-close" onClick={closePopup}>×</button>
            </div>
            <div className="modal-content">
              <AdoptForm closeForm={closePopup} pet={selectedPet}/>
            </div>
          </div>
        </div>
      )}
      
      {/* Pet Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="pet-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close-btn" onClick={closeDetails}>×</div>
            
            <h2>{props.pet.name}</h2>
            
            <div className="details-content">
              <div className="details-image">
                <img src={`http://localhost:4000/Assets/${props.pet.filename}`} alt={props.pet.name} />
                <div className="pet-status">{props.pet.status}</div>
              </div>
              
              <div className="details-info">
                <div className="info-section">
                  <h3>Pet Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Type:</span>
                      <span className="info-value">{props.pet.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{props.pet.age}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{props.pet.area}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Posted:</span>
                      <span className="info-value">{formatTimeAgo(props.pet.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="info-section">
                  <h3>Description</h3>
                  <p className="pet-description">{props.pet.justification || "No description available."}</p>
                </div>
                
                <div className="info-section">
                  <h3>Contact</h3>
                  <div className="contact-buttons">
                    <a href={`mailto:${props.pet.email}`} className="contact-btn email-btn">
                      <i className="fa fa-envelope"></i> Email Owner
                    </a>
                    <a href={`tel:${props.pet.phone}`} className="contact-btn phone-btn">
                      <i className="fa fa-phone"></i> Call Owner
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {props.pet.status !== "Adopted" && isLoggedIn && (
              <div className="details-actions">
                <button 
                  className="adopt-button" 
                  onClick={() => {
                    closeDetails();
                    setTimeout(() => openPopup(props.pet), 300);
                  }}
                >
                  <i className="fa fa-paw"></i> Adopt This Pet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Report Form Modal */}
      {showReportForm && (
        <div className="modal-overlay" onClick={closeReportForm}>
          <div className="report-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Found Pet</h3>
              <button className="modal-close" onClick={closeReportForm}>×</button>
            </div>
            
            <div className="report-form-content">
              <div className="form-field">
                <label htmlFor="report-email">Your Email</label>
                <input 
                  id="report-email"
                  type="email" 
                  placeholder="Your email address" 
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="report-phone">Your Phone</label>
                <input 
                  id="report-phone"
                  type="tel" 
                  placeholder="Your phone number" 
                  value={reportPhone}
                  onChange={(e) => setReportPhone(e.target.value)}
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
                    {reportImage ? reportImage.name : "No file selected"}
                  </span>
                </label>
              </div>
              
              <div className="form-actions">
                <button className="cancel-btn" onClick={closeReportForm}>Cancel</button>
                <button 
                  className="submit-btn" 
                  onClick={handleSubmitReport}
                  disabled={!reportEmail || !reportPhone || !reportImage}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetsViewer;
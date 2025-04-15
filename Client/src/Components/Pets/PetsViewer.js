import React, { useState, useEffect } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';
// Let's use the default styles for now
// import '../../Styles/PetsViewer.css';

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const openPopup = (pet) => {
    if (!isLoggedIn) {
      alert("Please log in to show interest in adopting this pet");
      return;
    }
    setSelectedPet(pet);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPet(null);
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please log in to save this pet");
      return;
    }
    setIsSaved(!isSaved);
    // Implement save functionality here
  };

  const openReportModal = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please log in to report this listing");
      return;
    }
    setShowReport(true);
  };

  const closeReportModal = () => {
    setShowReport(false);
    setReportReason('');
  };

  const handleReport = async (e) => {
    e.preventDefault();
    
    if (!reportReason.trim()) {
      alert("Please provide a reason for reporting");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:4000/report/${props.pet._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason })
      });

      if (!response.ok) throw new Error("Failed to report listing.");
      
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReport(false);
        setReportReason('');
        setReportSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error reporting listing:", err);
      alert("Listing already reported! Please wait for the admin to review.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    let badgeClass = "status-badge";
    
    switch(status) {
      case "Adopted":
        badgeClass += " adopted";
        break;
      case "Pending":
        badgeClass += " pending";
        break;
      case "Approved":
        badgeClass += " available";
        break;
      default:
        badgeClass += " default";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <div className="pet-card">
      <div className="pet-card-inner">
        <div className="pet-card-front">
          <div className="pet-card-header">
            {renderStatusBadge(props.pet.status)}
            <div className="pet-actions">
              <button 
                className={`save-button ${isSaved ? 'saved' : ''}`} 
                onClick={toggleSave}
                aria-label="Save pet"
              >
                <i className={`fa ${isSaved ? 'fa-heart' : 'fa-heart-o'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="pet-image-container">
            <img 
              src={`http://localhost:4000/Assets/${props.pet.filename}`} 
              alt={props.pet.name} 
              className="pet-image"
            />
          </div>
          
          <div className="pet-card-content">
            <h3 className="pet-name">{props.pet.name}</h3>
            <div className="pet-details">
              <div className="pet-detail">
                <span className="pet-detail-icon type-icon"></span>
                <span className="pet-detail-label">{props.pet.type}</span>
              </div>
              <div className="pet-detail">
                <span className="pet-detail-icon age-icon"></span>
                <span className="pet-detail-label">{props.pet.age}</span>
              </div>
              <div className="pet-detail">
                <span className="pet-detail-icon location-icon"></span>
                <span className="pet-detail-label">{props.pet.area}</span>
              </div>
            </div>
            
            <div className="pet-timeago">
              <i className="fa fa-clock-o"></i> {formatTimeAgo(props.pet.updatedAt)}
            </div>

            {props.pet.status !== "Adopted" && (
              <div className="pet-card-actions">
                <button 
                  className="adopt-button" 
                  onClick={() => openPopup(props.pet)}
                  disabled={props.pet.status === "Adopted"}
                >
                  <i className="fa fa-paw"></i> Adopt Me
                </button>
                <button className="report-button" onClick={openReportModal}>
                  <i className="fa fa-flag"></i>
                </button>
              </div>
            )}
          </div>
          
          <div className="pet-card-expand">
            <button className="expand-button" onClick={() => openPopup(props.pet)}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Adoption Form Popup */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Adoption Application</h2>
              <button className="modal-close" onClick={closePopup}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <AdoptForm closeForm={closePopup} pet={selectedPet}/>
            </div>
          </div>
        </div>
      )}

      {/* Report Listing Modal */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-container report-modal">
            <div className="modal-header">
              <h2>Report This Listing</h2>
              <button className="modal-close" onClick={closeReportModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              {reportSubmitted ? (
                <div className="report-success">
                  <i className="fa fa-check-circle"></i>
                  <p>Report submitted successfully. The admin will review it.</p>
                </div>
              ) : (
                <form onSubmit={handleReport} className="report-form">
                  <div className="form-group">
                    <label htmlFor="reportReason">Why are you reporting this listing?</label>
                    <textarea
                      id="reportReason"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please explain why you're reporting this listing..."
                      required
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={closeReportModal} className="cancel-button">
                      Cancel
                    </button>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                      {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsViewer;
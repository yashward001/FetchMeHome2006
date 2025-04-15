import React, { useState, useEffect } from 'react';
import AdoptForm from '../AdoptForm/AdoptForm';
import { formatDistanceToNow } from 'date-fns';

const PetsViewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        {/* <div className='show-interest-btn'>
          <button onClick={() => openPopup(props.pet)}>Show Interest <i className="fa fa-paw"></i></button>
          <button className="report-btn" onClick={() => handleReport(props.pet._id)}>Report</button>
        </div> */}
        {props.pet.status !== "Adopted" && (
            <div className='show-interest-btn'>
              {isLoggedIn ? (
                <>
                  <button onClick={() => openPopup(props.pet)}>
                    Show Interest <i className="fa fa-paw"></i>
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

      {/* Popup Form (outside of pet card) */}
      {showPopup && (
        <>
          <div className='popup-overlay' onClick={closePopup}></div>
          <div className='popup'>
            <div className='popup-content'>
              <AdoptForm closeForm={closePopup} pet={selectedPet}/>
            </div>
            <button onClick={closePopup} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PetsViewer;

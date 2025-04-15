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
    formData.append("finderId", finderId); // ID of lost pet
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

      {/* Report or Upload Buttons */}
      {pet.status !== "Found" && (
        <div className="show-interest-btn">
          {isLoggedIn ? (
            <>
              <button onClick={handleUploadClick}>
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

      {/* Image Upload Pop-up */}
      {showUploadPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Report Found Pet</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={finderEmail} 
              onChange={(e) => setFinderEmail(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Your Phone" 
              value={finderPhone} 
              onChange={(e) => setFinderPhone(e.target.value)} 
              required 
            />
            <button onClick={handleUploadSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
          <button onClick={() => setShowUploadPopup(false)} className="close-btn">
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default LostPetsViewer;

import React, { useState, useEffect } from "react";
import lostPet from "./images/lostcat.jpg";
import "../../Styles/PostLost.css"; 
import LocationPicker from "./LocationPicker"; 

const PostLostPets = () => {
  const [name, setName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState(""); 
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setFormError(false);
    }
    // console.log(isSubmitting, name, petAge, lastSeenLocation)
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); //  Ensure user is logged in

    if (
      !name ||
      !petAge ||
      !lastSeenLocation || 
      !description ||
      !email ||
      !phone ||
      !picture ||
      type === "None"
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("petAge", petAge);
    formData.append("lastSeenLocation", lastSeenLocation); 
    formData.append("description", description);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("userId", userId);
    formData.append("type", type);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await fetch("http://localhost:4000/lostPets", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Lost pet report submitted successfully");

      setEmailError(false);
      setFormError(false);
      setName("");
      setPetAge("");
      setLastSeenLocation(""); 
      setDescription("");
      setEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="post-lost-pet-section">
      <h2>Post a Lost Pet</h2>
      <img src={lostPet} alt="Lost Pet Poster" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input type="text" value={petAge} onChange={(e) => setPetAge(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Picture:</label>
          <label className="file-input-label">
            <span className="file-input-text">{fileName || "Choose a Picture"}</span>
            <input className="file-input" type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        {/* Integrated Location Picker for Last Seen */}
        <div className="input-box">
          <label>Last Seen:</label>
          <LocationPicker setLastSeenLocation={setLastSeenLocation} /> 
        </div>

        <div className="filter-selection-service">
          <label>Type:</label>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="None">None</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Fish">Fish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-box">
          <label>Description:</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>

        <h3>Contact Information</h3>

        <div className="input-box">
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-box">
          <label>Ph.No:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {emailError && <p className="error-message">Please provide a valid email address.</p>}
        {formError && <p className="error-message">Please fill out all fields correctly.</p>}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Lost Pet"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Application Submitted! View your listing in the Find Tab!</h4>
            </div>
            <button onClick={togglePopup} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default PostLostPets;



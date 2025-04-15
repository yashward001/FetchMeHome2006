import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import "../../Styles/PostAdopt.css";
import LocationPicker from "./LocationPicker"; 

const PostAdoptPets = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState(""); 
  const [justification, setJustification] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [type, setType] = useState("None");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setAgeError(false);
      setFormError(false);
    }
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

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User is not logged in! Please log in first.");
      return;
    }

    if (
      !name ||
      !age ||
      !area || 
      !justification ||
      !email ||
      !phone ||
      !picture ||
      type === "None" ||
      ageError
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
    formData.append("age", age);
    formData.append("area", area); 
    formData.append("justification", justification);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("userId", userId);
    formData.append("type", type);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await fetch("http://localhost:4000/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Form submitted successfully");

      setEmailError(false);
      setFormError(false);
      setName("");
      setAge("");
      setArea(""); 
      setJustification("");
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
    <section className="post-pet-section">
      <h2>Post a Pet for Adoption</h2>
      <img src={postPet} alt="Pet Looking for a Home" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="input-box">
          <label>Pet Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter pet name"
          />
        </div>

        <div className="input-box">
          <label>Pet Age:</label>
          <input 
            type="text" 
            value={age} 
            onChange={(e) => setAge(e.target.value)}
            placeholder="E.g. 3 years, 6 months" 
          />
        </div>

        <div className="input-box">
          <label>Pet Photo:</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <span className="file-input-text">{fileName || "Choose a Picture"}</span>
              <input className="file-input" type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {fileName && <p className="selected-file">{fileName}</p>}
          </div>
        </div>

        {/* Integrated Location Picker for Area */}
        <div className="input-box">
          <label>Location:</label>
          <LocationPicker setLastSeenLocation={setArea} /> 
        </div>

        <div className="filter-selection-service">
          <label>Pet Type:</label>
          <select 
            value={type} 
            onChange={(event) => setType(event.target.value)}
          >
            <option value="None">Select pet type</option>
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
          <textarea 
            rows="4" 
            value={justification} 
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Describe your pet's personality, habits, and why you're putting them up for adoption"
          ></textarea>
        </div>

        <h3>Contact Information</h3>

        <div className="input-box">
          <label>Email:</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@gmail.com" 
          />
          {emailError && <p className="error-message">Please provide a valid Gmail address.</p>}
        </div>

        <div className="input-box">
          <label>Phone Number:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your contact number" 
          />
        </div>

        {formError && <p className="error-message">Please fill out all fields correctly.</p>}

        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Your Pet"}
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Pet Submitted Successfully!</h4>
              <p>Your pet has been posted for adoption. You can view your listing in the Adopt Tab.</p>
              <button onClick={togglePopup} className="close-btn">
                Close <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default PostAdoptPets;
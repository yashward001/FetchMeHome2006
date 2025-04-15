import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/SavedPets.css";

const SavedPets = () => {
  const [savedPets, setSavedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedPets = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/saved-pets", {
          headers: { Authorization: token }
        });
        setSavedPets(res.data.savedPets || []);
      } catch (err) {
        console.error("Error fetching saved pets:", err);
        setError("Failed to load your saved pets. Please try again later.");
      }
      setLoading(false);
    };

    fetchSavedPets();
  }, [token]);

  const removePet = async (petId) => {
    try {
      // Add your API endpoint to remove a pet
      await axios.delete(`http://localhost:4000/api/users/saved-pets/${petId}`, {
        headers: { Authorization: token }
      });
      
      // Update UI by filtering out the removed pet
      setSavedPets(savedPets.filter(pet => pet._id !== petId));
    } catch (err) {
      console.error("Error removing pet:", err);
      setError("Failed to remove pet. Please try again.");
    }
  };

  if (loading) return (
    <div className="saved-pets-loading">
      <div className="loading-spinner"></div>
      <p>Loading your saved pets...</p>
    </div>
  );

  if (error) return (
    <div className="saved-pets-error">
      <i className="fa fa-exclamation-circle"></i>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="saved-pets-container">
      <div className="saved-pets-header">
        <h1>Your Saved Pets</h1>
        <p>Pets you've saved for future consideration</p>
      </div>

      {savedPets.length === 0 ? (
        <div className="no-saved-pets">
          <i className="fa fa-heart-o"></i>
          <h3>No Saved Pets Yet</h3>
          <p>Pets you save will appear here. Browse available pets and click the heart icon to save pets you're interested in.</p>
          <a href="/pets" className="browse-pets-btn">Browse Available Pets</a>
        </div>
      ) : (
        <div className="saved-pets-grid">
          {savedPets.map((pet, index) => (
            <div key={index} className="saved-pet-card">
              <div className="saved-pet-image">
                {pet.image ? (
                  <img src={pet.image.url || pet.image} alt={pet.name} />
                ) : (
                  <div className="no-image">
                    <i className="fa fa-paw"></i>
                  </div>
                )}
              </div>
              <div className="saved-pet-content">
                <h3 className="saved-pet-name">{pet.name}</h3>
                <p className="saved-pet-species">{pet.species}</p>
                
                <div className="saved-pet-details">
                  <p className="saved-pet-temperament">
                    <strong>Temperament:</strong> {pet.temperament || "Not specified"}
                  </p>
                  <p className="saved-pet-lifespan">
                    <strong>Life Span:</strong> {pet.life_span || "Not specified"}
                  </p>
                </div>
                
                <div className="saved-pet-actions">
                  <button className="remove-pet-btn" onClick={() => removePet(pet._id)}>
                    <i className="fa fa-trash"></i> Remove
                  </button>
                  <a href="/pets" className="view-similar-btn">
                    <i className="fa fa-search"></i> Find Similar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPets;
import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedPets = () => {
  const [savedPets, setSavedPets] = useState([]);
  const [loading, setLoading] = useState(true);
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
      }
      setLoading(false);
    };

    fetchSavedPets();
  }, []);

  if (loading) return <p>Loading saved pets...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>❤️ Your Saved Pets ❤️</h1>
      {savedPets.length === 0 ? (
        <p>You haven’t saved any pets yet.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {savedPets.map((pet, index) => (
            <li key={index} style={{
              marginBottom: "25px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px"
            }}>
              <strong>{pet.name} ({pet.species})</strong><br />
              Temperament: {pet.temperament}<br />
              Life Span: {pet.life_span}<br />
              {pet.image ? (
                <img 
                  src={pet.image} 
                  alt={pet.name} 
                  style={{ width: "200px", marginTop: "10px", borderRadius: "8px" }} 
                />
              ) : (
                <span style={{ color: "#999" }}>No image available</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPets;

import React, { useEffect, useState } from "react";
import LostPetsViewer from "./LostPetsViewer"; // default viewer for regular users

// Use destructuring with default value (provide empty object default)
const LostPets = ({ viewerComponent: Viewer = LostPetsViewer } = {}) => {
  const [filter, setFilter] = useState("all");
  const [lostPetsData, setLostPetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        const response = await fetch("http://localhost:4000/lostPets");
        if (!response.ok) {
          throw new Error("An error occurred while fetching lost pets.");
        }
        const data = await response.json();
        setLostPetsData(data);
      } catch (error) {
        console.error("Error fetching lost pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLostPets();
  }, []);

  const filteredLostPets = lostPetsData.filter((pet) => {
    if (filter === "all") {
      return true;
    }
    return pet.type === filter;
  });

  return (
    <>
      <div className="filter-selection">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All Pets</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Rabbit">Rabbits</option>
          <option value="Bird">Birds</option>
          <option value="Fish">Fishes</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="pet-container">
        {loading ? (
          <p>Loading...</p>
        ) : filteredLostPets.length > 0 ? (
          filteredLostPets.map((petDetail, index) => (
            <Viewer pet={petDetail} key={index} />
          ))
        ) : (
          <p className="oops-msg">Oops!... No lost pets available</p>
        )}
      </div>
    </>
  );
};

export default LostPets;

import React, { useState, useEffect } from "react";
import PetsViewer from "./PetsViewer"; // default viewer for non-admin users

// Accept viewerComponent prop with default fallback to PetsViewer
const Pets = ({ viewerComponent: Viewer = PetsViewer } = {}) => {
  const [filter, setFilter] = useState("all");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:4000/adoptedPets");
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setPetsData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredPets = petsData.filter((pet) => {
    if (filter === "all") {
      return true;
    }
    return pet.type === filter;
  });

  return (
    <>
      <div className="filter-selection">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
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
          <p>Loading</p>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((petDetail, index) => (
            <Viewer pet={petDetail} key={index} />
          ))
        ) : (
          <p className="oops-msg">Oops!... No pets available</p>
        )}
      </div>
    </>
  );
};

export default Pets;

import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import "../../Styles/Pets.css";

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("grid");

  // Fetch pets data from API
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/adoptedPets');
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        const data = await response.json();
        setPetsData(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Filter and search pets
  const filteredPets = petsData.filter((pet) => {
    // Filter by pet type
    const typeMatch = filter === "all" || pet.type === filter;
    
    // Filter by search query
    const searchMatch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        pet.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  // Get unique pet types for dropdown
  const petTypes = [...new Set(petsData.map(pet => pet.type))];

  return (
    <div className="pets-page">
      <div className="pets-hero">
        <div className="pets-hero-content">
          <h1>Find Your Perfect Companion</h1>
          <p>Browse our available pets and discover the joy of adoption.</p>
        </div>
      </div>

      <div className="pets-container">
        <div className="pets-header">
          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name, type, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <i className="fa fa-search"></i>
              </span>
            </div>

            <div className="filter-container">
              <label htmlFor="pet-filter" className="filter-label">Filter by:</label>
              <select
                id="pet-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Pets</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}s
                  </option>
                ))}
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={`view-button ${activeView === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveView('grid')}
                aria-label="Grid view"
              >
                <i className="fa fa-th-large"></i>
              </button>
              <button
                className={`view-button ${activeView === 'list' ? 'active' : ''}`}
                onClick={() => setActiveView('list')}
                aria-label="List view"
              >
                <i className="fa fa-list"></i>
              </button>
            </div>
          </div>

          <div className="pets-counter">
            Showing <span className="counter-highlight">{filteredPets.length}</span> of <span className="counter-highlight">{petsData.length}</span> pets
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fetching adorable pets...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fa fa-exclamation-circle"></i>
            <p>Oops! Something went wrong while fetching pets.</p>
            <p className="error-details">{error}</p>
          </div>
        ) : filteredPets.length > 0 ? (
          <div className={`pets-grid ${activeView === 'list' ? 'list-view' : ''}`}>
            {filteredPets.map((pet) => (
              <PetsViewer pet={pet} key={pet._id} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fa fa-search"></i>
            </div>
            <h3>No pets found</h3>
            <p>
              We couldn't find any pets matching your search criteria.
              <br />
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
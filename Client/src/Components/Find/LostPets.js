import React, { useEffect, useState } from "react";
import LostPetsViewer from "./LostPetsViewer";
import "../../Styles/LostPets.css";

const LostPets = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lostPetsData, setLostPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapView, setMapView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch lost pets data
  useEffect(() => {
    const fetchLostPets = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/lostPets");
        if (!response.ok) {
          throw new Error("An error occurred while fetching lost pets.");
        }
        const data = await response.json();
        setLostPetsData(data);
      } catch (error) {
        console.error("Error fetching lost pets:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLostPets();
  }, []);

  // Filter and search functionality
  const filteredLostPets = lostPetsData.filter((pet) => {
    // Filter by pet type
    const typeMatch = filter === "all" || pet.type === filter;
    
    // Filter by search query
    const searchMatch = 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  // Get unique pet types
  const petTypes = [...new Set(lostPetsData.map(pet => pet.type))];

  return (
    <div className="lost-pets-page">
      <div className="lost-pets-hero">
        <div className="lost-pets-hero-content">
          <h1>Help Reunite Lost Pets</h1>
          <p>Browse listings of lost pets or report a pet you've found.</p>
          {isLoggedIn && (
            <a href="/services#lost" className="report-lost-pet-btn">
              Report a Lost Pet <i className="fa fa-paw"></i>
            </a>
          )}
        </div>
      </div>

      <div className="lost-pets-container">
        <div className="lost-pets-header">
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
              <label htmlFor="pet-filter" className="filter-label">Type:</label>
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
                className={`view-button ${!mapView ? 'active' : ''}`}
                onClick={() => setMapView(false)}
                aria-label="Grid view"
              >
                <i className="fa fa-th-large"></i>
              </button>
              <button
                className={`view-button ${mapView ? 'active' : ''}`}
                onClick={() => setMapView(true)}
                aria-label="Map view"
              >
                <i className="fa fa-map-marker"></i>
              </button>
            </div>
          </div>

          <div className="pets-counter">
            Showing <span className="counter-highlight">{filteredLostPets.length}</span> of <span className="counter-highlight">{lostPetsData.length}</span> lost pets
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fetching lost pet listings...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fa fa-exclamation-circle"></i>
            <p>Oops! Something went wrong while fetching lost pets.</p>
            <p className="error-details">{error}</p>
          </div>
        ) : filteredLostPets.length > 0 ? (
          <div className={`lost-pets-grid ${mapView ? 'map-view' : ''}`}>
            {!mapView ? (
              // Grid view
              filteredLostPets.map((pet) => (
                <LostPetsViewer pet={pet} key={pet._id} />
              ))
            ) : (
              // Map view placeholder
              <div className="map-view-container">
                <div className="map-placeholder">
                  <i className="fa fa-map-o"></i>
                  <p>Map view is coming soon!</p>
                  <p className="map-description">
                    This feature will allow you to see all lost pets on a map based on their last seen location.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fa fa-search"></i>
            </div>
            <h3>No lost pets found</h3>
            <p>
              We couldn't find any lost pets matching your search criteria.
              <br />
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>

      {/* User guidance section */}
      <div className="lost-pet-guidance">
        <div className="guidance-container">
          <div className="guidance-card">
            <div className="guidance-icon">
              <i className="fa fa-eye"></i>
            </div>
            <h3>Found a Pet?</h3>
            <p>
              If you've found a pet, please check the listings above to see if they match.
              You can upload a photo to help the owner identify their pet.
            </p>
          </div>
          
          <div className="guidance-card">
            <div className="guidance-icon">
              <i className="fa fa-camera"></i>
            </div>
            <h3>Take Clear Photos</h3>
            <p>
              When reporting a lost or found pet, upload clear photos showing distinguishing features
              to increase the chances of a successful reunion.
            </p>
          </div>
          
          <div className="guidance-card">
            <div className="guidance-icon">
              <i className="fa fa-phone"></i>
            </div>
            <h3>Contact Information</h3>
            <p>
              Ensure your contact information is up-to-date so that potential finders
              can reach you if they've spotted your lost pet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostPets;
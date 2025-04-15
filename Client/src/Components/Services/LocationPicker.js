import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../Styles/LocationPicker.css"; 

const LocationPicker = ({ setLastSeenLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [nearestLocation, setNearestLocation] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);

    // Function to initialize the map
    const initializeMap = () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        if (!mapContainerRef.current) return;

        // Create map centered on default location (Singapore)
        const map = L.map(mapContainerRef.current).setView([1.3521, 103.8198], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add Leaflet default icon path fix
        const defaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = defaultIcon;

        // Function to handle map clicks
        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            setSelectedLocation({ lat, lng });
            
            // Update or create marker
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }
            
            // Get address using reverse geocoding from OpenStreetMap
            fetchLocationName(lat, lng);
        });

        mapRef.current = map;
    };

    // Fetch location name from coordinates using OpenStreetMap Nominatim
    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                setNearestLocation(data.display_name);
                setLastSeenLocation(data.display_name);
            } else {
                setNearestLocation("Location selected, but address not found");
                setLastSeenLocation("Location selected");
            }
        } catch (error) {
            console.error("Error fetching location name:", error);
            setNearestLocation("Error getting location name");
            setLastSeenLocation("Location selected");
        }
    };

    // Open modal and initialize map
    const handleOpenPopup = () => {
        setShowPopup(true);
        setTimeout(initializeMap, 100);
    };

    // Close modal
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="location-picker-wrapper">
            <button 
                type="button" 
                onClick={handleOpenPopup} 
                className="location-picker-button"
            >
                <i className="fa fa-map-marker" style={{ marginRight: '8px' }}></i>
                Select Location
            </button>
            
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Select Location on Map</h2>
                        <p className="map-instruction">Click anywhere on the map to select a location</p>
                        <div
                            ref={mapContainerRef}
                            className="map-container"
                        ></div>
                        <div className="popup-actions">
                            <button onClick={handleClosePopup} className="confirm-button">
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <input
                type="text"
                value={nearestLocation}
                readOnly
                placeholder="Selected location will appear here"
                className="location-input"
            />
        </div>
    );
};

export default LocationPicker;
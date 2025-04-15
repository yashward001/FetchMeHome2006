import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../Styles/LocationPicker.css"; 

const API_KEY = process.env.API_KEY; 

const LocationPicker = ({ setLastSeenLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [nearestLocation, setNearestLocation] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null); // Ref for the map container

    // Function to initialize the map
    const initializeMap = () => {
        if (mapRef.current) {
            mapRef.current.remove(); // Destroy the existing map instance before reinitializing
            mapRef.current = null;
        }

        if (!mapContainerRef.current) return;

        const sw = L.latLng(1.144, 103.535);
        const ne = L.latLng(1.494, 104.502);
        const bounds = L.latLngBounds(sw, ne);

        const map = L.map(mapContainerRef.current, {
            center: L.latLng(1.2868108, 103.8545349),
            zoom: 16,
        });

        map.setMaxBounds(bounds);

        L.tileLayer(
            "https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png",
            {
                detectRetina: true,
                maxZoom: 19,
                minZoom: 11,
                attribution:
                    '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;' +
                    '<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;' +
                    '<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>',
            }
        ).addTo(map);

        // Function to fetch reverse geolocation data
        const fetchNearestLocation = async (lat, lng) => {
            try {
                const response = await fetch(
                    `https://www.onemap.gov.sg/api/public/revgeocode?location=${lat},${lng}&buffer=40&addressType=All&otherFeatures=N`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `${API_KEY}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.GeocodeInfo && data.GeocodeInfo.length > 0) {
                    const nearest = data.GeocodeInfo[0];
                    setNearestLocation(
                        `${nearest.BLOCK} ${nearest.ROAD}, ${nearest.BUILDINGNAME}, Postal: ${nearest.POSTALCODE}`
                    );
                    setLastSeenLocation(
                        `${nearest.BLOCK} ${nearest.ROAD}, ${nearest.BUILDINGNAME}, Postal: ${nearest.POSTALCODE}`
                    );
                } else {
                    setNearestLocation("No address found");
                    setLastSeenLocation("No address found");
                }
            } catch (error) {
                console.error("Error fetching reverse geolocation:", error);
            }
        };

        // Enable user to select geolocation
        map.on("click", function (e) {
            setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            fetchNearestLocation(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map; // Store reference to prevent re-init
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
        <div>
            <button onClick={handleOpenPopup}>Select Location</button>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Select Location on Map</h2>
                        <div
                            ref={mapContainerRef}
                            style={{ height: "400px", width: "100%" }}
                        ></div>
                        <button onClick={handleClosePopup}>Confirm</button>
                    </div>
                </div>
            )}
            <input
                type="text"
                value={nearestLocation}
                readOnly
                placeholder="Selected location will appear here"
                style={{ width: "100%", padding: "10px", marginTop: "10px" }}
            />
        </div>
    );
};

export default LocationPicker;






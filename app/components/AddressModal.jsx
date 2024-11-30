import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetunaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const MapUpdater = ({ position }) => {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
};

const AddressModal = () => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState([44.8, 20.47]);
  const [zoomLevel, setZoomLevel] = useState(13);

  // Fetch address suggestions from Nominatim
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );
      setSuggestions(
        response.data.map((result) => ({
          display_name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }))
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      if (response.data && response.data.display_name) {
        setAddress(response.data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    fetchSuggestions(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.display_name);
    setMarkerPosition([suggestion.lat, suggestion.lon]);
    setSuggestions([]);
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPosition([lat, lng]);
    fetchAddressFromCoordinates(lat, lng);
  };

  const getIconSize = (zoom) => {
    const baseSize = 20;
    return zoom >= 13 ? baseSize * 1.5 : baseSize;
  };

  const CustomMarkerIcon = L.icon({
    iconUrl: markerIcon.src,
    iconRetunaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
    iconSize: [
      getIconSize(zoomLevel) - getIconSize(zoomLevel) / 3,
      getIconSize(zoomLevel),
    ],
    iconAnchor: [getIconSize(zoomLevel) / 2, getIconSize(zoomLevel)],
    shadowAnchor: [14, 35],
  });

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center block">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Where are you located?</h2>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Address Autocomplete */}
          <div className="mb-4">
            <input
              type="text"
              value={address}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              placeholder="Search for your address..."
            />
            {suggestions.length > 0 && (
              <ul className="border rounded-md mt-2 bg-white shadow-md max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden">
            <MapContainer
              center={markerPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) =>
                map.on("zoomend", () => setZoomLevel(map.getZoom()))
              }
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker
                position={markerPosition}
                icon={CustomMarkerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              >
                <Popup>Selected Location</Popup>
              </Marker>
              <MapUpdater position={markerPosition} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

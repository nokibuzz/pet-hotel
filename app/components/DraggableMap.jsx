"use client";

import React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetunaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

// A helper component to dynamically update the map's view
const MapUpdater = ({ position }) => {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
};

const DraggableMap = ({ center, onMarkerDragEnd, zoomLevel, setZoomLevel }) => {
  const getIconSize = (zoom) => {
    const baseSize = 21;
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

  // temp solution if center is not populated
  if (!center || center?.length == 0) {
    center = [44.802, 20.466];
  }

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      // scrollWheelZoom={false}
      className="h-[40vh] rounded-lg"
      whenCreated={(map) =>
        map.on("zoomend", () => setZoomLevel(map.getZoom()))
      }
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && (
        <Marker
          position={center}
          icon={CustomMarkerIcon}
          draggable={true}
          eventHandlers={{
            dragend: onMarkerDragEnd,
          }}
        >
          <Popup>
            Selected Location: {center[0]}, {center[1]}
          </Popup>
          <MapUpdater position={center} />
        </Marker>
      )}
    </MapContainer>
  );
};

export default DraggableMap;

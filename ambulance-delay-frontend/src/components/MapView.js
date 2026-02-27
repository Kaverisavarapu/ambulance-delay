
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

/* ICONS */
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448513.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const emergencyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

/* MAP CLICK HANDLER */
function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

/* LEAFLET RESIZE */
function ResizeFix() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

/* VIEW TO EMERGENCY + HOSPITALS */

function FitToEntities({ location, hospitals, hasRoute }) {
  const map = useMap();

  useEffect(() => {
    if (!location || hasRoute || hospitals.length === 0) return;

    const bounds = L.latLngBounds([]);

    bounds.extend([location.lat, location.lng]);

    hospitals.forEach((h) => {
      bounds.extend([h.lat, h.lon]);
    });

    map.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 14,
    });
  }, [location, hospitals, hasRoute, map]);

  return null;
}

/* ZOOM TO ROUTE FOR NAVIGATE NOW */
function ZoomToRoute({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.length < 2) return;

    const bounds = L.latLngBounds(route);
    map.flyToBounds(bounds, {
      padding: [80, 80],
      duration: 1.2,
    });
  }, [route, map]);

  return null;
}

/* MAIN MAP VIEW */
export default function MapView({
  location,
  setLocation,
  hospitals,
  recommended,
  navigateRoute
}) {
  let route = null;

  // Build route after prediction
  if (location && recommended && recommended.eta_minutes !== -1) {
    const hospital = hospitals.find(
      (h) => h.name === recommended.hospital_name
    );

    if (hospital) {
      route = [
        [location.lat, location.lng],
        [hospital.lat, hospital.lon],
      ];
    }
  }

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <ResizeFix />

      <ZoomToRoute route={navigateRoute} />

      <FitToEntities
        location={location}
        hospitals={hospitals}
        hasRoute={!!navigateRoute}
      />

      <LocationMarker setLocation={setLocation} />

      {/* Emergency marker */}
      {location && (
        <Marker position={location} icon={emergencyIcon}>
          <Popup>🚨 Emergency Location</Popup>
        </Marker>
      )}

      {/* Hospital markers */}
      {hospitals.map((h) => (
        <Marker
          key={h.hospital_id}
          position={[h.lat, h.lon]}
          icon={hospitalIcon}
        >
          <Popup>
            <b>{h.name}</b>
            {recommended && recommended.hospital_name === h.name && (
              <div style={{ color: "green", fontWeight: "bold", marginTop: 5 }}>
                ✔ Recommended Hospital
              </div>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Route line */}
      {route && (
        <>
          <Polyline
            positions={route}
            pathOptions={{
              color: "#00d4ff",
              weight: 10,
              opacity: 0.3,
            }}
          />
          <Polyline
            positions={route}
            pathOptions={{
              color: "#00eaff",
              weight: 4,
            }}
          />
        </>
      )}
    </MapContainer>
  );
}
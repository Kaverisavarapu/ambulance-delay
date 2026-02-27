
import { useState, useEffect } from "react";
import "./App.css";
import MapView from "./components/MapView";
import ControlPanel from "./components/ControlPanel";
import ResultPanel from "./components/ResultPanel";
import { fetchHospitals, recommendHospital } from "./api";
import SearchBar from "./components/SearchBar";

function App() {
  const [location, setLocation] = useState(null);
  const [hour, setHour] = useState(new Date().getHours());
  const [result, setResult] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [resetView, setResetView] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [navigateRoute, setNavigateRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6 ? 1 : 0;
  };

  // Load hospitals once on app start
  useEffect(() => {
    fetchHospitals().then(setHospitals);
  }, []);

  useEffect(() => {
    if (!location) return;

    setResult(null);
    setNavigateRoute(null);
    setResetView(true);
  }, [location]);

  const handleSubmit = async () => {
    if (!location) {
      alert("Please select emergency location on map");
      return;
    }

    setLoading(true);

    try {
      const request = {
        lat: location.lat,
        lon: location.lng,
        hour: parseInt(hour),
        is_weekend: isWeekend()
      };

      const res = await recommendHospital(request);
      setResult(res);
      setResetSearch(true);
      setNavigateRoute(null);
    } catch (err) {
      alert("Backend is warming up. Please try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };


  // Navigate Now handler
  const handleNavigate = () => {
    if (!location || !result) return;

    const hospital = hospitals.find(
      (h) => h.name === result.hospital_name
    );

    if (!hospital) return;

    setNavigateRoute([
      [location.lat, location.lng],
      [hospital.lat, hospital.lon],
    ]);
  };

  return (
    <div className="app-root">
      {/* MAP (constrained by layout CSS) */}
      <div className="map-wrapper">
        <MapView
          location={location}
          setLocation={setLocation}
          hospitals={hospitals}
          recommended={result}
          navigateRoute={navigateRoute}  
          resetView={resetView}
          onResetComplete={() => setResetView(false)} 
        />
      </div>

      {/* TOP HEADER */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="top-title">
            <div className="brand-name">MedRoute</div>
            <div className="brand-subtitle">
              Smart Emergency Response Assistant
            </div>
          </div>

          <div className="top-controls">
            <SearchBar 
            onSelectLocation={setLocation}
            reset={resetSearch}
            onResetComplete={() => setResetSearch(false)}
            />
            <ControlPanel
              hour={hour}
              setHour={setHour}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <ResultPanel
          result={result}
          onNavigate={handleNavigate}   
        />
      </div>
    </div>
  );
}

export default App;
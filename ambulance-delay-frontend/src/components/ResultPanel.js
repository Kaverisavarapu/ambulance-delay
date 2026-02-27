
export default function ResultPanel({ result, onNavigate }) {
  if (!result) {
    return (
      <div className="sidebar-placeholder">
        <div className="sidebar-section-title">
          Recommended Hospital
        </div>
        <p className="sidebar-muted">
          Select a location using the search bar or click directly on the map.
        </p>
        <p className="sidebar-muted">
          Markers on the map represent nearby hospitals.
          <br></br>
          The first request may take a few seconds as the service initializes.
        </p>
      </div>
    );
  }

  if (result.eta_minutes === -1) {
    return (
      <div>
        <div className="sidebar-section-title">
          Out of Supported Region
        </div>
        <p className="sidebar-muted">
          This model is trained only for Bengaluru city.
        </p>
      </div>
    );
  }

  const trafficSeverity = Math.min(
    Math.round((result.predicted_delay / 60) * 100),
    100
  );

  let trafficLabel = "Low Traffic Impact";
  if (trafficSeverity >= 60) trafficLabel = "High Traffic Impact";
  else if (trafficSeverity >= 30) trafficLabel = "Moderate Traffic Impact";

  return (
    <div>
      {/* Header */}
      <div className="sidebar-section-title">
        Recommended Hospital
      </div>

      {/* Hospital Name */}
      <h2 className="hospital-name">
        {result.hospital_name}
      </h2>

      {/* Distance */}
      <p className="hospital-distance">
        <span className="dot" /> {result.distance_km} km away
      </p>

      {/* ETA — PRIMARY METRIC */}
      <div className="eta-card">
        <div className="eta-label">Estimated Arrival Time</div>
        <div className="eta-value">
          {result.eta_minutes} mins
        </div>
      </div>

      {/* Predicted Delay — SUPPORTING METRIC */}
      <div className="delay-card">
        <div className="delay-label">Includes Traffic Delay</div>
        <div className="delay-value">
          {result.predicted_delay} mins
        </div>
        <div className="delay-impact">
          {trafficLabel}
        </div>
      </div>

      {/* Traffic Severity Bar */}
      <div className="severity-section">
        <div className="severity-label">
          Relative Traffic Severity — <b>{trafficSeverity}% congestion</b>
        </div>
        <div className="severity-bar">
          <div
            className="severity-fill"
            style={{ width: `${trafficSeverity}%` }}
          />
        </div>
      </div>

      {/* Navigate Button */}
      <button className="navigate-btn" onClick={onNavigate}>
        Navigate Now →
      </button>

      {/* Disclaimer */}
      <p className="sidebar-disclaimer">
        Traffic conditions, delays, and ETAs shown here are <b>simulated estimates</b> 
         based on historical patterns and time-of-day assumptions.
        This system does not use real-time traffic data.
      </p>
    </div>
  );
}
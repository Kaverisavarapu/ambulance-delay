
import { useState, useRef, useEffect } from "react";

export default function SearchBar({ onSelectLocation, reset, onResetComplete }) {
  useEffect(() => {
    if (!reset) return;

    setQuery("");
    setResults([]);

    onResetComplete();
  }, [reset, onResetComplete]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  const normalizeQuery = (value) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  };

  const searchAddress = async (value) => {
    setQuery(value);

    const normalized = normalizeQuery(value);

    if (normalized.length < 3) {
      setResults([]);
      return;
    }

    // debounce requests
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(normalized)}`;

        const res = await fetch(url, {
          headers: {
            "Accept": "application/json",
          },
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.warn("Search failed:", err.message);
        setResults([]);
      }
    }, 400);
  };

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    onSelectLocation({ lat, lng: lon });

    setQuery(place.display_name);
    setResults([]);
  };

  return (
    <div style={{
    position: "relative",
    width: "400px",
    display: "flex",
    alignItems: "center"
    }}>
      <input
        type="text"
        placeholder="Search location (e.g., Indiranagar)"
        value={query}
        onChange={(e) => searchAddress(e.target.value)}
        style={{
          width: "420px",
          padding: "10px 12px",
          borderRadius: "10px",
          background: "#0b1020",
          color: "#ffffff",
          border: "1px solid rgba(80,120,255,0.6)",
          fontSize: "14px",
        }}
      />

      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "48px",
            width: "100%",
            background: "#0f1629",
            listStyle: "none",
            padding: 0,
            margin: 0,
            borderRadius: "8px",
            maxHeight: "220px",
            overflowY: "auto",
            zIndex: 2000,
          }}
        >
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#eaf0ff",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
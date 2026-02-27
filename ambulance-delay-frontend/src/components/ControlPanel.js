
export default function ControlPanel({ hour, setHour, loading, onSubmit }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      paddingLeft: "6px"
    }}>
      <input
        placeholder = "Time..."
        type="number"
        min="0"
        max="23"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        style={{
          width: "70px",
          background: "#0b1020",
          color: "#fff",
          border: "1px solid #2b3cff",
          borderRadius: "6px",
          padding: "8px",
          textAlign: "center"
        }}
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #2b3cff, #00d4ff)",
          border: "none",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "Loading model…" : "Predict"}
      </button>
    </div>
  );
}
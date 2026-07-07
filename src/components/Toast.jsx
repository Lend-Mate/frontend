export default function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 50,
      fontSize: 13, fontWeight: 600, zIndex: 99, display: "flex", alignItems: "center", gap: 8
    }}>
      <span style={{ color: "#4CAF50" }}>✓</span> {msg}
    </div>
  )
}
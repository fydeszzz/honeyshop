import { useState } from "react";
import { ACHIEVEMENTS } from "../constants";

export default function DevPanel({ showAchievement, showToast, setS }) {
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  const cheatCurrency = (amount) =>
    setS(prev => ({ ...prev, currency: prev.currency + amount }));
  const cheatBagels = (amount) =>
    setS(prev => ({ ...prev, bagels: prev.bagels + amount }));
  const cheatStreak = (n) =>
    setS(prev => ({ ...prev, streak: n }));
  const resetAchievements = () =>
    setS(prev => ({ ...prev, achievements: [] }));

  const btn = (label, onClick, col = "#555") => (
    <button
      key={label}
      onClick={onClick}
      style={{
        background: col, color: "#fff", border: "none",
        borderRadius: 8, padding: "5px 10px", fontSize: 11,
        fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 90, right: 8, zIndex: 19999,
          background: open ? "#333" : "#FF6BAD",
          color: "#fff", border: "none", borderRadius: 10,
          padding: "5px 9px", fontSize: 11, fontWeight: 900,
          cursor: "pointer", fontFamily: "'Nunito',sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          opacity: 0.85,
        }}
      >
        {open ? "✕ DEV" : "🛠 DEV"}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 120, right: 8, zIndex: 19998,
          width: 240, maxHeight: "60vh", overflowY: "auto",
          background: "rgba(20,20,20,0.95)",
          borderRadius: 14, padding: "12px 12px 8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          fontFamily: "'Nunito',sans-serif",
        }}>
          {/* Cheat section */}
          <div style={{ color: "#aaa", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
            Cheats
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {btn("+500 🍯", () => cheatCurrency(500), "#B07000")}
            {btn("+5 🥯",  () => cheatBagels(5),     "#804000")}
            {btn("streak 7", () => cheatStreak(7),    "#E05000")}
            {btn("streak 3", () => cheatStreak(3),    "#E05000")}
            {btn("reset ach", resetAchievements,       "#880000")}
          </div>

          {/* Achievement fire section */}
          <div style={{ color: "#aaa", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
            Fire Achievement Toast
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {ACHIEVEMENTS.map(a => (
              <button
                key={a.id}
                onClick={() => showAchievement(a)}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "none", borderRadius: 8,
                  padding: "6px 10px",
                  display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                <div>
                  <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>
                    {a.name}
                  </div>
                  <div style={{ color: "#888", fontSize: 10, fontFamily: "'Nunito',sans-serif" }}>
                    {a.reward?.type
                      ? `${a.reward.type} x${a.reward.amount}`
                      : a.reward?.rarity}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

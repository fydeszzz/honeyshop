import { RARITY } from "../constants";

export default function AchievementToast({ achievement }) {
  if (!achievement) return null;

  const reward = achievement.reward;
  const isCurrency = reward?.type === "honeypot" || reward?.type === "bagel";
  const isItem = reward && !isCurrency;

  const rarityStyle = isItem ? (RARITY[reward.rarity] || RARITY.Common) : null;

  return (
    <div style={{
      position: "fixed",
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(370px, 92vw)",
      zIndex: 10000,
      animation: "achSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
      pointerEvents: "none",
    }}>
      <div style={{
        background: "linear-gradient(135deg,#fff9e6 0%,#fff3cc 40%,#ffe8a0 100%)",
        borderRadius: 20,
        padding: "13px 16px",
        display: "flex",
        alignItems: "center",
        gap: 13,
        boxShadow: "0 8px 32px rgba(200,140,0,0.28), 0 2px 8px rgba(0,0,0,0.10)",
        border: "1.5px solid rgba(255,200,60,0.55)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Shimmer strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg,#FFD060,#FF9B30,#FFD060)",
          backgroundSize: "200% 100%",
          animation: "achShimmer 1.5s linear infinite",
        }}/>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: label */}
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.1,
            color: "#B07000", textTransform: "uppercase",
            fontFamily: "'Nunito',sans-serif", marginBottom: 2,
          }}>
            🏅 Achievement Unlocked
          </div>

          {/* Row 2: name */}
          <div style={{
            fontSize: 17, fontWeight: 900, color: "#5A3000",
            fontFamily: "'Nunito',sans-serif", lineHeight: 1.2,
            marginBottom: 3, wordBreak: "break-word",
          }}>
            {achievement.name}
          </div>

          {/* Row 3: description */}
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#9A6020",
            fontFamily: "'Nunito',sans-serif",
            lineHeight: 1.45, wordBreak: "break-word",
          }}>
            {achievement.desc}
          </div>
        </div>

        {/* Reward slot */}
        {reward && (
          <div style={{
            flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            {/* Image box */}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: isItem ? rarityStyle.bg : "#FFF8DC",
              border: `1.5px solid ${isItem ? rarityStyle.border : "#FFB830"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <img
                src={reward.icon}
                alt={isCurrency ? reward.type : (reward.name || "reward")}
                style={{width:"80%",height:"80%",objectFit:"contain"}}
              />
            </div>

            {/* Label: rarity name (item) or "xAmount" (currency) */}
            {isCurrency ? (
              <div style={{
                fontSize: 13, fontWeight: 900,
                color: "#5A3000",        /* 同成就名稱色 */
                fontFamily: "'Nunito',sans-serif",
                letterSpacing: 0.3,
              }}>
                x{reward.amount}
              </div>
            ) : (
              <div style={{
                fontSize: 9, fontWeight: 800,
                color: rarityStyle.col,
                fontFamily: "'Nunito',sans-serif",
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {reward.rarity}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

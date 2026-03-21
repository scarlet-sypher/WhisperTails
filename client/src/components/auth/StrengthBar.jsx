import React from "react";

const levels = { weak: 1, medium: 2, strong: 3 };
const colors = { weak: "#f87171", medium: "#fbbf24", strong: "#4ade80" };
const labels = { weak: "Weak", medium: "Fair", strong: "Strong" };

const StrengthBar = ({ strength }) => {
  if (!strength) return null;
  const active = levels[strength];
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}
    >
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            background:
              n <= active ? colors[strength] : "rgba(255,255,255,0.1)",
            transition: "background 0.35s ease",
          }}
        />
      ))}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          minWidth: 38,
          textAlign: "right",
          color: colors[strength],
        }}
      >
        {labels[strength]}
      </span>
    </div>
  );
};

export default StrengthBar;

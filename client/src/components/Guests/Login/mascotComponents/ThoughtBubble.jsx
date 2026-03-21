import React from "react";

const ThoughtBubble = ({ msg, visible, accent, state }) => {
  const isSuccess = state === "success" || state === "passwordStrong";
  const isError = state === "error" || state === "wrongPassword";
  const isFast = state === "fastTyping" || state === "cursorChaos";
  const isPassOpen = state === "passwordOpen";
  const isBack = state === "backHover";
  const isSleep = state === "sleepy";
  const isWeak = state === "passwordWeak";
  const isMedium = state === "passwordMedium";

  const borderColor = isSuccess
    ? "rgba(34,197,94,0.55)"
    : isError
      ? "rgba(239,68,68,0.55)"
      : isFast
        ? "rgba(251,191,36,0.5)"
        : isPassOpen
          ? "rgba(168,85,247,0.5)"
          : isBack
            ? "rgba(239,68,68,0.4)"
            : isSleep
              ? "rgba(148,163,184,0.35)"
              : isWeak
                ? "rgba(239,68,68,0.38)"
                : isMedium
                  ? "rgba(251,191,36,0.42)"
                  : accent?.ring || "rgba(99,179,237,0.44)";

  const glowColor = isSuccess
    ? "rgba(34,197,94,0.13)"
    : isError
      ? "rgba(239,68,68,0.13)"
      : isFast
        ? "rgba(251,191,36,0.11)"
        : isPassOpen
          ? "rgba(168,85,247,0.11)"
          : isBack
            ? "rgba(239,68,68,0.09)"
            : isWeak
              ? "rgba(239,68,68,0.09)"
              : isMedium
                ? "rgba(251,191,36,0.09)"
                : accent?.glow || "rgba(99,179,237,0.09)";

  const textColor = isSuccess
    ? "#4ade80"
    : isError
      ? "#f87171"
      : isFast
        ? "#fbbf24"
        : isPassOpen
          ? "#c084fc"
          : isBack
            ? "#fca5a5"
            : isSleep
              ? "rgba(148,163,184,0.7)"
              : isWeak
                ? "#fca5a5"
                : isMedium
                  ? "#fde68a"
                  : "#e2e8f0";

  const dots = [
    { sz: 6, b: -7, l: "47%" },
    { sz: 4, b: -14, l: "44%" },
    { sz: 3, b: -20, l: "41%" },
  ];

  return (
    <div
      style={{
        width: 250,
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(10px) scale(0.93)",
        transition:
          "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.3,0.64,1)",
      }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: d.b,
            left: d.l,
            width: d.sz,
            height: d.sz,
            borderRadius: "50%",
            background: borderColor,
            opacity: 0.72 - i * 0.18,
            transition: "background 0.4s ease",
          }}
        />
      ))}
      <div
        style={{
          background: "rgba(12,20,44,0.88)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: `1px solid ${borderColor}`,
          borderRadius: 22,
          padding: "16px 22px",
          boxShadow: `0 10px 40px rgba(0,0,0,0.25), 0 0 28px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.07)`,
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "18%",
            right: "18%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
            opacity: 0.42,
          }}
        />
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: textColor,
            letterSpacing: 0.15,
            lineHeight: 1.45,
            fontFamily: "'Quicksand', sans-serif",
            transition: "color 0.3s ease",
            textAlign: "center",
          }}
        >
          {msg.text}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(148,163,184,0.52)",
            marginTop: 5,
            letterSpacing: 0.4,
            textAlign: "center",
          }}
        >
          {msg.sub}
        </div>
      </div>
    </div>
  );
};

export default ThoughtBubble;

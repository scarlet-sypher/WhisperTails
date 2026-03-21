import React, { useState, useEffect, useRef } from "react";

const ZzzBubble = ({ show }) => {
  const [items, setItems] = useState([]);
  const timerRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!show) {
      setItems([]);
      clearTimeout(timerRef.current);
      return;
    }
    const spawnZ = () => {
      const id = idRef.current++;
      setItems((prev) => [
        ...prev.slice(-3),
        {
          id,
          size: 10 + Math.random() * 8,
          x: 125 + (Math.random() - 0.5) * 30,
        },
      ]);
      timerRef.current = setTimeout(spawnZ, 900 + Math.random() * 400);
    };
    timerRef.current = setTimeout(spawnZ, 200);
    return () => clearTimeout(timerRef.current);
  }, [show]);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setTimeout(() => setItems((prev) => prev.slice(1)), 1800);
    return () => clearTimeout(t);
  }, [items]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {items.map((z) => (
        <div
          key={z.id}
          style={{
            position: "absolute",
            left: z.x,
            top: 20,
            fontSize: z.size,
            fontWeight: 900,
            color: "rgba(148,163,184,0.85)",
            fontFamily: "'Quicksand', sans-serif",
            animation: "zzzFloat 1.8s ease forwards",
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          Z
        </div>
      ))}
    </div>
  );
};

const PetMascot = ({
  state,
  eyeOffset,
  mouthPhase,
  eyelidAmount,
  showQuestion,
  isSleeping,
}) => {
  const isHiding = state === "password";
  const isSad =
    state === "error" || state === "wrongPassword" || state === "backHover";
  const isHappy = state === "success" || state === "passwordStrong";
  const isConfused = state === "emptyEmail" || state === "confused";
  const isDetective = state === "invalidEmail";
  const isFast = state === "fastTyping" || state === "cursorChaos";
  const isChaos = state === "cursorChaos";
  const isWeak = state === "passwordWeak";
  const isSleepMode = isSleeping || state === "sleepy";

  const { x: ex, y: ey } = eyeOffset;
  const lid = Math.max(0, Math.min(1, eyelidAmount));
  const eyeOpen = 1 - lid;
  const eyeRY = Math.max(0.5, 13 * eyeOpen);
  const eyeCY = isSad ? 78 : isHappy ? 73 : 76;

  const mouthY = isSleepMode
    ? 122 + mouthPhase * 5
    : isHappy
      ? 128
      : isSad
        ? 108
        : 122;
  const mouthCurve = isHappy
    ? "M64,110 Q80,128 96,110"
    : isSad
      ? "M65,118 Q80,108 95,118"
      : isWeak
        ? "M66,116 Q80,110 94,116"
        : isSleepMode
          ? `M70,113 Q80,${mouthY} 90,113`
          : isFast
            ? "M66,112 Q80,128 94,112"
            : "M70,113 Q80,122 90,113";

  const earTransform = (side, cx) => {
    const base =
      side === "left"
        ? isConfused
          ? "rotate(-22,37,40)"
          : isSad
            ? "rotate(-10,40,40)"
            : isWeak
              ? "rotate(-8,40,40)"
              : "rotate(-14,40,40)"
        : isConfused
          ? "rotate(6,124,40)"
          : isSad
            ? "rotate(10,120,40)"
            : isWeak
              ? "rotate(8,120,40)"
              : "rotate(14,120,40)";
    return base;
  };

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      {isSleepMode && <ZzzBubble show={mouthPhase > 0.5} />}

      <svg
        viewBox="0 0 160 165"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          filter:
            "drop-shadow(0 18px 50px rgba(0,0,0,0.22)) drop-shadow(0 4px 12px rgba(0,0,0,0.14))",
        }}
      >
        <defs>
          <clipPath id="lcl">
            <ellipse cx="60" cy={eyeCY} rx="14" ry="13" />
          </clipPath>
          <clipPath id="rcl">
            <ellipse cx="100" cy={eyeCY} rx="14" ry="13" />
          </clipPath>
        </defs>

        <ellipse cx="80" cy="158" rx="40" ry="10" fill="rgba(0,0,0,0.1)" />

        {/* ears */}
        <ellipse
          cx={isConfused ? 37 : 40}
          cy="40"
          rx="19"
          ry="25"
          fill={isHappy ? "#c9703a" : "#bf7535"}
          transform={earTransform("left")}
          style={{ transition: "all 0.4s ease" }}
        />
        <ellipse
          cx={isConfused ? 124 : 120}
          cy="40"
          rx="19"
          ry="25"
          fill={isHappy ? "#c9703a" : "#bf7535"}
          transform={earTransform("right")}
          style={{ transition: "all 0.4s ease" }}
        />
        <ellipse
          cx={isConfused ? 37 : 40}
          cy="40"
          rx="11"
          ry="17"
          fill="#e8956b"
          transform={earTransform("left")}
          style={{ transition: "all 0.4s ease" }}
        />
        <ellipse
          cx={isConfused ? 124 : 120}
          cy="40"
          rx="11"
          ry="17"
          fill="#e8956b"
          transform={earTransform("right")}
          style={{ transition: "all 0.4s ease" }}
        />

        <ellipse cx="80" cy="93" rx="54" ry="52" fill="#d4894a" />
        <ellipse cx="80" cy="107" rx="34" ry="30" fill="#e8a96e" />

        {state === "passwordStrong" && (
          <ellipse
            cx="80"
            cy="93"
            rx="57"
            ry="55"
            fill="none"
            stroke="rgba(34,197,94,0.35)"
            strokeWidth="2.5"
            style={{ animation: "sparkleCircle 0.8s ease infinite alternate" }}
          />
        )}

        {!isHiding && (
          <>
            <ellipse
              cx="60"
              cy={eyeCY}
              rx="14"
              ry={eyeRY}
              fill="white"
              style={{ transition: "ry 0.14s ease, cy 0.25s ease" }}
            />
            <ellipse
              cx="100"
              cy={eyeCY}
              rx="14"
              ry={eyeRY}
              fill="white"
              style={{ transition: "ry 0.14s ease, cy 0.25s ease" }}
            />

            {eyeOpen > 0.15 && (
              <>
                <g clipPath="url(#lcl)">
                  <circle cx={60 + ex} cy={eyeCY + ey} r="7.5" fill="#281808" />
                  <circle
                    cx={60 + ex}
                    cy={eyeCY + ey}
                    r="7.5"
                    fill="none"
                    stroke="#5a3820"
                    strokeWidth="1.5"
                    opacity="0.45"
                  />
                  <circle
                    cx={57 + ex * 0.55}
                    cy={eyeCY - 3 + ey * 0.55}
                    r="3"
                    fill="white"
                  />
                  <circle
                    cx={62 + ex * 0.5}
                    cy={eyeCY + 2 + ey * 0.5}
                    r="1.2"
                    fill="white"
                    opacity="0.6"
                  />
                </g>
                <g clipPath="url(#rcl)">
                  <circle
                    cx={100 + ex}
                    cy={eyeCY + ey}
                    r="7.5"
                    fill="#281808"
                  />
                  <circle
                    cx={100 + ex}
                    cy={eyeCY + ey}
                    r="7.5"
                    fill="none"
                    stroke="#5a3820"
                    strokeWidth="1.5"
                    opacity="0.45"
                  />
                  <circle
                    cx={97 + ex * 0.55}
                    cy={eyeCY - 3 + ey * 0.55}
                    r="3"
                    fill="white"
                  />
                  <circle
                    cx={102 + ex * 0.5}
                    cy={eyeCY + 2 + ey * 0.5}
                    r="1.2"
                    fill="white"
                    opacity="0.6"
                  />
                </g>
              </>
            )}

            {lid >= 0.85 && (
              <>
                <path
                  d={`M46,${eyeCY} Q60,${eyeCY + 8} 74,${eyeCY}`}
                  stroke="#281808"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M86,${eyeCY} Q100,${eyeCY + 8} 114,${eyeCY}`}
                  stroke="#281808"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}
            {lid > 0.05 && lid < 0.85 && (
              <>
                <ellipse
                  cx="60"
                  cy={eyeCY - eyeRY * 0.6}
                  rx="14.5"
                  ry={13 * lid * 1.15}
                  fill="#d4894a"
                  style={{ transition: "all 0.14s ease" }}
                />
                <ellipse
                  cx="100"
                  cy={eyeCY - eyeRY * 0.6}
                  rx="14.5"
                  ry={13 * lid * 1.15}
                  fill="#d4894a"
                  style={{ transition: "all 0.14s ease" }}
                />
              </>
            )}

            {isDetective && (
              <>
                <rect
                  x="47"
                  y={eyeCY - 16}
                  width="23"
                  height="3.5"
                  rx="1.8"
                  fill="#281808"
                  opacity="0.8"
                />
                <rect
                  x="88"
                  y={eyeCY - 16}
                  width="23"
                  height="3.5"
                  rx="1.8"
                  fill="#281808"
                  opacity="0.8"
                />
              </>
            )}
          </>
        )}

        {isHiding && (
          <>
            <ellipse cx="57" cy="80" rx="22" ry="17" fill="#bf7535" />
            <ellipse cx="57" cy="80" rx="16" ry="12" fill="#c97d3a" />
            {[47, 54, 61, 68].map((x, i) => (
              <ellipse
                key={i}
                cx={x}
                cy="89"
                rx="4.5"
                ry="3.5"
                fill="#a06028"
              />
            ))}
            <ellipse cx="103" cy="80" rx="22" ry="17" fill="#bf7535" />
            <ellipse cx="103" cy="80" rx="16" ry="12" fill="#c97d3a" />
            {[93, 100, 107, 114].map((x, i) => (
              <ellipse
                key={i}
                cx={x}
                cy="89"
                rx="4.5"
                ry="3.5"
                fill="#a06028"
              />
            ))}
          </>
        )}

        {isSad && !isHiding && (
          <>
            <path
              d="M46,65 Q59,59 67,63"
              stroke="#281808"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M92,63 Q101,59 114,65"
              stroke="#281808"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {isConfused && !isHiding && (
          <>
            <path
              d="M46,64 Q55,68 67,63"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M92,62 Q105,57 115,64"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {isWeak && !isHiding && (
          <>
            <path
              d="M47,63 Q57,67 67,64"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M92,64 Q103,60 114,63"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {isFast && !isHiding && (
          <>
            <path
              d="M47,61 Q60,54 69,61"
              stroke="#281808"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M91,61 Q100,54 113,61"
              stroke="#281808"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {isHappy && !isHiding && (
          <>
            <path
              d="M48,63 Q60,58 68,62"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M91,62 Q101,58 113,63"
              stroke="#281808"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        <ellipse cx="80" cy="103" rx="11" ry="8" fill="#281808" />
        <ellipse
          cx="77"
          cy="101"
          rx="3.5"
          ry="2.5"
          fill="#4a2810"
          opacity="0.4"
        />

        <path
          d={mouthCurve}
          stroke="#281808"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
          style={{ transition: "d 0.35s ease" }}
        />

        <ellipse
          cx="48"
          cy="110"
          rx="13"
          ry="9"
          fill="#e8726b"
          opacity={isSad ? 0.48 : isHappy ? 0.38 : 0.25}
          style={{ transition: "opacity 0.3s ease" }}
        />
        <ellipse
          cx="112"
          cy="110"
          rx="13"
          ry="9"
          fill="#e8726b"
          opacity={isSad ? 0.48 : isHappy ? 0.38 : 0.25}
          style={{ transition: "opacity 0.3s ease" }}
        />

        {isSad && !isHiding && (
          <>
            <ellipse
              cx="51"
              cy="95"
              rx="3.5"
              ry="6"
              fill="#60b0ff"
              opacity="0.72"
            />
            <ellipse
              cx="109"
              cy="95"
              rx="3.5"
              ry="6"
              fill="#60b0ff"
              opacity="0.72"
            />
          </>
        )}

        {isHappy && (
          <>
            <circle
              cx="20"
              cy="52"
              r="5"
              fill="#fbbf24"
              style={{
                animation: "sparkleCircle 0.6s ease infinite alternate",
              }}
            />
            <circle
              cx="140"
              cy="52"
              r="5"
              fill="#fbbf24"
              style={{
                animation: "sparkleCircle 0.6s ease 0.25s infinite alternate",
              }}
            />
            <circle
              cx="14"
              cy="72"
              r="3"
              fill="#f59e0b"
              style={{
                animation: "sparkleCircle 0.8s ease 0.1s infinite alternate",
              }}
            />
            <circle
              cx="146"
              cy="72"
              r="3"
              fill="#f59e0b"
              style={{
                animation: "sparkleCircle 0.8s ease 0.4s infinite alternate",
              }}
            />
          </>
        )}

        {isFast && !isChaos && (
          <>
            <line
              x1="132"
              y1="58"
              x2="152"
              y2="52"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
              style={{ animation: "speedLine 0.45s ease infinite alternate" }}
            />
            <line
              x1="134"
              y1="71"
              x2="156"
              y2="68"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.65"
              style={{
                animation: "speedLine 0.45s ease 0.15s infinite alternate",
              }}
            />
          </>
        )}

        {isWeak && !isHiding && (
          <ellipse
            cx="110"
            cy="60"
            rx="4"
            ry="5.5"
            fill="#93c5fd"
            opacity="0.65"
            style={{ animation: "sweatDrop 1.4s ease-in-out infinite" }}
          />
        )}
      </svg>

      {showQuestion && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 6,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(251,191,36,0.17)",
            border: "1.5px solid rgba(251,191,36,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 900,
            color: "#fbbf24",
            fontFamily: "'Quicksand', sans-serif",
            backdropFilter: "blur(8px)",
            animation: "questionPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow: "0 0 14px rgba(251,191,36,0.32)",
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

export default PetMascot;

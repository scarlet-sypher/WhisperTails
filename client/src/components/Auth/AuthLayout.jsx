import React, { useState, useEffect } from "react";
import { ArrowLeft, PawPrint, Loader2 } from "lucide-react";
import Mascot from "../Guests/Login/Mascot";

const generateBirds = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    startY: 10 + Math.random() * 75,
    size: 5 + Math.random() * 7,
    delay: i * 0.08,
    duration: 1.0 + Math.random() * 0.6,
    opacity: 0.18 + Math.random() * 0.22,
    yWobble: (Math.random() - 0.5) * 35,
  }));

const BirdParticles = ({ active, color }) => {
  const [birds] = useState(generateBirds);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {birds.map((b) => (
        <svg
          key={b.id}
          viewBox="0 0 20 10"
          style={{
            position: "absolute",
            top: `${b.startY}%`,
            left: "-5%",
            width: b.size,
            height: b.size * 0.6,
            color,
            opacity: active ? b.opacity : 0,
            transform: active
              ? `translateX(110vw) translateY(${b.yWobble}px)`
              : "translateX(0)",
            transition: active
              ? `transform ${b.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${b.delay}s, opacity 0.15s ease ${b.delay}s`
              : "opacity 0.3s ease",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,5 Q5,0 10,5 Q15,0 20,5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
};

const GradientBackground = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background: "#060d1c",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `
          radial-gradient(ellipse 120% 90% at 10% 0%,   #0d2554 0%, transparent 55%),
          radial-gradient(ellipse 80%  70% at 90% 100%, #0a3060 0%, transparent 55%),
          radial-gradient(ellipse 60%  50% at 50% 50%,  #061428 0%, transparent 80%),
          linear-gradient(160deg, #060d1c 0%, #0b1630 40%, #07121e 100%)
        `,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "160px",
        opacity: 0.6,
      }}
    />
  </>
);

const DogSilhouette = ({ style }) => (
  <svg viewBox="0 0 120 80" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20,60 Q15,40 25,35 Q22,20 35,22 Q38,15 45,18 L55,15 Q65,12 68,20 Q78,18 80,28 Q90,30 88,45 Q95,50 90,60 Q85,65 80,62 L75,70 Q70,75 65,70 L40,70 Q35,75 30,70 Z"
      fill="currentColor"
    />
    <path d="M35,22 Q30,10 38,8 Q46,6 45,18" fill="currentColor" />
    <path d="M80,28 Q88,18 92,22 Q96,26 88,35" fill="currentColor" />
    <circle cx="52" cy="26" r="3" fill="rgba(255,255,255,0.3)" />
    <path d="M78,60 Q82,68 78,74 Q74,78 72,72" fill="currentColor" />
  </svg>
);

const CatSilhouette = ({ style }) => (
  <svg viewBox="0 0 100 90" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25,55 Q20,35 30,28 L28,10 L40,25 Q48,18 52,18 Q56,18 65,25 L72,10 L70,28 Q80,35 75,55 Q78,65 70,68 L55,72 Q50,75 45,72 L30,68 Q22,65 25,55 Z"
      fill="currentColor"
    />
    <circle cx="42" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
    <circle cx="58" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
    <path d="M45,72 Q50,80 55,80 Q60,80 55,72" fill="currentColor" />
  </svg>
);

const HouseSilhouette = ({ style }) => (
  <svg viewBox="0 0 100 80" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50,5 L90,40 L80,40 L80,75 L20,75 L20,40 L10,40 Z"
      fill="currentColor"
    />
    <rect x="40" y="50" width="20" height="25" fill="rgba(0,0,0,0.08)" />
    <rect x="25" y="48" width="14" height="14" fill="rgba(0,0,0,0.08)" />
    <rect x="61" y="48" width="14" height="14" fill="rgba(0,0,0,0.08)" />
  </svg>
);

const SILHOUETTES = [
  {
    C: DogSilhouette,
    x: "3%",
    y: "68%",
    w: 100,
    opacity: 0.035,
    px: 0.35,
    py: 0.25,
  },
  {
    C: CatSilhouette,
    x: "83%",
    y: "72%",
    w: 85,
    opacity: 0.035,
    px: -0.28,
    py: 0.18,
  },
  {
    C: HouseSilhouette,
    x: "87%",
    y: "8%",
    w: 90,
    opacity: 0.03,
    px: -0.18,
    py: -0.28,
  },
  {
    C: DogSilhouette,
    x: "0%",
    y: "12%",
    w: 70,
    opacity: 0.025,
    px: 0.25,
    py: -0.35,
  },
];

export const AUTH_ACCENT = {
  primary: "#3b82f6",
  light: "#60a5fa",
  glow: "rgba(59,130,246,0.35)",
  ring: "rgba(59,130,246,0.5)",
};

export const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20% { transform:translateX(-7px); }
    40% { transform:translateX(7px); }
    60% { transform:translateX(-5px); }
    80% { transform:translateX(5px); }
  }
  @keyframes sparkleCircle {
    from { opacity:0.55; transform:scale(0.75); }
    to   { opacity:1;    transform:scale(1.35); }
  }
  @keyframes speedLine {
    from { opacity:0.35; transform:scaleX(0.65); }
    to   { opacity:1;    transform:scaleX(1); }
  }
  @keyframes errorImpact {
    0%   { transform:translateX(0) scale(1); }
    12%  { transform:translateX(-10px) scale(0.96); }
    26%  { transform:translateX(10px) scale(1.03); }
    40%  { transform:translateX(-8px) scale(0.97); }
    56%  { transform:translateX(8px) scale(1.02); }
    70%  { transform:translateX(-5px) scale(0.99); }
    84%  { transform:translateX(4px) scale(1.01); }
    100% { transform:translateX(0) scale(1); }
  }
  @keyframes mascotBounce {
    0%,100% { transform:translateY(0) scale(1); }
    30%     { transform:translateY(-22px) scale(1.05); }
    60%     { transform:translateY(-10px) scale(1.02); }
  }
  @keyframes mascotShake {
    0%,100% { transform:translateX(0) rotate(0deg); }
    20% { transform:translateX(-8px) rotate(-2deg); }
    40% { transform:translateX(8px) rotate(2deg); }
    60% { transform:translateX(-5px) rotate(-1deg); }
    80% { transform:translateX(5px) rotate(1deg); }
  }
  @keyframes questionPop {
    from { opacity:0; transform:scale(0.4) rotate(-15deg); }
    to   { opacity:1; transform:scale(1) rotate(0deg); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes zzzFloat {
    0%   { opacity:0;   transform:translateY(0) scale(0.6); }
    20%  { opacity:0.9; transform:translateY(-8px) scale(1); }
    80%  { opacity:0.6; transform:translateY(-30px) scale(1.1); }
    100% { opacity:0;   transform:translateY(-48px) scale(0.8); }
  }
  @keyframes sweatDrop {
    0%,100% { transform:translateY(0);  opacity:0.65; }
    50%     { transform:translateY(6px); opacity:0.9; }
  }
  .auth-input { transition:all 0.3s ease; }
  .auth-input::placeholder { color:rgba(148,163,184,0.52); }
  .auth-input:-webkit-autofill {
    -webkit-box-shadow:0 0 0 1000px rgba(8,14,28,0.96) inset !important;
    -webkit-text-fill-color:#e2e8f0 !important;
  }
  .auth-btn-primary { transition:all 0.3s ease; }
  .auth-btn-primary:hover:not(:disabled) { transform:translateY(-2px); }
  .auth-btn-primary:active:not(:disabled) { transform:scale(0.97); }
  .auth-btn-secondary { transition:all 0.3s ease; }
  .auth-btn-secondary:hover:not(:disabled) { background:rgba(255,255,255,0.10) !important; transform:translateY(-1px); }
  .back-btn:hover { background:rgba(255,255,255,0.09) !important; transform:translateX(-3px); }
  @media (max-width:900px) {
    .auth-layout { flex-direction:column !important; align-items:center !important; gap:28px !important; }
    .auth-mascot { min-width:0 !important; width:100% !important; display:flex !important; flex-direction:column !important; align-items:center !important; }
    .auth-card-wrapper { width:100% !important; max-width:460px !important; }
  }
  @media (max-width:520px) {
    .auth-layout { gap:20px !important; padding:12px !important; }
    .auth-card-inner { padding:24px 20px 20px !important; border-radius:18px !important; }
    .auth-mascot-scale { transform:scale(0.82) !important; transform-origin:top center !important; margin-bottom:-30px !important; }
  }
  @media (max-width:380px) {
    .auth-mascot-scale { transform:scale(0.72) !important; margin-bottom:-45px !important; }
  }
`;

export function inputStyle(focused, accent = AUTH_ACCENT) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? accent.primary : "rgba(255,255,255,0.12)"}`,
    borderRadius: 12,
    padding: "12px 44px",
    color: "#e2e8f0",
    fontSize: 15,
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

export function inputStyleSimple(focused, accent = AUTH_ACCENT) {
  return { ...inputStyle(focused, accent), padding: "12px 16px" };
}

export const MessageAlert = ({ message }) => {
  if (!message?.text) return null;
  const isErr = message.type === "error";
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        background: isErr ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
        border: `1px solid ${isErr ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
        color: isErr ? "#f87171" : "#4ade80",
        animation: isErr ? "shake 0.4s ease" : "fadeUp 0.3s ease",
      }}
    >
      {message.text}
    </div>
  );
};

export const AuthCard = ({ children, accent = AUTH_ACCENT }) => (
  <div
    style={{
      flex: 1,
      background: "rgba(8,14,28,0.78)",
      backdropFilter: "blur(28px) saturate(1.5)",
      WebkitBackdropFilter: "blur(28px) saturate(1.5)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 24,
      padding: "36px 36px 32px",
      boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${accent.glow}`,
      position: "relative",
      overflow: "visible",
      zIndex: 10,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${accent.light}, transparent)`,
        opacity: 0.6,
        pointerEvents: "none",
        borderRadius: "24px 24px 0 0",
      }}
    />
    {children}
  </div>
);

export const AuthLogo = ({ accent = AUTH_ACCENT }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
      position: "relative",
      zIndex: 2,
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 16px ${accent.glow}`,
      }}
    >
      <PawPrint size={20} color="white" strokeWidth={2.5} />
    </div>
    <div>
      <div
        style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          background: `linear-gradient(135deg, #e2e8f0, ${accent.light})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        WhisperTails
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(148,163,184,0.6)",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        Pet Adoption Portal
      </div>
    </div>
  </div>
);

export const PrimaryBtn = ({
  loading,
  loadingText,
  children,
  disabled,
  accent = AUTH_ACCENT,
  style = {},
  ...props
}) => (
  <button
    className="auth-btn-primary"
    disabled={loading || disabled}
    style={{
      width: "100%",
      padding: "13px 0",
      marginTop: 4,
      borderRadius: 12,
      border: "none",
      cursor: loading || disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      fontWeight: 800,
      fontSize: 15,
      background:
        loading || disabled
          ? "rgba(100,116,139,0.4)"
          : `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
      color: loading || disabled ? "rgba(148,163,184,0.6)" : "white",
      boxShadow: loading || disabled ? "none" : `0 6px 20px ${accent.glow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: loading || disabled ? 0.7 : 1,
      ...style,
    }}
    {...props}
  >
    {loading ? (
      <>
        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
        {loadingText || "Processing..."}
      </>
    ) : (
      children
    )}
  </button>
);

export const SecondaryBtn = ({
  loading,
  children,
  accent = AUTH_ACCENT,
  style = {},
  ...props
}) => (
  <button
    className="auth-btn-secondary"
    disabled={loading}
    style={{
      width: "100%",
      padding: "11px 0",
      borderRadius: 12,
      border: "1.5px solid rgba(255,255,255,0.11)",
      cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 14,
      background: "rgba(255,255,255,0.04)",
      color: accent.light,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: loading ? 0.5 : 1,
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

export const FieldLabel = ({ children }) => (
  <label
    style={{
      display: "block",
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 700,
      color: "rgba(148,163,184,0.8)",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    }}
  >
    {children}
  </label>
);

export const OrDivider = () => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}
  >
    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    <span
      style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", fontWeight: 600 }}
    >
      or
    </span>
    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
  </div>
);

export const StepIndicator = ({ steps, current, accent = AUTH_ACCENT }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 24,
      position: "relative",
      zIndex: 2,
    }}
  >
    {steps.map((label, i) => {
      const idx = i + 1;
      const done = idx < current;
      const active = idx === current;
      return (
        <React.Fragment key={idx}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: done
                  ? accent.primary
                  : active
                    ? `linear-gradient(135deg, ${accent.primary}, ${accent.light})`
                    : "rgba(255,255,255,0.08)",
                border: `2px solid ${active || done ? accent.primary : "rgba(255,255,255,0.15)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
                color: active || done ? "white" : "rgba(148,163,184,0.5)",
                boxShadow: active ? `0 0 14px ${accent.glow}` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {done ? "✓" : idx}
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: active ? accent.light : "rgba(148,163,184,0.4)",
                letterSpacing: 0.4,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1.5,
                background: done ? accent.primary : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
                marginBottom: 14,
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const AuthLayout = ({
  mascotState = "idle",
  mascotExtra = {},
  children,
  backHref = "/",
  backLabel = "Back to Home",
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBackHover, setIsBackHover] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 9,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{AUTH_STYLES}</style>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Nunito', sans-serif",
          padding: "20px",
        }}
      >
        <GradientBackground />
        <BirdParticles active={false} color="#93c5fd" />

        {SILHOUETTES.map(({ C, x, y, w, opacity, px, py }, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              color: "#6ea8d8",
              opacity,
              transform: `translate(${mousePos.x * px}px, ${mousePos.y * py}px)`,
              transition: "transform 0.9s ease",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <C style={{ width: "100%", height: "auto" }} />
          </div>
        ))}

        <button
          className="back-btn"
          onClick={() => (window.location.href = backHref)}
          onMouseEnter={() => setIsBackHover(true)}
          onMouseLeave={() => setIsBackHover(false)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "8px 14px",
            color: "rgba(203,213,225,0.82)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 20,
          }}
        >
          <ArrowLeft size={14} /> {backLabel}
        </button>

        <div
          className="auth-layout"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            maxWidth: 960,
            width: "100%",
            animation: "fadeUp 0.7s ease both",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="auth-mascot" style={{ flexShrink: 0 }}>
            <div className="auth-mascot-scale">
              <Mascot
                mascotState={mascotState}
                accent={AUTH_ACCENT}
                typingSpeed={null}
                validationHint={null}
                showPass={false}
                isBackHover={isBackHover}
                roleJustSwitched={null}
                passwordStrength={null}
                errorKey={0}
                {...mascotExtra}
              />
            </div>
          </div>

          <div
            className="auth-card-wrapper"
            style={{ flex: 1, position: "relative" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;

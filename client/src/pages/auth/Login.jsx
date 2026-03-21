import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Mascot, { scorePassword } from "../../components/Guests/Login/Mascot";
import LoginForm from "../../components/Guests/Login/LoginForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

const RippleWave = ({ ripple }) => {
  if (!ripple) return null;
  return (
    <div
      key={ripple.id}
      style={{
        position: "fixed",
        left: ripple.x,
        top: ripple.y,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: ripple.color,
          animation:
            "rippleExpand 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          willChange: "width, height, opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: `2px solid ${ripple.ringColor}`,
          animation: "rippleRing 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          willChange: "width, height, opacity",
        }}
      />
    </div>
  );
};

const GradientBackground = ({ role }) => {
  const ownerGrad = `
    radial-gradient(ellipse 120% 90% at 10% 0%,    #0d2554 0%,   transparent 55%),
    radial-gradient(ellipse 80%  70% at 90% 100%,  #0a3060 0%,   transparent 55%),
    radial-gradient(ellipse 60%  50% at 50% 50%,   #061428 0%,   transparent 80%),
    linear-gradient(160deg, #060d1c 0%, #0b1630 40%, #07121e 100%)
  `;
  const shelterGrad = `
    radial-gradient(ellipse 120% 90% at 10% 0%,    #3d1206 0%,   transparent 55%),
    radial-gradient(ellipse 80%  70% at 90% 100%,  #2a1a02 0%,   transparent 55%),
    radial-gradient(ellipse 60%  50% at 50% 50%,   #1a0e03 0%,   transparent 80%),
    linear-gradient(160deg, #0e0906 0%, #1c1108 40%, #100a04 100%)
  `;

  return (
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
          opacity: role === "owner" ? 1 : 0,
          transition: "opacity 0.9s ease",
          background: ownerGrad,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: role === "shelter" ? 1 : 0,
          transition: "opacity 0.9s ease",
          background: shelterGrad,
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
};

function useTypingSpeed() {
  const [speed, setSpeed] = useState(null);
  const tsRef = useRef([]);
  const pauseRef = useRef(null);
  const sleepRef = useRef(null);

  const onKeystroke = useCallback(() => {
    const now = Date.now();
    tsRef.current.push(now);
    if (tsRef.current.length > 5) tsRef.current.shift();

    clearTimeout(pauseRef.current);
    clearTimeout(sleepRef.current);

    const ts = tsRef.current;
    if (ts.length >= 3) {
      const intervals = ts.slice(1).map((t, i) => t - ts[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setSpeed(avg < 130 ? "fast" : avg > 800 ? "slow" : null);
    }

    pauseRef.current = setTimeout(() => setSpeed("slow"), 2500);
    sleepRef.current = setTimeout(() => setSpeed("sleepy"), 4000);
  }, []);

  const resetSpeed = useCallback(() => {
    clearTimeout(pauseRef.current);
    clearTimeout(sleepRef.current);
    tsRef.current = [];
    setSpeed(null);
  }, []);

  return { speed, onKeystroke, resetSpeed };
}

function getValidationHint(errorText, formData) {
  if (!errorText) return null;
  if (!formData.email) return "emptyEmail";
  if (!formData.email.includes("@")) return "invalidEmail";
  if (
    errorText.toLowerCase().includes("password") ||
    errorText.toLowerCase().includes("invalid")
  )
    return "wrongPassword";
  return null;
}

const ACCENTS = {
  owner: {
    primary: "#3b82f6",
    light: "#60a5fa",
    glow: "rgba(59,130,246,0.35)",
    ring: "rgba(59,130,246,0.5)",
  },
  shelter: {
    primary: "#f97316",
    light: "#fb923c",
    glow: "rgba(249,115,22,0.35)",
    ring: "rgba(249,115,22,0.5)",
  },
};

const SILHOUETTES = [
  { C: "dog", x: "3%", y: "68%", w: 100, opacity: 0.035, px: 0.35, py: 0.25 },
  { C: "cat", x: "83%", y: "72%", w: 85, opacity: 0.035, px: -0.28, py: 0.18 },
  { C: "house", x: "87%", y: "8%", w: 90, opacity: 0.03, px: -0.18, py: -0.28 },
  { C: "dog", x: "0%", y: "12%", w: 70, opacity: 0.025, px: 0.25, py: -0.35 },
];

const SilhouetteMap = {
  dog: DogSilhouette,
  cat: CatSilhouette,
  house: HouseSilhouette,
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPass, setShowPass] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [role, setRole] = useState("owner");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [birdsActive, setBirdsActive] = useState(false);
  const [roleJustSwitched, setRoleJustSwitched] = useState(null);
  const [isBackHover, setIsBackHover] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [ripple, setRipple] = useState(null);

  const rippleIdRef = useRef(0);
  const cardRef = useRef(null);

  const { speed: typingSpeed, onKeystroke, resetSpeed } = useTypingSpeed();
  const validationHint = getValidationHint(message.text, formData);
  const passwordStrength = scorePassword(formData.password);
  const accent = ACCENTS[role];

  const mascotState =
    message.type === "success"
      ? "success"
      : message.type === "error"
        ? "error"
        : activeField === "password"
          ? "password"
          : activeField === "email"
            ? "email"
            : "idle";

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

  const handleRoleChange = (newRole) => {
    if (newRole === role) return;

    const id = rippleIdRef.current++;
    setRipple({
      id,
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.55,
      color:
        newRole === "owner" ? "rgba(37,99,235,0.12)" : "rgba(194,65,12,0.13)",
      ringColor:
        newRole === "owner" ? "rgba(96,165,250,0.2)" : "rgba(251,146,60,0.2)",
    });
    setTimeout(() => setRipple(null), 1500);

    setRole(newRole);
    setBirdsActive(true);
    setRoleJustSwitched(newRole);
    setTimeout(() => setBirdsActive(false), 1800);
    setTimeout(() => setRoleJustSwitched(null), 2200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onKeystroke();
    if (message.type === "error") setMessage({ type: "", text: "" });
  };

  const handleFocus = (field) => {
    setActiveField(field);
    resetSpeed();
  };

  const triggerError = (text) => {
    setMessage({ type: "error", text });
    setErrorKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetSpeed();

    if (!formData.email.trim() || !formData.password.trim()) {
      triggerError("Please fill in all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      triggerError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        if (res.data.token) localStorage.setItem("token", res.data.token);

        setTimeout(() => {
          const role = res.data.user.role;
          if (role === "owner") window.location.href = "/owner-dashboard";
          else if (role === "shelter")
            window.location.href = "/shelter-dashboard";
          else window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      console.error("Login error:", err);
      triggerError(err.response?.data?.message || "Login failed");
      if (err.response?.data?.requiresVerification) {
        setTimeout(() => {
          window.location.href = `/owner-signup?email=${formData.email}`;
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const birdColor = role === "owner" ? "#93c5fd" : "#fdba74";
  const silColor = role === "owner" ? "#6ea8d8" : "#c4925a";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes rippleExpand {
          0%   { width: 0px; height: 0px; opacity: 0.55; }
          40%  { opacity: 0.35; }
          100% { width: 280vmax; height: 280vmax; opacity: 0; }
        }
        @keyframes rippleRing {
          0%   { width: 0px; height: 0px; opacity: 0.7; }
          30%  { opacity: 0.5; }
          100% { width: 320vmax; height: 320vmax; opacity: 0; }
        }
        @keyframes sparkleCircle {
          from { opacity: 0.55; transform: scale(0.75); }
          to   { opacity: 1;    transform: scale(1.35); }
        }
        @keyframes speedLine {
          from { opacity: 0.35; transform: scaleX(0.65); }
          to   { opacity: 1;    transform: scaleX(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes errorImpact {
          0%   { transform: translateX(0)     scale(1); }
          12%  { transform: translateX(-10px) scale(0.96); }
          26%  { transform: translateX(10px)  scale(1.03); }
          40%  { transform: translateX(-8px)  scale(0.97); }
          56%  { transform: translateX(8px)   scale(1.02); }
          70%  { transform: translateX(-5px)  scale(0.99); }
          84%  { transform: translateX(4px)   scale(1.01); }
          100% { transform: translateX(0)     scale(1); }
        }
        @keyframes mascotBounce {
          0%,100% { transform: translateY(0) scale(1); }
          30%     { transform: translateY(-22px) scale(1.05); }
          60%     { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes mascotShake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-8px) rotate(-2deg); }
          40% { transform: translateX(8px)  rotate(2deg); }
          60% { transform: translateX(-5px) rotate(-1deg); }
          80% { transform: translateX(5px)  rotate(1deg); }
        }
        @keyframes questionPop {
          from { opacity: 0; transform: scale(0.4) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes zzzFloat {
          0%   { opacity: 0;   transform: translateY(0)    scale(0.6); }
          20%  { opacity: 0.9; transform: translateY(-8px)  scale(1); }
          80%  { opacity: 0.6; transform: translateY(-30px) scale(1.1); }
          100% { opacity: 0;   transform: translateY(-48px) scale(0.8); }
        }
        @keyframes sweatDrop {
          0%,100% { transform: translateY(0);  opacity: 0.65; }
          50%     { transform: translateY(6px); opacity: 0.9; }
        }
        @keyframes catLegA {
          from { transform: rotate(-18deg); }
          to   { transform: rotate(18deg); }
        }
        @keyframes catLegB {
          from { transform: rotate(18deg); }
          to   { transform: rotate(-18deg); }
        }
        @keyframes meowPop {
          0%   { opacity: 0;   transform: translate(-50%, -100%) scale(0.4); }
          14%  { opacity: 1;   transform: translate(-50%, -115%) scale(1.12); }
          28%  { opacity: 1;   transform: translate(-50%, -108%) scale(1); }
          70%  { opacity: 0.9; transform: translate(-50%, -112%) scale(1); }
          100% { opacity: 0;   transform: translate(-50%, -140%) scale(0.88); }
        }

        .login-input::placeholder { color: rgba(148,163,184,0.52); }
        .login-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(8,14,28,0.96) inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }
        .role-btn { transition: all 0.3s ease; }
        .role-btn:hover { filter: brightness(1.1); }
        .google-btn:hover { background: rgba(255,255,255,0.10) !important; transform: translateY(-1px); }
        .google-btn:active { transform: scale(0.98); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .back-btn:hover { background: rgba(255,255,255,0.09) !important; transform: translateX(-3px); }

        @media (max-width: 900px) {
          .login-layout {
            flex-direction: column !important;
            align-items: center !important;
            gap: 22px !important;
          }
          .login-mascot {
            min-width: 0 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .login-card-wrapper {
            width: 100% !important;
            max-width: 420px !important;
          }
        }
        @media (max-width: 520px) {
          .login-layout {
            gap: 16px !important;
            padding: 10px !important;
          }
          .login-card-inner {
            padding: 20px 16px 18px !important;
            border-radius: 16px !important;
          }
          .login-mascot-scale {
            transform: scale(0.72) !important;
            transform-origin: top center !important;
            margin-bottom: -38px !important;
          }
        }
        @media (max-width: 380px) {
          .login-mascot-scale {
            transform: scale(0.63) !important;
            margin-bottom: -52px !important;
          }
        }
        .whisper-gradient {
          background: linear-gradient(135deg, #e2e8f0, var(--accent-light));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          isolation: isolate;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          "--accent-light": accent.light,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Nunito', sans-serif",
          padding: "16px",
        }}
      >
        <GradientBackground role={role} />
        <BirdParticles active={birdsActive} color={birdColor} />
        <RippleWave ripple={ripple} />

        {SILHOUETTES.map(({ C, x, y, w, opacity, px, py }, i) => {
          const Comp = SilhouetteMap[C];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                color: silColor,
                opacity,
                transform: `translate(${mousePos.x * px}px, ${mousePos.y * py}px)`,
                transition: "transform 0.9s ease, color 0.9s ease",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              <Comp style={{ width: "100%", height: "auto" }} />
            </div>
          );
        })}

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/")}
          onMouseEnter={() => setIsBackHover(true)}
          onMouseLeave={() => setIsBackHover(false)}
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9,
            padding: "7px 12px",
            color: "rgba(203,213,225,0.82)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            zIndex: 20,
          }}
        >
          <ArrowLeft size={13} /> Back to Home
        </button>

        <div
          className="login-layout"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            maxWidth: 860,
            width: "100%",
            animation: "fadeUp 0.7s ease both",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="login-mascot" style={{ flexShrink: 0 }}>
            <div
              className="login-mascot-scale"
              style={{
                transform: "scale(0.85)",
                transformOrigin: "top center",
              }}
            >
              <Mascot
                mascotState={mascotState}
                accent={accent}
                typingSpeed={typingSpeed}
                validationHint={validationHint}
                showPass={showPass}
                isBackHover={isBackHover}
                roleJustSwitched={roleJustSwitched}
                passwordStrength={passwordStrength}
                errorKey={errorKey}
              />
            </div>
          </div>

          <div
            className="login-card-wrapper"
            style={{ flex: 1, position: "relative" }}
          >
            <LoginForm
              formData={formData}
              loading={loading}
              message={message}
              showPass={showPass}
              activeField={activeField}
              role={role}
              accent={accent}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              setShowPass={setShowPass}
              setActiveField={(field) =>
                field ? handleFocus(field) : setActiveField(null)
              }
              setRole={handleRoleChange}
              API_URL={API_URL}
              cardRef={cardRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

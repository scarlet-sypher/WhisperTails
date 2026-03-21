import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Mascot from "../../components/Guests/Login/Mascot";
import WalkingCats from "../../components/Guests/Login/cats/WalkingCats";
import GradientBackground from "../../components/Guests/Signup/GradientBackground";
import RippleWave from "../../components/Guests/Signup/RippleWave";
import SignupForm from "../../components/Guests/Signup/SignupForm";
import { PawPrint, Building2 } from "lucide-react";

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

const DogSil = ({ style }) => (
  <svg viewBox="0 0 120 80" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20,60 Q15,40 25,35 Q22,20 35,22 Q38,15 45,18 L55,15 Q65,12 68,20 Q78,18 80,28 Q90,30 88,45 Q95,50 90,60 Q85,65 80,62 L75,70 Q70,75 65,70 L40,70 Q35,75 30,70 Z"
      fill="currentColor"
    />
    <path d="M35,22 Q30,10 38,8 Q46,6 45,18" fill="currentColor" />
    <path d="M80,28 Q88,18 92,22 Q96,26 88,35" fill="currentColor" />
    <circle cx="52" cy="26" r="3" fill="rgba(255,255,255,0.3)" />
  </svg>
);

const CatSil = ({ style }) => (
  <svg viewBox="0 0 100 90" style={style} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25,55 Q20,35 30,28 L28,10 L40,25 Q48,18 52,18 Q56,18 65,25 L72,10 L70,28 Q80,35 75,55 Q78,65 70,68 L55,72 Q50,75 45,72 L30,68 Q22,65 25,55 Z"
      fill="currentColor"
    />
    <circle cx="42" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
    <circle cx="58" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
  </svg>
);

const SILHOUETTES = [
  { C: DogSil, x: "3%", y: "68%", w: 100, opacity: 0.035, px: 0.35, py: 0.25 },
  { C: CatSil, x: "83%", y: "72%", w: 85, opacity: 0.035, px: -0.28, py: 0.18 },
  { C: DogSil, x: "87%", y: "8%", w: 80, opacity: 0.03, px: -0.18, py: -0.28 },
  { C: CatSil, x: "0%", y: "12%", w: 70, opacity: 0.025, px: 0.25, py: -0.35 },
];

const UnifiedSignup = () => {
  const [role, setRole] = useState("owner");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBackHover, setIsBackHover] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [formState, setFormState] = useState({
    activeField: null,
    showPass: false,
    passwordStrength: null,
    emailState: "idle",
    isOTPSent: false,
    message: { type: "", text: "" },
  });

  const rippleIdRef = useRef(0);
  const cardRef = useRef(null);
  const accent = ACCENTS[role];

  const mascotState = (() => {
    const { activeField, emailState, isOTPSent, message } = formState;
    if (isOTPSent) return "success";
    if (message.type === "error") return "error";
    if (emailState === "checking") return "email";
    if (emailState === "failed") return "error";
    if (emailState === "verified" && activeField === "password")
      return "password";
    if (activeField === "email") return "email";
    return "idle";
  })();

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
  };

  const silColor = role === "owner" ? "#6ea8d8" : "#c4925a";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes rippleExpand {
          0%   { width:0; height:0; opacity:0.55; }
          40%  { opacity:0.35; }
          100% { width:280vmax; height:280vmax; opacity:0; }
        }
        @keyframes rippleRing {
          0%   { width:0; height:0; opacity:0.7; }
          30%  { opacity:0.5; }
          100% { width:320vmax; height:320vmax; opacity:0; }
        }
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
          to   { opacity:1; transform:scale(1.35); }
        }
        @keyframes speedLine {
          from { opacity:0.35; transform:scaleX(0.65); }
          to   { opacity:1; transform:scaleX(1); }
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
          0%   { opacity:0; transform:translateY(0) scale(0.6); }
          20%  { opacity:0.9; transform:translateY(-8px) scale(1); }
          80%  { opacity:0.6; transform:translateY(-30px) scale(1.1); }
          100% { opacity:0; transform:translateY(-48px) scale(0.8); }
        }
        @keyframes sweatDrop {
          0%,100% { transform:translateY(0); opacity:0.65; }
          50%     { transform:translateY(6px); opacity:0.9; }
        }
        @keyframes catLegA {
          from { transform:rotate(-18deg); }
          to   { transform:rotate(18deg); }
        }
        @keyframes catLegB {
          from { transform:rotate(18deg); }
          to   { transform:rotate(-18deg); }
        }
        .auth-input::placeholder { color:rgba(148,163,184,0.52); }
        .auth-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(8,14,28,0.96) inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }
        .auth-submit-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .auth-submit-btn:active:not(:disabled) { transform:scale(0.97); }
        .auth-google-btn:hover { background:rgba(255,255,255,0.10) !important; transform:translateY(-1px); }
        .back-btn:hover { background:rgba(255,255,255,0.09) !important; transform:translateX(-3px); }
        .role-tab:hover { filter:brightness(1.1); }
        @media (max-width: 900px) {
          .signup-layout { flex-direction:column !important; align-items:center !important; gap:22px !important; }
          .signup-mascot { min-width:0 !important; width:100% !important; display:flex !important; flex-direction:column !important; align-items:center !important; }
          .signup-card-wrapper { width:100% !important; max-width:420px !important; }
        }
        @media (max-width: 520px) {
          .signup-layout { gap:16px !important; padding:10px !important; }
          .signup-mascot-scale { transform:scale(0.72) !important; transform-origin:top center !important; margin-bottom:-38px !important; }
        }
        @media (max-width: 380px) {
          .signup-mascot-scale { transform:scale(0.63) !important; margin-bottom:-52px !important; }
        }
          @keyframes fadeIn {
            from { opacity:0; }
            to   { opacity:1; }
          }
          .whisper-gradient-signup {
            font-family: 'Quicksand', sans-serif;
            font-weight: 700;
            font-size: 17px;
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Nunito', sans-serif",
          "--accent-light": accent.light,
          padding: "16px",
        }}
      >
        <GradientBackground role={role} />
        <RippleWave ripple={ripple} />

        {SILHOUETTES.map(({ C, x, y, w, opacity, px, py }, i) => (
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
            <C style={{ width: "100%", height: "auto" }} />
          </div>
        ))}

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
          className="signup-layout"
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
          <div className="signup-mascot" style={{ flexShrink: 0 }}>
            <div
              className="signup-mascot-scale"
              style={{
                transform: "scale(0.85)",
                transformOrigin: "top center",
              }}
            >
              <Mascot
                mascotState={mascotState}
                accent={accent}
                typingSpeed={null}
                validationHint={null}
                showPass={formState.showPass}
                isBackHover={isBackHover}
                roleJustSwitched={null}
                passwordStrength={formState.passwordStrength}
                errorKey={0}
              />
            </div>
          </div>

          <div
            className="signup-card-wrapper"
            style={{ flex: 1, position: "relative" }}
          >
            <WalkingCats cardRef={cardRef} accent={accent} />

            <div
              ref={cardRef}
              style={{
                flex: 1,
                background: "rgba(8,14,28,0.78)",
                backdropFilter: "blur(28px) saturate(1.5)",
                WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 20,
                padding: "28px 28px 24px",
                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${accent.glow}`,
                position: "relative",
                overflow: "visible",
                zIndex: 10,
                transition: "box-shadow 0.5s ease",
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
                  borderRadius: "20px 20px 0 0",
                  transition: "background 0.5s ease",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${accent.glow}`,
                    transition: "all 0.5s ease",
                  }}
                >
                  <PawPrint size={17} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="whisper-gradient-signup">WhisperTails</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(148,163,184,0.6)",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    Pet Adoption Portal
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 10,
                  padding: 3,
                  marginBottom: 18,
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {[
                  { key: "owner", label: "Pet Owner", Icon: PawPrint },
                  {
                    key: "shelter",
                    label: "Shelter / Trainer",
                    Icon: Building2,
                  },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className="role-tab"
                    onClick={() => handleRoleChange(key)}
                    style={{
                      flex: 1,
                      padding: "7px 0",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      background:
                        role === key
                          ? `linear-gradient(135deg, ${ACCENTS[key].primary}, ${ACCENTS[key].light})`
                          : "transparent",
                      color: role === key ? "white" : "rgba(148,163,184,0.7)",
                      boxShadow:
                        role === key
                          ? `0 4px 14px ${ACCENTS[key].glow}`
                          : "none",
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Icon size={13} strokeWidth={2.5} /> {label}
                  </button>
                ))}
              </div>

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#f1f5f9",
                  marginBottom: 4,
                  letterSpacing: -0.5,
                }}
              >
                {formState.isOTPSent
                  ? "Check Your Email"
                  : `Create ${role === "owner" ? "Owner" : "Shelter"} Account`}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(148,163,184,0.7)",
                  marginBottom: 18,
                  fontWeight: 500,
                }}
              >
                {formState.isOTPSent
                  ? "Enter the verification code we sent you"
                  : role === "owner"
                    ? "Start your pet adoption journey today"
                    : "List pets and connect with adopters"}
              </p>

              <SignupForm
                key={role}
                role={role}
                accent={accent}
                onSuccess={setFormState}
              />

              <p
                style={{
                  marginTop: 16,
                  textAlign: "center",
                  fontSize: 12,
                  color: "rgba(148,163,184,0.6)",
                  fontWeight: 500,
                }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  style={{
                    color: accent.light,
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedSignup;

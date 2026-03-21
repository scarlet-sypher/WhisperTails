import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Mascot from "../../components/Guests/Login/Mascot";
import WalkingCats from "../../components/Guests/Login/cats/WalkingCats";
import RequestOtp from "../../components/auth/RequestOtpStep";
import VerifyOTP from "../../components/auth/VerifyOtpStep";
import ResetPassword from "../../components/auth/ResetPasswordStep";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ACCENT = {
  primary: "#3b82f6",
  light: "#60a5fa",
  glow: "rgba(59,130,246,0.35)",
  ring: "rgba(59,130,246,0.5)",
};

const TITLES = ["Forgot Password", "Verify OTP", "Reset Password"];
const SUBTITLES = [
  "Enter your email to receive a reset code",
  "Check your inbox for the 6-digit code",
  "Choose a strong new password",
];

const SILHOUETTES = [
  { C: "dog", x: "3%", y: "68%", w: 100, opacity: 0.035, px: 0.35, py: 0.25 },
  { C: "cat", x: "83%", y: "72%", w: 85, opacity: 0.035, px: -0.28, py: 0.18 },
  { C: "house", x: "87%", y: "8%", w: 90, opacity: 0.03, px: -0.18, py: -0.28 },
  { C: "dog", x: "0%", y: "12%", w: 70, opacity: 0.025, px: 0.25, py: -0.35 },
];

const DogSil = ({ style }) => (
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

const HouseSil = ({ style }) => (
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

const SilMap = { dog: DogSil, cat: CatSil, house: HouseSil };

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

const StepIndicator = ({ step, accent }) => {
  const steps = ["Request", "Verify", "Reset"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
      }}
    >
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
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
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: done
                    ? accent.primary
                    : active
                      ? `linear-gradient(135deg,${accent.primary},${accent.light})`
                      : "rgba(255,255,255,0.08)",
                  border: `2px solid ${active || done ? accent.primary : "rgba(255,255,255,0.15)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
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
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isBackHover, setIsBackHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [errorKey, setErrorKey] = useState(0);
  const [activeField, setActiveField] = useState(null);

  const cardRef = useRef(null);

  const mascotState = (() => {
    if (message.type === "success" && step === 3) return "success";
    if (message.type === "error") return "error";
    if (step === 3 && activeField === "newPassword") return "password";
    if (step === 1 && activeField === "email") return "email";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerError = (text) => {
    setMessage({ type: "error", text });
    setErrorKey((k) => k + 1);
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      triggerError("Please enter your email");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/request`,
        { email: formData.email },
        { withCredentials: true },
      );
      if (data.success) {
        setMessage({
          type: "success",
          text: "OTP sent to your email. Please check your inbox.",
        });
        setStep(2);
      }
    } catch (err) {
      console.error("Request OTP error:", err);
      triggerError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      triggerError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/verify-otp`,
        { email: formData.email, otp: formData.otp },
        { withCredentials: true },
      );
      if (data.success) {
        setMessage({
          type: "success",
          text: "OTP verified! Now set your new password.",
        });
        setStep(3);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      triggerError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      triggerError("Please fill in all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      triggerError("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 8) {
      triggerError("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/reset`,
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        },
        { withCredentials: true },
      );
      if (data.success) {
        setMessage({
          type: "success",
          text: "Password reset successful! Redirecting to login...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      triggerError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/resend-otp`,
        { email: formData.email },
        { withCredentials: true },
      );
      if (data.success)
        setMessage({ type: "success", text: "New OTP sent to your email" });
    } catch (err) {
      console.error("Resend OTP error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
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
          0%   { opacity:0;   transform:translateY(0)    scale(0.6); }
          20%  { opacity:0.9; transform:translateY(-8px)  scale(1); }
          80%  { opacity:0.6; transform:translateY(-30px) scale(1.1); }
          100% { opacity:0;   transform:translateY(-48px) scale(0.8); }
        }
        @keyframes sweatDrop {
          0%,100% { transform:translateY(0);  opacity:0.65; }
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
          -webkit-box-shadow:0 0 0 1000px rgba(8,14,28,0.96) inset !important;
          -webkit-text-fill-color:#e2e8f0 !important;
        }
        .auth-submit-btn { transition:all 0.3s ease; }
        .auth-submit-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .auth-submit-btn:active:not(:disabled) { transform:scale(0.97); }
        .back-btn:hover { background:rgba(255,255,255,0.09) !important; transform:translateX(-3px); }
        @media (max-width:900px) {
          .fp-layout { flex-direction:column !important; align-items:center !important; gap:22px !important; }
          .fp-mascot { min-width:0 !important; width:100% !important; display:flex !important; flex-direction:column !important; align-items:center !important; }
          .fp-card-wrapper { width:100% !important; max-width:420px !important; }
        }
        @media (max-width:520px) {
          .fp-layout { gap:16px !important; padding:10px !important; }
          .fp-mascot-scale { transform:scale(0.72) !important; transform-origin:top center !important; margin-bottom:-38px !important; }
        }
        @media (max-width:380px) {
          .fp-mascot-scale { transform:scale(0.63) !important; margin-bottom:-52px !important; }
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
          padding: "16px",
        }}
      >
        <GradientBackground />

        {SILHOUETTES.map(({ C, x, y, w, opacity, px, py }, i) => {
          const Comp = SilMap[C];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                color: "#6ea8d8",
                opacity,
                transform: `translate(${mousePos.x * px}px,${mousePos.y * py}px)`,
                transition: "transform 0.9s ease",
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
          onClick={() => (window.location.href = "/login")}
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
          <ArrowLeft size={13} /> Back to Login
        </button>

        <div
          className="fp-layout"
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
          <div className="fp-mascot" style={{ flexShrink: 0 }}>
            <div
              className="fp-mascot-scale"
              style={{
                transform: "scale(0.85)",
                transformOrigin: "top center",
              }}
            >
              <Mascot
                mascotState={mascotState}
                accent={ACCENT}
                typingSpeed={null}
                validationHint={null}
                showPass={false}
                isBackHover={isBackHover}
                roleJustSwitched={null}
                passwordStrength={null}
                errorKey={errorKey}
              />
            </div>
          </div>

          <div
            className="fp-card-wrapper"
            style={{ flex: 1, position: "relative" }}
          >
            <WalkingCats cardRef={cardRef} accent={ACCENT} />

            <div
              ref={cardRef}
              style={{
                background: "rgba(8,14,28,0.78)",
                backdropFilter: "blur(28px) saturate(1.5)",
                WebkitBackdropFilter: "blur(28px) saturate(1.5)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 20,
                padding: "28px 28px 24px",
                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${ACCENT.glow}`,
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
                  background: `linear-gradient(90deg,transparent,${ACCENT.light},transparent)`,
                  opacity: 0.6,
                  pointerEvents: "none",
                  borderRadius: "20px 20px 0 0",
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
                    background: `linear-gradient(135deg,${ACCENT.primary},${ACCENT.light})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${ACCENT.glow}`,
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="4" r="2" />
                    <circle cx="18" cy="8" r="2" />
                    <circle cx="20" cy="16" r="2" />
                    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Quicksand',sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      background: `linear-gradient(135deg,#e2e8f0,${ACCENT.light})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    WhisperTails
                  </div>
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

              <StepIndicator step={step} accent={ACCENT} />

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#f1f5f9",
                  marginBottom: 4,
                  letterSpacing: -0.5,
                }}
              >
                {TITLES[step - 1]}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(148,163,184,0.7)",
                  marginBottom: 18,
                  fontWeight: 500,
                }}
              >
                {SUBTITLES[step - 1]}
              </p>

              {message.text && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: "9px 12px",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      message.type === "error"
                        ? "rgba(239,68,68,0.12)"
                        : "rgba(34,197,94,0.12)",
                    border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
                    color: message.type === "error" ? "#f87171" : "#4ade80",
                    animation:
                      message.type === "error"
                        ? "shake 0.4s ease"
                        : "fadeUp 0.3s ease",
                  }}
                >
                  {message.text}
                </div>
              )}

              {step === 1 && (
                <RequestOtp
                  formData={formData}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleRequestOTP={handleRequestOTP}
                  accent={ACCENT}
                  setActiveField={setActiveField}
                />
              )}
              {step === 2 && (
                <VerifyOTP
                  formData={formData}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleVerifyOTP={handleVerifyOTP}
                  handleResendOTP={handleResendOTP}
                  setStep={setStep}
                  accent={ACCENT}
                />
              )}
              {step === 3 && (
                <ResetPassword
                  formData={formData}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleResetPassword={handleResetPassword}
                  accent={ACCENT}
                  setActiveField={setActiveField}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

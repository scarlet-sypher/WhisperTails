import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { scorePassword } from "../../Guests/Login/Mascot";
import OTPScreen from "./OTPScreen";
// ← NEW: import EmailJS service
import { sendVerificationOTP } from "../../../utils/emailjsService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function inputStyle(focused, accent) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? accent.primary : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10,
    padding: "10px 40px",
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

const StrengthBar = ({ strength }) => {
  if (!strength) return null;
  const levels = { weak: 1, medium: 2, strong: 3 };
  const colors = { weak: "#f87171", medium: "#fbbf24", strong: "#4ade80" };
  const labels = { weak: "Weak", medium: "Fair", strong: "Strong" };
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
          color: colors[strength],
          minWidth: 38,
          textAlign: "right",
        }}
      >
        {labels[strength]}
      </span>
    </div>
  );
};

const SignupForm = ({ role, accent, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [emailState, setEmailState] = useState("idle");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const passwordStrength = scorePassword(formData.password);
  const isEmailVerified = emailState === "verified";

  const setErr = (text) => setMessage({ type: "error", text });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.type === "error") setMessage({ type: "", text: "" });
  };

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setErr("Please enter an email");
      return;
    }
    setEmailState("checking");
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const endpoint =
        role === "owner"
          ? `${API_URL}/api/auth/owner/check-email`
          : `${API_URL}/api/auth/shelter/check-email`;
      const { data } = await axios.post(
        endpoint,
        { email: formData.email },
        { withCredentials: true },
      );
      if (data.success) {
        setEmailState("verified");
        setMessage({ type: "success", text: "Email is available!" });
      } else {
        setEmailState("failed");
        setErr(data.message || "Email not available");
      }
    } catch (err) {
      setEmailState("failed");
      setErr(err.response?.data?.message || "Failed to check email");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErr("Please agree to Terms & Conditions");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const endpoint =
        role === "owner"
          ? `${API_URL}/api/auth/owner/signup`
          : `${API_URL}/api/auth/shelter/signup`;
      const { data } = await axios.post(
        endpoint,
        {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        { withCredentials: true },
      );
      if (data.success) {
        try {
          await sendVerificationOTP(
            formData.email,
            data.otp,
            role === "owner" ? "New Owner" : "New Shelter",
          );
        } catch (ejsErr) {
          console.error("EmailJS send failed:", ejsErr);
        }
        setIsOTPSent(true);
        setMessage({ type: "success", text: data.message });
      }
    } catch (err) {
      setErr(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setErr("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const endpoint =
        role === "owner"
          ? `${API_URL}/api/auth/owner/verify-otp`
          : `${API_URL}/api/auth/shelter/verify-otp`;
      const { data } = await axios.post(
        endpoint,
        { email: formData.email, otp: formData.otp },
        { withCredentials: true },
      );
      if (data.success) {
        setMessage({ type: "success", text: "Email verified! Redirecting..." });
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href =
            role === "owner" ? "/owner-dashboard" : "/shelter-dashboard";
        }, 1500);
      }
    } catch (err) {
      setErr(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const endpoint =
        role === "owner"
          ? `${API_URL}/api/auth/owner/resend-otp`
          : `${API_URL}/api/auth/shelter/resend-otp`;
      const { data } = await axios.post(
        endpoint,
        { email: formData.email },
        { withCredentials: true },
      );
      if (data.success) {
        try {
          await sendVerificationOTP(
            formData.email,
            data.otp,
            role === "owner" ? "Owner" : "Shelter",
          );
        } catch (ejsErr) {
          console.error("EmailJS resend failed:", ejsErr);
        }
        setMessage({ type: "success", text: "New OTP sent to your email!" });
      }
    } catch (err) {
      setErr(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSuccess?.({
      activeField,
      showPass,
      passwordStrength,
      emailState,
      isOTPSent,
      message,
    });
  }, [activeField, showPass, passwordStrength, emailState, isOTPSent, message]);

  const msgBlock = message.text && (
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
          message.type === "error" ? "shake 0.4s ease" : "fadeUp 0.3s ease",
      }}
    >
      {message.text}
    </div>
  );

  if (isOTPSent) {
    return (
      <>
        {msgBlock}
        <OTPScreen
          email={formData.email}
          formData={formData}
          loading={loading}
          handleInputChange={handleInputChange}
          handleVerifyOTP={handleVerifyOTP}
          handleResendOTP={handleResendOTP}
          accent={accent}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_URL}/api/auth/google/${role}`;
        }}
        className="auth-google-btn"
        style={{
          width: "100%",
          padding: "9px 0",
          marginBottom: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.11)",
          borderRadius: 10,
          cursor: "pointer",
          color: "#e2e8f0",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 13,
          transition: "all 0.3s ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20H24v8h11.3C33.7 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.5 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.5 29.2 4 24 4 16 4 9.1 8.4 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.3-5.3C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.2 39.7 16 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6.1l6.3 5.3C40.9 35.7 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"
          />
        </svg>
        Continue with Google
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "14px 0",
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(148,163,184,0.5)",
            fontWeight: 600,
          }}
        >
          or
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {msgBlock}

      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 5,
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(148,163,184,0.8)",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Email
          </label>
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Mail
                size={14}
                color={
                  activeField === "email"
                    ? accent.light
                    : "rgba(148,163,184,0.45)"
                }
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="auth-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                placeholder="Enter your email"
                disabled={isEmailVerified}
                required
                style={inputStyle(activeField === "email", accent)}
              />
              {isEmailVerified && (
                <CheckCircle
                  size={14}
                  color="#4ade80"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </div>

            {!isEmailVerified ? (
              <button
                type="button"
                onClick={handleEmailCheck}
                disabled={loading || emailState === "checking"}
                style={{
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "none",
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
                  color: "white",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: `0 4px 14px ${accent.glow}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {emailState === "checking" ? (
                  <Loader2
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  "Check"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEmailState("idle");
                  setFormData((p) => ({
                    ...p,
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }));
                  setAgreedToTerms(false);
                }}
                style={{
                  padding: "0 12px",
                  borderRadius: 10,
                  flexShrink: 0,
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(148,163,184,0.7)",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Change
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            overflow: "hidden",
            maxHeight: isEmailVerified ? "600px" : "0px",
            opacity: isEmailVerified ? 1 : 0,
            transition:
              "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(148,163,184,0.8)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={14}
                color={
                  activeField === "password"
                    ? accent.light
                    : "rgba(148,163,184,0.45)"
                }
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="auth-input"
                ref={passwordRef}
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                placeholder="Min 8 characters"
                required
                minLength={8}
                style={{
                  ...inputStyle(activeField === "password", accent),
                  paddingRight: 40,
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPass((p) => !p);
                  setTimeout(() => {
                    passwordRef.current?.focus();
                    setActiveField("password");
                  }, 0);
                }}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(148,163,184,0.55)",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {formData.password.length > 0 && (
              <StrengthBar strength={passwordStrength} />
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(148,163,184,0.8)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={14}
                color={
                  activeField === "confirmPassword"
                    ? accent.light
                    : "rgba(148,163,184,0.45)"
                }
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="auth-input"
                ref={confirmRef}
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setActiveField("confirmPassword")}
                onBlur={() => setActiveField(null)}
                placeholder="Re-enter your password"
                required
                style={{
                  ...inputStyle(activeField === "confirmPassword", accent),
                  paddingRight: 40,
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setShowConfirm((p) => !p);
                  setTimeout(() => {
                    confirmRef.current?.focus();
                    setActiveField("confirmPassword");
                  }, 0);
                }}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(148,163,184,0.55)",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              onClick={() => setAgreedToTerms((p) => !p)}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                flexShrink: 0,
                cursor: "pointer",
                background: agreedToTerms
                  ? `linear-gradient(135deg, ${accent.primary}, ${accent.light})`
                  : "rgba(255,255,255,0.06)",
                border: `2px solid ${agreedToTerms ? accent.primary : "rgba(255,255,255,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {agreedToTerms && (
                <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>
                  ✓
                </span>
              )}
            </div>
            <span style={{ fontSize: 12, color: "rgba(148,163,184,0.8)" }}>
              I agree to the{" "}
              <span
                style={{
                  color: accent.light,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Terms & Conditions
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
            style={{
              width: "100%",
              padding: "11px 0",
              marginTop: 2,
              borderRadius: 10,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: 14,
              background: loading
                ? "rgba(100,116,139,0.4)"
                : `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
              color: loading ? "rgba(148,163,184,0.6)" : "white",
              boxShadow: loading ? "none" : `0 6px 20px ${accent.glow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Creating Account...
              </>
            ) : (
              `Create ${role === "owner" ? "Owner" : "Shelter"} Account`
            )}
          </button>
        </div>

        {!isEmailVerified && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(148,163,184,0.45)",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Verify your email above to continue
          </p>
        )}
      </form>
    </>
  );
};

export default SignupForm;

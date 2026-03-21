import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const AUTH_ACCENT = {
  primary: "#3b82f6",
  light: "#60a5fa",
  glow: "rgba(59,130,246,0.35)",
  ring: "rgba(59,130,246,0.5)",
};

function inputStyle(focused, accent = AUTH_ACCENT) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? accent.primary : "rgba(255,255,255,0.12)"}`,
    borderRadius: 12,
    padding: "12px 16px",
    color: "#e2e8f0",
    fontSize: 24,
    letterSpacing: 10,
    fontWeight: 800,
    textAlign: "center",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

const VerifyOTP = ({
  formData,
  loading,
  handleInputChange,
  handleVerifyOTP,
  handleResendOTP,
  setStep,
  accent = AUTH_ACCENT,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <form
      onSubmit={handleVerifyOTP}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <p
        style={{
          fontSize: 13,
          color: "rgba(148,163,184,0.65)",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Code sent to{" "}
        <span style={{ color: accent.light, fontWeight: 700 }}>
          {formData.email}
        </span>
      </p>

      <div>
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
          Enter OTP
        </label>
        <input
          className="auth-input"
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="• • • • • •"
          maxLength={6}
          required
          style={inputStyle(focused, accent)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="auth-submit-btn"
        style={{
          width: "100%",
          padding: "13px 0",
          marginTop: 4,
          borderRadius: 12,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          fontWeight: 800,
          fontSize: 15,
          background: loading
            ? "rgba(100,116,139,0.4)"
            : `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
          color: loading ? "rgba(148,163,184,0.6)" : "white",
          boxShadow: loading ? "none" : `0 6px 20px ${accent.glow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: loading ? 0.7 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={handleResendOTP}
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
          opacity: loading ? 0.5 : 1,
          transition: "all 0.3s ease",
        }}
      >
        Resend OTP
      </button>

      <p style={{ textAlign: "center", marginTop: 4 }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(148,163,184,0.6)",
            fontSize: 13,
            fontFamily: "inherit",
            fontWeight: 600,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accent.light)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(148,163,184,0.6)")
          }
        >
          ← Change Email
        </button>
      </p>
    </form>
  );
};

export default VerifyOTP;
